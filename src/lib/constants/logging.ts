/**
 * Logging ile ilgili sabitler
 */

// Log seviyeleri - Prisma enum ile tutarlı
export const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
} as const

// Log levels tipini export et
export type LogLevelType = typeof LOG_LEVELS[keyof typeof LOG_LEVELS]

// Hassas veriler - redaction için
export const SENSITIVE_FIELDS = [
  'password',
  'token',
  'apiKey',
  'authorization',
  'cookie',
  'email',
  'phone',
  'creditCard',
  'ssn',
  'req.headers.authorization',
  'req.headers.cookie',
] as const

// Sensitive fields tipini export et
export type SensitiveField = typeof SENSITIVE_FIELDS[number]

// Log event türleri
export const LOG_EVENTS = {
  HTTP_REQUEST: 'http_request',
  EXCEPTION: 'exception',
  PERFORMANCE: 'performance',
  DATABASE: 'database',
  API_CALL: 'api_call',
  USER_ACTION: 'user_action',
  
  // Auth events
  AUTH_LOGIN_SUCCESS: 'auth_login_success',
  AUTH_LOGIN_FAILED: 'auth_login_failed',
  AUTH_LOGOUT_SUCCESS: 'auth_logout_success',
  AUTH_SIGNUP_SUCCESS: 'auth_signup_success',
  AUTH_SIGNUP_FAILED: 'auth_signup_failed',
  AUTH_OAUTH_SUCCESS: 'auth_oauth_success',
  AUTH_OAUTH_FAILED: 'auth_oauth_failed',
  AUTH_USER_CREATED: 'auth_user_created',
  AUTH_USER_SETTINGS_ERROR: 'auth_user_settings_error',
  AUTH_SIGNIN_ERROR: 'auth_signin_error',
  AUTH_SESSION_ERROR: 'auth_session_error',
} as const

// Log events tipini export et
export type LogEventType = typeof LOG_EVENTS[keyof typeof LOG_EVENTS]

// Performance eşikleri (ms)
export const PERFORMANCE_THRESHOLDS = {
  SLOW_OPERATION: 1000,
  VERY_SLOW_OPERATION: 5000,
  CRITICAL_OPERATION: 10000,
} as const

// Performance threshold tipini export et
export type PerformanceThreshold = typeof PERFORMANCE_THRESHOLDS[keyof typeof PERFORMANCE_THRESHOLDS]

// HTTP status code kategorileri
export const HTTP_STATUS_CATEGORIES = {
  SUCCESS: [200, 201, 202, 204],
  CLIENT_ERROR: [400, 401, 403, 404, 422],
  SERVER_ERROR: [500, 502, 503, 504],
} as const

// HTTP status code eşikleri
export const HTTP_STATUS_THRESHOLDS = {
  CLIENT_ERROR: 400,
  SERVER_ERROR: 500,
} as const

// Pagination varsayılan değerleri
export const PAGINATION_DEFAULTS = {
  LIMIT: 50,
  OFFSET: 0,
  MAX_LIMIT: 100,
} as const

// Log temizleme varsayılan değerleri
export const LOG_CLEANUP_DEFAULTS = {
  OLDER_THAN_DAYS: 30,
  MAX_OLDER_THAN_DAYS: 365,
} as const

// Tip tanımlamaları
export type HttpStatusCategory = typeof HTTP_STATUS_CATEGORIES[keyof typeof HTTP_STATUS_CATEGORIES]
export type HttpStatusThreshold = typeof HTTP_STATUS_THRESHOLDS[keyof typeof HTTP_STATUS_THRESHOLDS] 