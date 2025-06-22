// Aniwa Projesi - Genel Uygulama Sabitleri
// Bu dosya tüm uygulama genelinde kullanılan sabitleri içerir

// HTTP Status Code Kategorileri
export const HTTP_STATUS_CATEGORIES = {
  SUCCESS: [200, 201, 202, 204],
  CLIENT_ERROR: [400, 401, 403, 404, 422],
  SERVER_ERROR: [500, 502, 503, 504],
} as const

// HTTP Status Code Eşikleri
export const HTTP_STATUS_THRESHOLDS = {
  CLIENT_ERROR: 400,
  SERVER_ERROR: 500,
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
export const LANGUAGE_PREFERENCES = ['tr'] as const
export const DEFAULT_LANGUAGE = 'tr' as const

// Genel Email Validasyonu
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Tip tanımlamaları
export type HttpStatusCategory = typeof HTTP_STATUS_CATEGORIES[keyof typeof HTTP_STATUS_CATEGORIES]
export type HttpStatusThreshold = typeof HTTP_STATUS_THRESHOLDS[keyof typeof HTTP_STATUS_THRESHOLDS]
export type ThemePreference = typeof THEME_PREFERENCES[number]
export type LanguagePreference = typeof LANGUAGE_PREFERENCES[number]

// Email Template Sabitleri
export const EMAIL_TEMPLATES = {
  FROM_ADDRESS: 'Aniwa <noreply@aniwa.tr>',
  BRAND_NAME: 'aniwa',
  BRAND_COLORS: {
    PRIMARY_GRADIENT: 'linear-gradient(135deg, #8b5cf6, #06b6d4, #10b981)',
    BUTTON_GRADIENT: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
  },
  STYLES: {
    CONTAINER_MAX_WIDTH: '600px',
    BORDER_RADIUS: '12px',
    BUTTON_PADDING: '14px 28px',
  }
} as const

export const EMAIL_SUBJECTS = {
  EMAIL_VERIFICATION: 'Aniwa - Email Adresinizi Doğrulayın',
  PASSWORD_RESET: 'Aniwa - Şifre Sıfırlama',
  PASSWORD_CHANGED: 'Aniwa - Şifreniz Değiştirildi',
} as const 