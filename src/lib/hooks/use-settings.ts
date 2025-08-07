// Settings hook - Query + Zustand

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { getUserSettingsAction } from '@/lib/actions/user/settings.actions';
import { useSettingsStore } from '@/lib/stores/settings.store';
import { useEffect } from 'react';
import { GetUserSettingsResponse } from '@/lib/types/api/settings.api';

export function useSettings() {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const { settings, ownerUserId, setSettings, setOwnerUserId, setLoading, setUserProfile } = useSettingsStore();

  const userId = session?.user?.id ?? null;

  // Eğer persist edilen settings başka bir kullanıcıya aitse sıfırla
  useEffect(() => {
    if (userId && ownerUserId && ownerUserId !== userId) {
      setSettings(null);
      setOwnerUserId(userId);
      // İlgili cache'i de temizle
      queryClient.removeQueries({ queryKey: ['user', ownerUserId, 'settings'] });
    }
    if (userId && !ownerUserId) {
      setOwnerUserId(userId);
    }
  }, [userId, ownerUserId, setSettings, setOwnerUserId, queryClient]);

  const query = useQuery({
    queryKey: ['user', userId, 'settings'],
    queryFn: getUserSettingsAction,
    enabled: status === 'authenticated' && !!userId,
    staleTime: 30 * 60 * 1000, // 30 dakika
    gcTime: 60 * 60 * 1000, // 1 saat
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.data?.success && query.data.data) {
      const data = query.data.data as GetUserSettingsResponse;
      setSettings(data.settings);
      setUserProfile(data.user);
    }
    setLoading(query.isLoading);
  }, [query.data, query.isLoading, setSettings, setLoading]);

  return {
    data: settings ? { success: true, data: { settings } } : query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}