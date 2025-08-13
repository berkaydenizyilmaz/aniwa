'use client';

import { useSettings } from '@/lib/hooks/use-settings';
import { useUserProfile } from '@/lib/hooks/use-user-profile';

export function StoreInitializer() {
  // Tüm uygulamada store'ları doldur
  useSettings();
  useUserProfile();

  return null; // Bu component sadece side effect için
}
