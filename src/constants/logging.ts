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

// Log event türleri - Sadece business-critical olaylar
export const LOG_EVENTS = {
  // System events
  SYSTEM_ERROR: 'system_error',
  SYSTEM_WARNING: 'system_warning',
  
  // User lifecycle events (Admin panelinde görünecek)
  USER_REGISTERED: 'user_registered',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  USER_PASSWORD_CHANGED: 'user_password_changed',
  USER_ACCOUNT_LOCKED: 'user_account_locked',
  USER_ACCOUNT_DELETED: 'user_account_deleted',
  
  // Authentication failures (Security)
  LOGIN_FAILED: 'login_failed',
  REGISTRATION_FAILED: 'registration_failed',
  PASSWORD_RESET_FAILED: 'password_reset_failed',
  
  // Rate limiting (Security)
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  
  // Email operations (Business critical)
  EMAIL_SENT: 'email_sent',
  EMAIL_FAILED: 'email_failed',
  
  // Verification token operations (Business critical)
  VERIFICATION_TOKEN_CREATED: 'verification_token_created',
  VERIFICATION_TOKEN_VERIFIED: 'verification_token_verified',
  VERIFICATION_TOKEN_FAILED: 'verification_token_failed',
  VERIFICATION_TOKEN_CLEANUP: 'verification_token_cleanup',
  
  // Database critical errors (Only major issues)
  DATABASE_CONNECTION_ERROR: 'database_connection_error',
  DATABASE_MIGRATION_ERROR: 'database_migration_error',
  
  // External API critical errors
  EXTERNAL_API_ERROR: 'external_api_error',
  API_CALL: 'api_call',
  
  // Admin actions (Audit trail)
  ADMIN_ACTION: 'admin_action',
  MODERATOR_ACTION: 'moderator_action',
  
  // Business service events
  AUTH_SIGNUP_SUCCESS: 'auth_signup_success',
  AUTH_PASSWORD_RESET_REQUESTED: 'auth_password_reset_requested',
  AUTH_PASSWORD_RESET_SUCCESS: 'auth_password_reset_success',
  AUTH_PASSWORD_RESET_FAILED: 'auth_password_reset_failed',
  AUTH_USERNAME_CHECK: 'auth_username_check',
  AUTH_LOGIN_SUCCESS: 'auth_login_success',
  AUTH_LOGIN_FAILED: 'auth_login_failed',
  AUTH_LOGOUT_SUCCESS: 'auth_logout_success',
  AUTH_SIGNIN_ERROR: 'auth_signin_error',
  AUTH_OAUTH_SUCCESS: 'auth_oauth_success',
  AUTH_USER_CREATED: 'auth_user_created',
  API_ERROR: 'api_error',
  SERVICE_ERROR: 'service_error',
} as const

// Performance eşikleri (ms)
export const PERFORMANCE_THRESHOLDS = {
  SLOW_OPERATION: 1000,
  VERY_SLOW_OPERATION: 5000,
  CRITICAL_OPERATION: 10000,
} as const