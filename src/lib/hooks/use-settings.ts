// Settings hook - React Query + Zustand

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { getUserSettingsAction, getUserProfileAction } from '@/lib/actions/user/settings.actions';
import { useSettingsStore } from '@/lib/stores/settings.store';
import { GetUserSettingsResponse, GetUserProfileResponse } from '@/lib/types/api/settings.api';

export function useSettings() {
  const { data: session } = useSession();
  const { setSettings, setProfile, setLoading } = useSettingsStore();

  const settingsQuery = useQuery({
    queryKey: ['user', session?.user?.id, 'settings'],
    queryFn: () => getUserSettingsAction(),
    enabled: !!session?.user?.id,
    staleTime: 5 * 60 * 1000, // 5 dakika
    gcTime: 10 * 60 * 1000, // 10 dakika
  });

  const profileQuery = useQuery({
    queryKey: ['user', session?.user?.id, 'profile'],
    queryFn: () => getUserProfileAction(),
    enabled: !!session?.user?.id,
    staleTime: 5 * 60 * 1000, // 5 dakika
    gcTime: 10 * 60 * 1000, // 10 dakika
  });

  // Store'u güncelle
  if (settingsQuery.data && 'success' in settingsQuery.data && settingsQuery.data.success) {
    setSettings(settingsQuery.data.data as GetUserSettingsResponse);
  }

  if (profileQuery.data && 'success' in profileQuery.data && profileQuery.data.success) {
    setProfile(profileQuery.data.data as GetUserProfileResponse);
  }

  // Loading state'i güncelle
  if (settingsQuery.isLoading || profileQuery.isLoading) {
    setLoading(true);
  } else {
    setLoading(false);
  }

  return {
    settings: settingsQuery.data?.success ? settingsQuery.data.data : null,
    profile: profileQuery.data?.success ? profileQuery.data.data : null,
    isLoading: settingsQuery.isLoading || profileQuery.isLoading,
    isError: settingsQuery.isError || profileQuery.isError,
    error: settingsQuery.error || profileQuery.error,
    refetch: () => {
      settingsQuery.refetch();
      profileQuery.refetch();
    }
  };
}
