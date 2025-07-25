// MasterData sabitleri (Genre, Tag, Studio)

import { TagCategory } from '@prisma/client';

export const MASTER_DATA = {
  // Name kuralları (Genre, Tag, Studio için ortak)
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
  },
  
  // Description kuralları
  DESCRIPTION: {
    MAX_LENGTH: 200, // Tag için
  },
  
  // Pagination kuralları
  PAGINATION: {
    MIN_PAGE: 1,
    MAX_LIMIT: 100,
    DEFAULT_LIMIT: 50,
  },
  
  // Prisma enum'ları
  TAG_CATEGORY: TagCategory,
  
  // Tag kategori etiketleri
  TAG_CATEGORY_LABELS: {
    DEMOGRAPHICS: 'Hedef Kitle',
    THEMES: 'Ana Temalar',
    CONTENT: 'İçerik Niteliği',
    SETTING: 'Ortam',
    ELEMENTS: 'Spesifik Öğeler',
  } as const,
} as const; 