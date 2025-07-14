import { LogLevel } from "@prisma/client"

// =============================================================================
// LOGGING SABITLERI
// =============================================================================

export const LOG_EVENTS = {
  // Auth events - Kullanımda olanlar
  AUTH_LOGIN_FAILED: 'auth:login:failed',
  AUTH_LOGIN_ERROR: 'auth:login:error',
  AUTH_SIGNIN_ERROR: 'auth:signin:error',
  
  // User events - Kullanımda olanlar
  USER_CREATED: 'user:created',
  USER_REGISTERED: 'user:registered',
  USER_REGISTRATION_FAILED: 'user:registration:failed',
  
  // Password events - Kullanımda olanlar
  PASSWORD_UPDATE_FAILED: 'password:update:failed',
  PASSWORD_RESET_REQUEST_FAILED: 'password:reset:request:failed', 
  PASSWORD_RESET_TOKEN_VERIFICATION_FAILED: 'password:reset:token:verification:failed',
  PASSWORD_RESET_FAILED: 'password:reset:failed',
  
  // Email events - Kullanımda olanlar
  EMAIL_SEND_ERROR: 'email:send:error',
  PASSWORD_RESET_EMAIL_SEND_ERROR: 'email:password_reset:send:error',
  PASSWORD_CHANGE_NOTIFICATION_EMAIL_SEND_ERROR: 'email:password_change:notification:send:error',
  
  // System events - Temel olanlar
  SYSTEM_ERROR: 'system:error',
  SYSTEM_WARNING: 'system:warning', 
  SYSTEM_INFO: 'system:info',
  
  // Rate limiting events
  RATE_LIMIT_DISABLED: 'rate_limit:disabled',
  RATE_LIMIT_CREATE_ERROR: 'rate_limit:create:error',
  RATE_LIMIT_CHECK_ERROR: 'rate_limit:check:error',
  RATE_LIMIT_EXCEEDED: 'rate_limit:exceeded',
} as const

// Log level priority mapping
export const LOG_LEVEL_PRIORITY = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
} as const

// Log retention periods (in days)
export const LOG_RETENTION = {
  ERROR: 90,   // 3 ay
  WARN: 30,    // 1 ay
  INFO: 7,     // 1 hafta
  DEBUG: 1,    // 1 gün
} as const

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