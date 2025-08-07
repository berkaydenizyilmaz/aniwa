// Settings store - Zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfileSettings } from '@prisma/client';
import type { GetUserSettingsResponse } from '@/lib/types/api/settings.api';

interface SettingsState {
  // State
  settings: UserProfileSettings | null;
  ownerUserId: string | null; // Persist edilen settings'in ait olduğu kullanıcı
  isLoading: boolean;
  userProfile: GetUserSettingsResponse['user'] | null; // Persist edilmez

  // Actions
  setSettings: (settings: UserProfileSettings | null) => void;
  setOwnerUserId: (userId: string | null) => void;
  setLoading: (loading: boolean) => void;
  setUserProfile: (user: GetUserSettingsResponse['user'] | null) => void;
  updateSetting: <K extends keyof UserProfileSettings>(
    key: K,
    value: UserProfileSettings[K]
  ) => void;
  reset: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Initial state
      settings: null,
      ownerUserId: null,
      isLoading: false,
      userProfile: null,

      // Actions
      setSettings: (settings) => set({ settings }),
      setOwnerUserId: (userId) => set({ ownerUserId: userId }),
      setLoading: (isLoading) => set({ isLoading }),
      setUserProfile: (user) => set({ userProfile: user }),

      updateSetting: (key, value) => {
        const { settings } = get();
        if (settings) {
          set({
            settings: {
              ...settings,
              [key]: value,
            },
          });
        }
      },

      reset: () =>
        set({
          settings: null,
          ownerUserId: null,
          isLoading: false,
          userProfile: null,
        }),
    }),
    {
      name: 'settings-store',
      // Persist edilen minimal state
      partialize: (state) => ({ settings: state.settings, ownerUserId: state.ownerUserId }),
    }
  )
);