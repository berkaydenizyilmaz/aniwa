// =============================================================================
// PRISMA ENUM'LARINI RE-EXPORT ET
// =============================================================================

export {
  UserRole as USER_ROLES,
  LogLevel as LOG_LEVELS,
  Theme as THEME,
  AnimeType as ANIME_TYPE,
  AnimeStatus as ANIME_STATUS,
  Season as SEASON,
  Source as SOURCE,
  MediaListStatus as MEDIA_LIST_STATUS,
} from "@prisma/client"

// =============================================================================
// ROUTE SABITLERI
// =============================================================================

export const ROUTES = {
  PAGES: {
    HOME: '/',
    MAIN: {
      ANIME: '/anime',
      CONTACT: '/iletisim',
    },
    USER: {
      SETTINGS: '/ayarlar',
      PROFILE: (username: string) => `/${username}`,
    },
    AUTH: {
      SIGN_IN: '/giris',
      SIGN_UP: '/kayit',
      ERROR: '/hata',
      FORGOT_PASSWORD: '/sifremi-unuttum',
      RESET_PASSWORD: '/sifre-sifirlama',
    },
    ADMIN: {
      BASE: '/yonetim',
      LOGS: '/yonetim/loglar',
      USERS: '/yonetim/kullanicilar',
    },
    MODERATOR: {
      BASE: '/moderasyon',
    },
    EDITOR: {
      BASE: '/editor',
    },
  },
  API: {
    AUTH: {
      BASE: '/api/auth',
      CALLBACK: '/api/auth/callback',
      SIGNUP: '/api/auth/signup',
      SIGN_OUT: '/api/auth/signout',
      RESET_PASSWORD: '/api/auth/reset-password',
      FORGOT_PASSWORD: '/api/auth/forgot-password',
      CHECK_USERNAME: '/api/auth/check-username',
    },
    ADMIN: {
      BASE: '/api/admin',
      LOGS: '/api/admin/logs',
      USERS: '/api/admin/users',
    },
    MODERATOR: {
      BASE: '/api/moderator',
    },
    EDITOR: {
      BASE: '/api/editor',
    },
    USER: {
      BASE: '/api/user',
      PROFILE: '/api/user/profile',
      SETTINGS: '/api/user/settings',
      CHANGE_USERNAME: '/api/user/change-username',
      CHANGE_PASSWORD: '/api/user/change-password',
    },
    PROFILE: {
      BASE: '/api/profile',
    },
  },
} as const

// Route erişim kuralları
export const ROUTE_ACCESS = {
  // Herkes erişebileceği sayfalar
  PUBLIC_ROUTES: [
    ROUTES.PAGES.HOME,
    ROUTES.PAGES.MAIN.ANIME,
    ROUTES.PAGES.AUTH.ERROR,
  ],
  
  // Giriş yapmışların ERİŞEMEYECEĞİ auth sayfaları
  GUEST_ONLY_ROUTES: [
    ROUTES.PAGES.AUTH.SIGN_IN,
    ROUTES.PAGES.AUTH.SIGN_UP,
    ROUTES.PAGES.AUTH.FORGOT_PASSWORD,
    ROUTES.PAGES.AUTH.RESET_PASSWORD,
  ],
  
  // Giriş yapmışların ERİŞEMEYECEĞİ auth API'leri
  GUEST_ONLY_API_ROUTES: [
    ROUTES.API.AUTH.SIGNUP,
    ROUTES.API.AUTH.RESET_PASSWORD,
    ROUTES.API.AUTH.FORGOT_PASSWORD,
  ],

  // Giriş GEREKTİREN API'ler
  AUTH_REQUIRED_API_ROUTES: [
    '/api/user',
  ],

  // Giriş GEREKTİREN sayfalar
  AUTH_REQUIRED_ROUTES: [
    '/ayarlar',
  ],
} as const 