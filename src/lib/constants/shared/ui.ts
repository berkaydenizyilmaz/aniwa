// Shared UI constants - Tüm domain'lerde ortak kullanılan UI sabitleri

export const SHARED_UI = {
  // Ortak renk paleti
  COLORS: {
    PRIMARY: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    SECONDARY: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    SUCCESS: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    ERROR: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    WARNING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    INFO: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  
  // Ortak boyutlar
  SIZES: {
    AVATAR: {
      SM: 32,
      MD: 48,
      LG: 64,
    },
    THUMBNAIL: {
      SM: 150,
      MD: 300,
      LG: 600,
    },
  },
} as const;
