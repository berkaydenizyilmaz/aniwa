// Settings hook - Query + Zustand

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { getUserSettingsAction } from '@/lib/actions/user/settings.actions';
import { useSettingsStore } from '@/lib/stores/settings.store';
import { useEffect } from 'react';
import { GetUserSettingsResponse } from '@/lib/types/api/settings.api';
import { UserRole } from '@prisma/client';

export function useSettings() {
  const { data: session } = useSession();
  const { settings, user, setSettings, setUser, setLoading } = useSettingsStore();

  const query = useQuery({
    queryKey: ['userSettings'],
    queryFn: getUserSettingsAction,
    // Store'da settings varsa API çağrısı yapma
    enabled: !settings,
    // Cache süresini uzat
    staleTime: 30 * 60 * 1000, // 30 dakika
    gcTime: 60 * 60 * 1000, // 1 saat (v5'te cacheTime yerine gcTime)
    refetchOnWindowFocus: false,
  });

  // Settings'i store'a set et
  useEffect(() => {
    if (query.data?.success && query.data.data) {
      const data = query.data.data as GetUserSettingsResponse;
      setSettings(data.settings);
      
      // User bilgilerini session'dan al
      if (session?.user) {
        setUser({
          id: session.user.id,
          username: session.user.username,
          email: session.user.email,
          roles: session.user.roles as UserRole[],
        });
      }
    }
    setLoading(query.isLoading);
  }, [query.data, query.isLoading, session, setSettings, setUser, setLoading]);

  // Store'dan döndür, API'den değil
  return {
    data: settings ? { success: true, data: { settings, user } } : query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
} 