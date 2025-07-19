// Route sabitleri - Sayfa ve API endpoint'leri

export const ROUTES = {
  PAGES: {
    HOME: '/',
    
    // Auth sayfaları
    AUTH: {
      LOGIN: '/auth/giris',
      REGISTER: '/auth/kayit',
      FORGOT_PASSWORD: '/auth/sifremi-unuttum',
      RESET_PASSWORD: '/auth/sifremi-sifirla',
      EMAIL_VERIFY: '/auth/email-dogrula',
    },
  },
  
  API: {
    // Auth API'leri
    AUTH: {
      REGISTER: '/api/auth/register',
      FORGOT_PASSWORD: '/api/auth/forgot-password',
      RESET_PASSWORD: '/api/auth/reset-password',
      SESSION: '/api/auth/session',
      NEXT_AUTH: '/api/auth/signin',
      SIGNOUT: '/api/auth/signout',
    },
  },
} as const;