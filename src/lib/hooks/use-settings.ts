// Settings hook - Query + Zustand

import { useQuery } from '@tanstack/react-query';
import { getUserSettingsAction } from '@/lib/actions/user/settings.actions';
import { useSettingsStore } from '@/lib/stores/settings.store';
import { useEffect } from 'react';
import { GetUserSettingsResponse } from '@/lib/types/api/settings.api';

export function useSettings() {
  const { setSettings, setUser, setLoading } = useSettingsStore();

  const query = useQuery({
    queryKey: ['userSettings'],
    queryFn: getUserSettingsAction,
  });

  // Settings'i store'a set et
  useEffect(() => {
    if (query.data?.success && query.data.data) {
      const data = query.data.data as GetUserSettingsResponse;
      setSettings(data.settings);
      setUser(data.user);
    }
    setLoading(query.isLoading);
  }, [query.data, query.isLoading, setSettings, setUser, setLoading]);

  return query;
} 