// Aniwa Projesi - Genel Uygulama Sabitleri
// Bu dosya tüm uygulama genelinde kullanılan sabitleri içerir

// HTTP Status Kodları
export const HTTP_STATUS = {
  // Success
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  
  // Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  
  // Server Errors
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const

// Pagination Varsayılan Değerleri
export const PAGINATION_DEFAULTS = {
  LIMIT: 50,
  OFFSET: 0,
  MAX_LIMIT: 100,
} as const

// Tema Tercihleri
export const THEME_PREFERENCES = ['light', 'dark', 'system'] as const
export const DEFAULT_THEME = 'system' as const

// Dil Tercihleri
export const TITLE_LANGUAGE_PREFERENCES = ['ROMANJI', 'ENGLISH'] as const
export const DEFAULT_TITLE_LANGUAGE = 'ROMANJI' as const

// Tip tanımlamaları
export type ThemePreference = typeof THEME_PREFERENCES[number]