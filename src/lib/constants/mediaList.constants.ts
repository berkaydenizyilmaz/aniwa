// MediaList sabitleri

import { MediaListStatus } from '@prisma/client';

export const MEDIA_LIST = {
  // Media list status etiketleri
  STATUS_LABELS: {
    CURRENT: 'İzleniyor',
    PLANNING: 'Planlıyor',
    COMPLETED: 'Tamamlandı',
    DROPPED: 'Yarıda Bırakıldı',
    PAUSED: 'Duraklatıldı',
    REPEATING: 'Tekrar Ediyor',
  } as const,
  
  // Status renkleri (UI için)
  STATUS_COLORS: {
    CURRENT: 'text-blue-600',
    PLANNING: 'text-yellow-600',
    COMPLETED: 'text-green-600',
    DROPPED: 'text-red-600',
    PAUSED: 'text-orange-600',
    REPEATING: 'text-purple-600',
  } as const,
} as const; 