export const LOADING_KEYS = {
  // Sayfa loading'leri
  PAGES: {
    TAGS: 'tags-page',
    GENRES: 'genres-page',
    STUDIOS: 'studios-page',
    USERS: 'users-page',
  },
  
  // Form loading'leri
  FORMS: {
    CREATE_TAG: 'create-tag-form',
    UPDATE_TAG: 'update-tag-form',
    CREATE_GENRE: 'create-genre-form',
    UPDATE_GENRE: 'update-genre-form',
    CREATE_STUDIO: 'create-studio-form',
    UPDATE_STUDIO: 'update-studio-form',
  },
  
  // Auth loading'leri
  AUTH: {
    LOGIN: 'auth-login',
    REGISTER: 'auth-register',
    FORGOT_PASSWORD: 'auth-forgot-password',
    RESET_PASSWORD: 'auth-reset-password',
    SIGNOUT: 'auth-signout',
  },
  
  // İşlem loading'leri
  ACTIONS: {
    DELETE_TAG: 'delete-tag',
    DELETE_GENRE: 'delete-genre',
    DELETE_STUDIO: 'delete-studio',
    SEARCH_TAGS: 'search-tags',
    SEARCH_GENRES: 'search-genres',
    SEARCH_STUDIOS: 'search-studios',
  },
} as const;

// Tip güvenliği için
export type LoadingKey = 
  | typeof LOADING_KEYS.PAGES[keyof typeof LOADING_KEYS.PAGES]
  | typeof LOADING_KEYS.FORMS[keyof typeof LOADING_KEYS.FORMS]
  | typeof LOADING_KEYS.AUTH[keyof typeof LOADING_KEYS.AUTH]
  | typeof LOADING_KEYS.ACTIONS[keyof typeof LOADING_KEYS.ACTIONS]; 