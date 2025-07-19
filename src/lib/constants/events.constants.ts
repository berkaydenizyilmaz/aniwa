// Log event sabitleri

export const EVENTS = {
  // Auth Events
  AUTH: {
    USER_REGISTERED: 'user_registered',
  },
  
  // System Events
  SYSTEM: {
    EMAIL_SEND_FAILED: 'email_send_failed',
    API_ERROR: 'api_error',
  },
} as const; 