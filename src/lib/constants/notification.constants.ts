// Notification sabitleri

import { NotificationType } from '@prisma/client';

export const NOTIFICATION = {
  // Notification type etiketleri
  TYPE_LABELS: {
    NEW_FOLLOWER: 'Yeni Takipçi',
    NEW_EPISODE_AIRING: 'Yeni Bölüm Yayınlandı',
    NEW_MEDIA_PART: 'Yeni Medya Parçası Eklendi',
  } as const,
  
  // Notification type renkleri (UI için)
  TYPE_COLORS: {
    NEW_FOLLOWER: 'text-blue-600',
    NEW_EPISODE_AIRING: 'text-green-600',
    NEW_MEDIA_PART: 'text-purple-600',
  } as const,
} as const; 