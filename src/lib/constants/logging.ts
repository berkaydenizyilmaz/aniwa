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
  AUTH: 'auth',
  DATABASE: 'database',
  API_CALL: 'api_call',
  USER_ACTION: 'user_action',
} as const

// Performance eşikleri (ms)
export const PERFORMANCE_THRESHOLDS = {
  SLOW_OPERATION: 1000,
  VERY_SLOW_OPERATION: 5000,
  CRITICAL_OPERATION: 10000,
} as const 