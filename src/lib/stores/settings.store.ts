// Settings store - Zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserProfileSettings } from '@prisma/client';

interface SettingsState {
  // State
  settings: UserProfileSettings | null;
  user: Partial<User> | null;
  isLoading: boolean;
  
  // Actions
  setSettings: (settings: UserProfileSettings | null) => void;
  setUser: (user: Partial<User> | null) => void;
  setLoading: (loading: boolean) => void;
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
      user: null,
      isLoading: false,

      // Actions
      setSettings: (settings) => set({ settings }),
      setUser: (user) => set({ user }),
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

      reset: () => set({
        settings: null,
        user: null,
        isLoading: false,
      }),
    }),
    {
      name: 'settings-store',
      // Sadece settings'i persist et, user'ı session'dan alacağız
      partialize: (state) => ({ settings: state.settings }),
    }
  )
); 