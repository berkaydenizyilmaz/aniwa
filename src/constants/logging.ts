import { LogLevel } from "@prisma/client"

// =============================================================================
// LOGGING SABITLERI
// =============================================================================

export const LOG_EVENTS = {
  // Auth events
  AUTH_LOGIN_FAILED: 'auth_login_failed',
  AUTH_SIGNIN_ERROR: 'auth_signin_error',

  // User events
  USER_CREATED: 'user_created',
  USER_REGISTERED: 'user_registered',
  USER_REGISTRATION_FAILED: 'user_registration_failed',

  // Password events
  PASSWORD_RESET_REQUEST_FAILED: 'password_reset_request_failed',
  PASSWORD_UPDATE_FAILED: 'password_update_failed',

  // Email events
  EMAIL_SEND_ERROR: 'email_send_error',
  EMAIL_TEMPLATE_ERROR: 'email_template_error',
  EMAIL_SERVICE_ERROR: 'email_service_error',

  // Rate limit events
  RATE_LIMIT_DISABLED: 'rate_limit_disabled',
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
  RATE_LIMIT_ERROR: 'rate_limit_error',
  RATE_LIMIT_REDIS_ERROR: 'rate_limit_redis_error',

  // System events
  SYSTEM_ERROR: 'system_error',
  SYSTEM_WARNING: 'system_warning',
  SYSTEM_INFO: 'system_info',
} as const;

// Hassas veri alanları - loglardan çıkarılacak
export const SENSITIVE_FIELDS = [
  'password',
  'token',
  'secret',
  'apiKey',
  'privateKey',
  'sessionId',
  'refreshToken',
  'accessToken',
] as const

// LogLevel'ı re-export et
export { LogLevel } from '@prisma/client'