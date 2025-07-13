// =============================================================================
// PRISMA ENUM'LARINI RE-EXPORT ET
// =============================================================================

export {
  UserRole as USER_ROLES,
  LogLevel as LOG_LEVELS,
  Theme as THEME,
  TitleLanguage as TITLE_LANGUAGE,
  ProfileVisibility as PROFILE_VISIBILITY,
  ScoreFormat as SCORE_FORMAT,
  NotificationType as NOTIFICATION_TYPE,
  AnimeType as ANIME_TYPE,
  AnimeStatus as ANIME_STATUS,
  Season as SEASON,
  Source as SOURCE,
  MediaListStatus as MEDIA_LIST_STATUS,
  TagCategory as TAG_CATEGORY
} from "@prisma/client"

// =============================================================================
// APP SABITLERI
// =============================================================================

export const APP = {
  NAME: 'Aniwa',
  DESCRIPTION: 'Anime takip ve topluluk platformu',
  VERSION: '1.0.0',
  AUTHOR: 'Aniwa Team',
  URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  CONTACT_EMAIL: 'iletisim@aniwa.com',
  SUPPORT_EMAIL: 'destek@aniwa.com'
} as const

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
    AUTH: {
      SIGN_IN: '/giris',
      SIGN_UP: '/kayit',
      ERROR: '/hata',
      VERIFY_REQUEST: '/dogrulama',
      FORGOT_PASSWORD: '/sifremi-unuttum',
      RESET_PASSWORD: '/sifre-sifirlama',
    },
    ADMIN: {
      BASE: '/yonetim',
      LOGS: '/yonetim/loglar',
    },
    MODERATOR: {
      BASE: '/moderasyon',
    },
    EDITOR: {
      BASE: '/editor',
    },
    PROFILE: {
      BASE: '/profil',
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
      VERIFY_EMAIL: '/api/auth/verify-email',
      CHECK_USERNAME: '/api/auth/check-username',
    },
  },
} as const

// Route erişim kuralları
export const ROUTE_ACCESS = {
  PUBLIC_ROUTES: [
    ROUTES.PAGES.HOME,
    ROUTES.PAGES.MAIN.ANIME,
    ROUTES.PAGES.AUTH.ERROR,
  ],
  
  PROTECTED_AUTH_ROUTES: [
    ROUTES.PAGES.AUTH.SIGN_IN,
    ROUTES.PAGES.AUTH.SIGN_UP,
    ROUTES.PAGES.AUTH.VERIFY_REQUEST,
    ROUTES.PAGES.AUTH.FORGOT_PASSWORD,
    ROUTES.PAGES.AUTH.RESET_PASSWORD,
  ],
  
  PROTECTED_API_ROUTES: [
    ROUTES.API.AUTH.SIGNUP,
    ROUTES.API.AUTH.RESET_PASSWORD,
    ROUTES.API.AUTH.FORGOT_PASSWORD,
  ],
} as const 