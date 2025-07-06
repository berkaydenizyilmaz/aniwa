// Aniwa Projesi - Genel Uygulama Sabitleri
// Bu dosya tüm uygulama genelinde kullanılan sabitleri içerir

// Tema Tercihleri
export const THEME_PREFERENCES = ['light', 'dark', 'system'] as const
export const DEFAULT_THEME = 'system' as const

// Tip tanımlamaları
export type ThemePreference = typeof THEME_PREFERENCES[number]