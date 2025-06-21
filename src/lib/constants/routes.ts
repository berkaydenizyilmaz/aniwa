// Aniwa Projesi - Routes Constants
// Bu dosya tüm site URL'lerini merkezi olarak yönetir

// API rotaları
// API endpoints
export const API_ROUTES = {
    AUTH: {
      BASE: '/api/auth',
      SETUP_USERNAME: '/api/auth/setup-username',
      SIGNUP: '/api/auth/signup',
    },
  } as const

// Auth sayfaları
export const AUTH_ROUTES = {
  SIGN_IN: '/auth/signin',
  SIGN_UP: '/auth/signup',
  ERROR: '/auth/error',
  VERIFY_REQUEST: '/auth/verify-request',
  SETUP_USERNAME: '/auth/setup-username',
} as const

// Public sayfalar
export const PUBLIC_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  HELP: '/help',
  ANIME: '/anime',
} as const

// Protected sayfalar (rol bazlı)
export const PROTECTED_ROUTES = {
  ADMIN: {
    BASE: '/admin',
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    LOGS: '/admin/logs',
  },
  MODERATOR: {
    BASE: '/moderation',
    DASHBOARD: '/moderation/dashboard',
    REPORTS: '/moderation/reports',
  },
  EDITOR: {
    BASE: '/editor',
    DASHBOARD: '/editor/dashboard',
    CONTENT: '/editor/content',
  },
} as const

// Genel uygulama sayfaları
export const APP_ROUTES = {
  PROFILE: '/profile',
  SETTINGS: '/settings',
  DASHBOARD: '/dashboard',
} as const

// Public route listesi (middleware için)
export const PUBLIC_ROUTE_LIST = [
  AUTH_ROUTES.SIGN_IN,
  AUTH_ROUTES.SIGN_UP,
  AUTH_ROUTES.ERROR,
  PUBLIC_ROUTES.ABOUT,
  PUBLIC_ROUTES.CONTACT,
  PUBLIC_ROUTES.ANIME,
] as const

// Protected route patterns (middleware için)
export const PROTECTED_ROUTE_PATTERNS = {
  ADMIN: PROTECTED_ROUTES.ADMIN.BASE,
  MODERATOR: PROTECTED_ROUTES.MODERATOR.BASE,
  EDITOR: PROTECTED_ROUTES.EDITOR.BASE,
  API_AUTH: API_ROUTES.AUTH.BASE,
} as const

// Tip tanımlamaları
export type AuthRoute = typeof AUTH_ROUTES[keyof typeof AUTH_ROUTES]
export type ApiRoute = typeof API_ROUTES[keyof typeof API_ROUTES]
export type PublicRoute = typeof PUBLIC_ROUTES[keyof typeof PUBLIC_ROUTES]
export type ProtectedRoute = typeof PROTECTED_ROUTES[keyof typeof PROTECTED_ROUTES]
export type AppRoute = typeof APP_ROUTES[keyof typeof APP_ROUTES] 