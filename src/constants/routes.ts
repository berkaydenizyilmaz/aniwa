// Routes Constants
// Bu dosya tüm site URL'lerini merkezi, kategorik ve ölçeklenebilir bir şekilde yönetir.

// Uygulamadaki tüm rotaları içeren ana nesne.
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
      BASE: '/profil',    },
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


// Kimlik doğrulaması gerektirmeyen sayfalar.
export const publicRoutes: string[] = [
  ROUTES.PAGES.HOME,
  ROUTES.PAGES.MAIN.ANIME,
  ROUTES.PAGES.AUTH.ERROR,
]

// Giriş yapmış kullanıcıların erişemeyeceği sayfalar.
export const protectedAuthRoutes: string[] = [
  ROUTES.PAGES.AUTH.SIGN_IN,
  ROUTES.PAGES.AUTH.SIGN_UP,
  ROUTES.PAGES.AUTH.VERIFY_REQUEST,
  ROUTES.PAGES.AUTH.FORGOT_PASSWORD,
  ROUTES.PAGES.AUTH.RESET_PASSWORD,
]

// Giriş yapmış kullanıcıların erişemeyeceği API rotaları.
export const protectedApiRoutes: string[] = [
  ROUTES.API.AUTH.SIGNUP,
  ROUTES.API.AUTH.RESET_PASSWORD,
  ROUTES.API.AUTH.FORGOT_PASSWORD,
]