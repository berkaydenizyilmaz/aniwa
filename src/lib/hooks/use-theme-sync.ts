// Theme sync hook - Settings store'dan tema tercihini alıp theme provider'a aktarır

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useSettingsStore } from '@/lib/stores/settings.store';
import { Theme } from '@prisma/client';

export function useThemeSync() {
  const { setTheme } = useTheme();
  const { settings } = useSettingsStore();

  useEffect(() => {
    if (settings?.themePreference) {
      // Prisma enum'ını next-themes formatına çevir
      const themeMap: Record<Theme, string> = {
        [Theme.SYSTEM]: 'system',
        [Theme.LIGHT]: 'light',
        [Theme.DARK]: 'dark',
      };

      const nextTheme = themeMap[settings.themePreference];
      if (nextTheme) {
        setTheme(nextTheme);
      }
    }
  }, [settings?.themePreference, setTheme]);
}
