'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSettingsStore } from '@/lib/stores/settings.store';
import { useUserProfileStore } from '@/lib/stores/userProfile.store';
import { getUserSettingsAction } from '@/lib/actions/user/settings.actions';
import { getUserProfileAction } from '@/lib/actions/user/settings.actions';
import { GetUserSettingsResponse } from '@/lib/types/api/settings.api';
import { GetUserProfileResponse } from '@/lib/types/api/settings.api';

export function StoreInitializer() {
  const { data: session } = useSession();
  const { setSettings } = useSettingsStore();
  const { setProfile } = useUserProfileStore();

  useEffect(() => {
    if (session?.user?.id) {
      // Settings'i yükle
      getUserSettingsAction().then((result) => {
        if (result && 'success' in result && result.success) {
          setSettings(result.data as GetUserSettingsResponse);
        }
      });

      // Profile'ı yükle
      getUserProfileAction().then((result) => {
        if (result && 'success' in result && result.success) {
          setProfile(result.data as GetUserProfileResponse);
        }
      });
    } else {
      // Session yoksa store'ları temizle
      setSettings(null);
      setProfile(null);
    }
  }, [session?.user?.id, setSettings, setProfile]);

  return null; // Bu component sadece side effect için
}
