/**
 * Logging ile ilgili sabitler
 */
import { LogLevel } from "@prisma/client";

// Log seviyeleri için Prisma enum'unu yeniden export et
export { LogLevel };

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
  AUTH_SIGNIN_ERROR: 'auth_signin_error',
  AUTH_SESSION_ERROR: 'auth_session_error',
  AUTH_USERNAME_CHECK: 'auth_username_check',
  
  // Email verification events
  AUTH_EMAIL_VERIFICATION_SENT: 'auth_email_verification_sent',
  AUTH_EMAIL_VERIFICATION_SUCCESS: 'auth_email_verification_success',
  AUTH_EMAIL_VERIFICATION_FAILED: 'auth_email_verification_failed',
  
  // Password reset events
  AUTH_PASSWORD_RESET_REQUESTED: 'auth_password_reset_requested',
  AUTH_PASSWORD_RESET_SUCCESS: 'auth_password_reset_success',
  AUTH_PASSWORD_RESET_FAILED: 'auth_password_reset_failed',
  
  // Additional auth events
  AUTH_EMAIL_VERIFIED: 'auth_email_verified',
  AUTH_PASSWORD_CHANGED: 'auth_password_changed',
  
  // Database events
  DATABASE_ERROR: 'database_error',
  DATABASE_READ: 'database_read',
  
  // Service events
  SERVICE_ERROR: 'service_error',
  
  // API events
  API_ERROR: 'api_error',
} as const

// Performance eşikleri (ms)
export const PERFORMANCE_THRESHOLDS = {
  SLOW_OPERATION: 1000,
  VERY_SLOW_OPERATION: 5000,
  CRITICAL_OPERATION: 10000,
} as const