// Route sabitleri - Sayfa ve API endpoint'leri

export const ROUTES = {
  PAGES: {
    HOME: '/',
    
    // Ana sayfalar
    ANIME: '/anime',
    LISTS: '/listeler',
    PROFILE: '/profil',
    NOTIFICATIONS: '/bildirimler',
    SETTINGS: '/ayarlar',
    
    // Auth sayfaları
    AUTH: {
      LOGIN: '/giris',
      REGISTER: '/kayit',
      FORGOT_PASSWORD: '/sifremi-unuttum',
      RESET_PASSWORD: '/sifremi-sifirla',
    },
    
    // Admin sayfaları
    ADMIN: {
      DASHBOARD: '/yonetim',
      GENRES: '/yonetim/turler',
      TAGS: '/yonetim/etiketler',
      STUDIOS: '/yonetim/studyolar',
    },
    
    // Moderator sayfaları
    MODERATOR: {
      DASHBOARD: '/moderator',
    },
    
    // Editor sayfaları
    EDITOR: {
      DASHBOARD: '/editor',
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
    
    // User API'leri
    USER: {
      FAVOURITES: '/api/user/favourites',
      CUSTOM_LISTS: '/api/user/custom-lists',
      ANIME_LIST: '/api/user/anime-list',
      ANIME_TRACKING: '/api/user/anime-tracking',
      COMMENTS: '/api/user/comments',
      FOLLOWS: '/api/user/follows',
    },
    
    // Admin API'leri
    ADMIN: {
      GENRES: '/api/admin/genres',
      TAGS: '/api/admin/tags',
      STUDIOS: '/api/admin/studios',
      ANIME: '/api/admin/anime',
      STREAMING_PLATFORMS: '/api/admin/streaming-platforms',
      USERS: '/api/admin/users',
      STREAMING_LINKS: '/api/admin/streaming-links',
    },

    // Editor API'leri
    EDITOR: {
      STREAMING_LINKS: '/api/editor/streaming-links',
    },
  },
  
  
  // Middleware için route grupları
  MIDDLEWARE: {
    // Giriş yapmış kullanıcıların erişemeyeceği (guest-only)
    GUEST_ONLY: {
      PAGES: [
        '/giris',
        '/kayit',
        '/sifremi-unuttum',
        '/sifremi-sifirla',
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
        '/api/user/favourites',
        '/api/user/custom-lists',
        '/api/user/anime-list',
      ],
    },
    
    // Yönetici yetkisi gerektiren (admin)
    ADMIN_ONLY: {
      PAGES: [
        '/yonetim',           // Yönetim ana sayfa
        '/yonetim/turler',    // Genre yönetimi
        '/yonetim/etiketler', // Tag yönetimi
        '/yonetim/studiolar', // Studio yönetimi
      ],
      API: [
        '/api/admin',         // Admin ana API
        '/api/admin/genres',  // Genre yönetimi
        '/api/admin/tags',    // Tag yönetimi
        '/api/admin/studios', // Studio yönetimi
        '/api/admin/anime',   // Anime yönetimi
        '/api/admin/streaming-platforms', // Streaming platform yönetimi
      ],
    },
    
    // Editör yetkisi gerektiren
    EDITOR_ONLY: {
      PAGES: [
        '/editor',            // Editör ana sayfa
      ],
      API: [
        '/api/editor',        // Editör ana API
        '/api/editor/streaming-links', // Streaming link yönetimi
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