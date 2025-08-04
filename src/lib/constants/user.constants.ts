// User sabitleri

import { UserRole, ProfileVisibility, Theme, TitleLanguage, ScoreFormat } from '@prisma/client';

export const USER = {
  // Pagination kuralları
  PAGINATION: {
    MIN_PAGE: 1,
    MAX_LIMIT: 100,
    DEFAULT_LIMIT: 50,
  },
  
  // Prisma enum'ları
  ROLES: UserRole,
  PROFILE_VISIBILITY: ProfileVisibility,
  THEME: Theme,
  TITLE_LANGUAGE: TitleLanguage,
  SCORE_FORMAT: ScoreFormat,
  
  // Role etiketleri
  ROLE_LABELS: {
    USER: 'Kullanıcı',
    MODERATOR: 'Moderatör',
    ADMIN: 'Yönetici',
  } as const,
  
  // Profile visibility etiketleri
  PROFILE_VISIBILITY_LABELS: {
    PUBLIC: 'Herkese Açık',
    PRIVATE: 'Gizli',
    FRIENDS_ONLY: 'Sadece Arkadaşlar',
  } as const,
  
  // Theme etiketleri
  THEME_LABELS: {
    LIGHT: 'Açık',
    DARK: 'Koyu',
    SYSTEM: 'Sistem',
  } as const,
  
  // Title language etiketleri
  TITLE_LANGUAGE_LABELS: {
    ROMAJI: 'Romaji',
    ENGLISH: 'İngilizce',
    NATIVE: 'Yerel',
  } as const,
  
  // Score format etiketleri
  SCORE_FORMAT_LABELS: {
    POINT_100: '100 Puan',
    POINT_10: '10 Puan',
    POINT_5: '5 Puan',
  } as const,
} as const; 