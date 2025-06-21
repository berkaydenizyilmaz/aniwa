// Aniwa Projesi - Routes Constants
// Bu dosya tüm site URL'lerini merkezi olarak yönetir

// API rotaları (İngilizce endpoint'ler)
export const API_ROUTES = {
  AUTH: {
    BASE: '/api/auth',
    SETUP_USERNAME: '/api/auth/setup-username',
    SIGNUP: '/api/auth/signup',
  },
} as const

// Auth sayfaları (Türkçe URL'ler)
export const AUTH_ROUTES = {
  SIGN_IN: '/giris',
  SIGN_UP: '/kayit',
  ERROR: '/hata',
  VERIFY_REQUEST: '/dogrulama',
  SETUP_USERNAME: '/kullanici-adi-secimi',
} as const

// Public sayfalar (Türkçe URL'ler)
export const PUBLIC_ROUTES = {
  HOME: '/',
  ABOUT: '/hakkimizda',
  CONTACT: '/iletisim',
  HELP: '/yardim',
  ANIME: '/anime',
} as const

// Protected sayfalar (rol bazlı - Türkçe URL'ler)
export const PROTECTED_ROUTES = {
  ADMIN: {
    BASE: '/yonetim',
  },
  MODERATOR: {
    BASE: '/moderasyon',
  },
  EDITOR: {
    BASE: '/editör',
  },
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