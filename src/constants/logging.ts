// Aniwa Projesi - Logging Constants
// Bu dosya logging ile ilgili sabitleri içerir

import { LogLevel } from "@prisma/client"

// =============================================================================
// LOGGING SABITLERI
// =============================================================================

export const LOG_EVENTS = {
  // Auth events
  AUTH_LOGIN_SUCCESS: 'auth:login:success',
  AUTH_LOGIN_FAILED: 'auth:login:failed',
  AUTH_LOGOUT: 'auth:logout',
  AUTH_SIGNUP_SUCCESS: 'auth:signup:success',
  AUTH_SIGNUP_FAILED: 'auth:signup:failed',
  AUTH_PASSWORD_RESET_REQUESTED: 'auth:password_reset:requested',
  AUTH_PASSWORD_RESET_SUCCESS: 'auth:password_reset:success',
  AUTH_PASSWORD_RESET_FAILED: 'auth:password_reset:failed',
  
  // User events
  USER_CREATED: 'user:created',
  USER_UPDATED: 'user:updated',
  USER_DELETED: 'user:deleted',
  USER_ROLE_CHANGED: 'user:role:changed',
  
  // Anime events
  ANIME_CREATED: 'anime:created',
  ANIME_UPDATED: 'anime:updated',
  ANIME_DELETED: 'anime:deleted',
  ANIME_LIST_UPDATED: 'anime:list:updated',
  
  // System events
  SYSTEM_ERROR: 'system:error',
  SYSTEM_WARNING: 'system:warning',
  SYSTEM_INFO: 'system:info',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'rate_limit:exceeded',
  RATE_LIMIT_WARNING: 'rate_limit:warning',
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