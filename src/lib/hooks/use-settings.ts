import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { getUserSettingsAction } from '@/lib/actions/user/settings.actions';
import { useSettingsStore } from '@/lib/stores/settings.store';
import { GetUserSettingsResponse } from '@/lib/types/api/settings.api';

export function useSettings() {
  const { data: session } = useSession();
  const { setSettings } = useSettingsStore();

  const query = useQuery({
    queryKey: ['user', session?.user?.id, 'settings'],
    queryFn: () => getUserSettingsAction(),
    enabled: !!session?.user?.id,
    staleTime: 5 * 60 * 1000, // 5 dakika
    gcTime: 10 * 60 * 1000, // 10 dakika
  });

  // Store'u güncelle
  if (query.data && 'success' in query.data && query.data.success) {
    setSettings(query.data.data as GetUserSettingsResponse);
  }

  return query;
}
