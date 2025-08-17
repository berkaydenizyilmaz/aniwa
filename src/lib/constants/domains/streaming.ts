// Streaming domain constants - Streaming platform ve link ile ilgili tüm sabitler

import { SHARED_VALIDATION } from '../shared/validation';

export const STREAMING_DOMAIN = {
  // Validation Rules
  VALIDATION: {
    PLATFORM: {
      NAME: {
        MIN_LENGTH: 1,
        MAX_LENGTH: 100,
      },
      BASE_URL: {
        MAX_LENGTH: 255,
      },
    },
  },
  
  // Business Rules
  BUSINESS: {
    PAGINATION: SHARED_VALIDATION.PAGINATION,
  },
} as const;
