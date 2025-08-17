// MasterData domain constants - Genre, Tag, Studio ile ilgili tüm sabitler

import { SHARED_VALIDATION } from '../shared/validation';
import { SHARED_UI } from '../shared/ui';

export const MASTER_DATA_DOMAIN = {
  // Validation Rules (inherits from shared)
  VALIDATION: {
    NAME: SHARED_VALIDATION.NAME,
    DESCRIPTION: SHARED_VALIDATION.DESCRIPTION,
  },
  
  // Business Rules
  BUSINESS: {
    PAGINATION: SHARED_VALIDATION.PAGINATION,
  },
  
  // UI Presentation
  UI: {
    TAG_CATEGORY_LABELS: {
      DEMOGRAPHICS: 'Hedef Kitle',
      THEMES: 'Ana Temalar',
      CONTENT: 'İçerik Niteliği',
      SETTING: 'Ortam',
      ELEMENTS: 'Spesifik Öğeler',
    },
    STUDIO_TYPE_LABELS: {
      ANIMATION: 'Animasyon',
      PRODUCTION: 'Prodüksiyon',
    },
    STUDIO_TYPE_COLORS: {
      ANIMATION: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      PRODUCTION: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    },
    TAG_CATEGORY_COLORS: {
      DEMOGRAPHICS: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      THEMES: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      CONTENT: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      SETTING: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      ELEMENTS: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    },
    TAG_PROPERTY_COLORS: {
      ADULT: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      SPOILER: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    },
  },
} as const;
