// Settings store - Zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfileSettings } from '@prisma/client';
import { GetUserProfileResponse } from '@/lib/types/api/settings.api';

interface SettingsState {
  // User Settings
  settings: UserProfileSettings | null;
  
  // User Profile
  profile: GetUserProfileResponse | null;
  
  // UI State
  isLoading: boolean;
  isUpdating: boolean;
  
  // Actions
  setSettings: (settings: UserProfileSettings | null) => void;
  setProfile: (profile: GetUserProfileResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setUpdating: (updating: boolean) => void;
  
  // Settings Updates
  updateSetting: <K extends keyof UserProfileSettings>(
    key: K,
    value: UserProfileSettings[K]
  ) => void;
  
  // Profile Updates
  updateProfileField: <K extends keyof GetUserProfileResponse>(
    key: K,
    value: GetUserProfileResponse[K]
  ) => void;
  
  // Reset
  reset: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Initial state
      settings: null,
      profile: null,
      isLoading: false,
      isUpdating: false,

      // Actions
      setSettings: (settings) => set({ settings }),
      setProfile: (profile) => set({ profile }),
      setLoading: (isLoading) => set({ isLoading }),
      setUpdating: (isUpdating) => set({ isUpdating }),

      // Settings Updates
      updateSetting: (key, value) => {
        const { settings } = get();
        if (settings) {
          set({
            settings: {
              ...settings,
              [key]: value
            }
          });
        }
      },

      // Profile Updates
      updateProfileField: (key, value) => {
        const { profile } = get();
        if (profile) {
          set({
            profile: {
              ...profile,
              [key]: value
            }
          });
        }
      },

      // Reset
      reset: () => set({
        settings: null,
        profile: null,
        isLoading: false,
        isUpdating: false
      }),
    }),
    {
      name: 'aniwa-settings-store',
      partialize: (state) => ({
        settings: state.settings,
        profile: state.profile,
      }),
    }
  )
);
