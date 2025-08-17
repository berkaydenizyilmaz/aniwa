// User domain constants - Kullanıcı ile ilgili tüm sabitler

import { SHARED_VALIDATION } from '../shared/validation';
import { SHARED_UI } from '../shared/ui';

export const USER_DOMAIN = {
  // Validation Rules
  VALIDATION: {
    PAGINATION: SHARED_VALIDATION.PAGINATION,
  },
  
  // Business Rules
  BUSINESS: {
    // User specific business rules can be added here
  },
  
  // UI Presentation
  UI: {
    ROLE_LABELS: {
      USER: 'Kullanıcı',
      MODERATOR: 'Moderatör',
      ADMIN: 'Yönetici',
    },
    BAN_STATUS_COLORS: {
      ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      BANNED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    },
    PROFILE_VISIBILITY_LABELS: {
      PUBLIC: 'Herkese Açık',
      FOLLOWERS_ONLY: 'Sadece Takipçiler',
      PRIVATE: 'Gizli',
    },
    SCORE_FORMAT_LABELS: {
      POINT_100: '100',
      POINT_10: '10',
      POINT_5: '5',
    },
  },
} as const;
