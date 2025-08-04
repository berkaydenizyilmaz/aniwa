// MasterData sabitleri (Genre, Tag, Studio)

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
    
  // Tag kategori etiketleri
  TAG_CATEGORY_LABELS: {
    DEMOGRAPHICS: 'Hedef Kitle',
    THEMES: 'Ana Temalar',
    CONTENT: 'İçerik Niteliği',
    SETTING: 'Ortam',
    ELEMENTS: 'Spesifik Öğeler',
  } as const,
  
  // Studio type etiketleri
  STUDIO_TYPE_LABELS: {
    ANIMATION: 'Animasyon',
    PRODUCTION: 'Prodüksiyon',
  } as const,
  
  // Studio type renkleri (UI için)
  STUDIO_TYPE_COLORS: {
    ANIMATION: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    PRODUCTION: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  } as const,
  
  // Tag kategori renkleri (UI için)
  TAG_CATEGORY_COLORS: {
    DEMOGRAPHICS: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    THEMES: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    CONTENT: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    SETTING: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    ELEMENTS: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  } as const,
  
  // Tag özellik renkleri (UI için)
  TAG_PROPERTY_COLORS: {
    ADULT: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    SPOILER: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  } as const,
} as const; 