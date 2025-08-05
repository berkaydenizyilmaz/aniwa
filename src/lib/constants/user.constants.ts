// User sabitleri

export const USER = {
  // Pagination kuralları
  PAGINATION: {
    MIN_PAGE: 1,
    MAX_LIMIT: 100,
    DEFAULT_LIMIT: 50,
  },
  
  // Role etiketleri
  ROLE_LABELS: {
    USER: 'Kullanıcı',
    MODERATOR: 'Moderatör',
    ADMIN: 'Yönetici',
  } as const,
  
  // Ban durumu renkleri (UI için)
  BAN_STATUS_COLORS: {
    ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    BANNED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  } as const,
  
  // Profile visibility etiketleri
  PROFILE_VISIBILITY_LABELS: {
    PUBLIC: 'Herkese Açık',
    FOLLOWERS_ONLY: 'Sadece Takipçiler',
    PRIVATE: 'Gizli',
  } as const,
  
  // Score format etiketleri
  SCORE_FORMAT_LABELS: {
    POINT_100: '100',
    POINT_10: '10',
    POINT_5: '5',
  } as const,
} as const; 