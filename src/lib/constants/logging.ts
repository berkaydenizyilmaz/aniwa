/**
 * Logging ile ilgili sabitler
 */

// Log seviyeleri
export const LOG_LEVELS = {
  TRACE: 'trace',
  DEBUG: 'debug', 
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  FATAL: 'fatal',
} as const

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

// Performance eşikleri (ms)
export const PERFORMANCE_THRESHOLDS = {
  SLOW_OPERATION: 1000,
  VERY_SLOW_OPERATION: 5000,
  CRITICAL_OPERATION: 10000,
} as const 