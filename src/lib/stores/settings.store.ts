// Settings store - Zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfileSettings } from '@prisma/client';
import { getUserSettingsAction } from '@/lib/actions/user/settings.actions';

interface SettingsState {
  // State
  settings: UserProfileSettings | null;
  ownerUserId: string | null; // Persist edilen settings'in ait olduğu kullanıcı
  isLoading: boolean;

  // Actions
  setSettings: (settings: UserProfileSettings | null) => void;
  setOwnerUserId: (userId: string | null) => void;
  setLoading: (loading: boolean) => void;
  updateSetting: <K extends keyof UserProfileSettings>(
    key: K,
    value: UserProfileSettings[K]
  ) => void;
  refreshSettings: () => Promise<void>;
  reset: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Initial state
      settings: null,
      ownerUserId: null,
      isLoading: false,

      // Actions
      setSettings: (settings) => set({ settings }),
      setOwnerUserId: (userId) => set({ ownerUserId: userId }),
      setLoading: (isLoading) => set({ isLoading }),

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

      refreshSettings: async () => {
        try {
          const result = await getUserSettingsAction();
          if (result && 'success' in result && result.success) {
            set({ settings: result.data as UserProfileSettings });
          }
        } catch (error) {
          console.error('Failed to refresh settings:', error);
        }
      },

      reset: () =>
        set({
          settings: null,
          ownerUserId: null,
          isLoading: false,
        }),
    }),
    {
      name: 'settings-store',
      // Persist edilen minimal state
      partialize: (state) => ({ settings: state.settings, ownerUserId: state.ownerUserId }),
    }
  )
);