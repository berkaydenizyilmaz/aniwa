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
    },
  },
  
  API: {
    // Auth API'leri
    AUTH: {
      REGISTER: '/api/auth/register',
      SESSION: '/api/auth/session',
      NEXT_AUTH: '/api/auth/signin',
      SIGNOUT: '/api/auth/signout',
    },
  },
} as const;