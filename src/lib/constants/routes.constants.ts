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
    
    // Admin API'leri
    ADMIN: {
      GENRES: '/api/admin/genres',
      TAGS: '/api/admin/tags',
      STUDIOS: '/api/admin/studios',
    },
  },
  
  // Middleware için route grupları
  MIDDLEWARE: {
    // Giriş yapmış kullanıcıların erişemeyeceği (guest-only)
    GUEST_ONLY: {
      PAGES: [
        '/auth/giris',
        '/auth/kayit',
        '/auth/sifremi-unuttum',
        '/auth/sifremi-sifirla',
      ],
      API: [
        '/api/auth/register',
        '/api/auth/forgot-password',
        '/api/auth/reset-password',
      ],
    },
    
    // Giriş yapmamış kullanıcıların erişemeyeceği (auth-required)
    AUTH_REQUIRED: {
      PAGES: [
        // Şimdilik boş, ilerde eklenecek
      ],
      API: [
        // Şimdilik boş, ilerde eklenecek
      ],
    },
    
    // Yönetici yetkisi gerektiren (admin)
    ADMIN_ONLY: {
      PAGES: [
        '/yonetim',           // Yönetim ana sayfa
      ],
      API: [
        '/api/admin',         // Admin ana API
        '/api/admin/genres',  // Genre yönetimi
        '/api/admin/tags',    // Tag yönetimi
        '/api/admin/studios', // Studio yönetimi
      ],
    },
    
    // Editör yetkisi gerektiren
    EDITOR_ONLY: {
      PAGES: [
        '/editor',            // Editör ana sayfa
      ],
      API: [
        '/api/editor',        // Editör ana API
      ],
    },
    
    // Moderatör yetkisi gerektiren
    MODERATOR_ONLY: {
      PAGES: [
        '/moderator',         // Moderatör ana sayfa
      ],
      API: [
        '/api/moderator',     // Moderatör ana API
      ],
    },
  },
} as const;