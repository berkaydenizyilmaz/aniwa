'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAppStore } from '@/lib/stores/use-app-store';
import { Theme } from '@prisma/client';

interface ThemeContextType {
  theme: Theme | null;
  setTheme: (theme: Theme) => void;
  clearTheme: () => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme, clearTheme } = useAppStore();
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = window.document.documentElement;

    const updateTheme = () => {
      let newTheme: 'light' | 'dark';

      // Kullanıcı teması yoksa SYSTEM kullan
      const currentTheme = theme ?? Theme.SYSTEM;

      if (currentTheme === 'SYSTEM') {
        newTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      } else {
        newTheme = currentTheme.toLowerCase() as 'light' | 'dark';
      }

      setResolvedTheme(newTheme);
      root.classList.remove('light', 'dark');
      root.classList.add(newTheme);
    };

    updateTheme();

    // System theme değişikliklerini dinle
    const currentTheme = theme ?? Theme.SYSTEM;
    if (currentTheme === 'SYSTEM') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, clearTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 