// Log event sabitleri

export const EVENTS = {
  // Auth Events
  AUTH: {
    USER_REGISTERED: 'user_registered',
  },
  
  // User Events
  USER: {
    PROFILE_UPDATED: 'user_profile_updated',
    SETTINGS_UPDATED: 'user_settings_updated',
  },
  
  // Admin Events
  ADMIN: {
    USER_UPDATED: 'admin_user_updated',
    USER_BANNED: 'admin_user_banned',
    USER_UNBANNED: 'admin_user_unbanned',
    USER_DELETED: 'admin_user_deleted',
    GENRE_CREATED: 'admin_genre_created',
    GENRE_UPDATED: 'admin_genre_updated',
    GENRE_DELETED: 'admin_genre_deleted',
    TAG_CREATED: 'admin_tag_created',
    TAG_UPDATED: 'admin_tag_updated',
    TAG_DELETED: 'admin_tag_deleted',
    STUDIO_CREATED: 'admin_studio_created',
    STUDIO_UPDATED: 'admin_studio_updated',
    STUDIO_DELETED: 'admin_studio_deleted',
  },
  
  // System Events
  SYSTEM: {
    EMAIL_SEND_FAILED: 'email_send_failed',
    API_ERROR: 'api_error',
  },
} as const; 