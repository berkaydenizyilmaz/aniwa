import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme } from '@prisma/client';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: Theme.SYSTEM,
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'aniwa-theme',
    }
  )
); 