'use client';

import { useThemeSync } from '@/lib/hooks/use-theme-sync';

interface ThemeSyncProviderProps {
  children: React.ReactNode;
}

export function ThemeSyncProvider({ children }: ThemeSyncProviderProps) {
  // Tema senkronizasyonunu başlat
  useThemeSync();

  return <>{children}</>;
}
