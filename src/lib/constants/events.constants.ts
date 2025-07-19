// Log event sabitleri

export const EVENTS = {
  // Auth Events
  AUTH: {
    USER_REGISTERED: 'user_registered',
    USER_LOGIN: 'user_login',
    USER_LOGOUT: 'user_logout',
    PASSWORD_RESET_REQUESTED: 'password_reset_requested',
    PASSWORD_RESET_COMPLETED: 'password_reset_completed',
    LOGIN_FAILED: 'login_failed',
  },
  
  // System Events
  SYSTEM: {
    DATABASE_ERROR: 'database_error',
    EMAIL_SEND_FAILED: 'email_send_failed',
    API_ERROR: 'api_error',
    VALIDATION_ERROR: 'validation_error',
  },
} as const; 