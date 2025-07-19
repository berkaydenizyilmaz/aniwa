// Log event sabitleri

export const EVENTS = {
  // Auth Events
  AUTH: {
    USER_REGISTERED: 'user_registered',
  },
  
  // System Events
  SYSTEM: {
    EMAIL_SEND_FAILED: 'email_send_failed',
    API_ERROR: 'api_error',
  },
  
  // Master Data Events
  MASTER_DATA: {
    GENRE_CREATED: 'genre_created',
    GENRE_UPDATED: 'genre_updated',
    GENRE_DELETED: 'genre_deleted',
    TAG_CREATED: 'tag_created',
    TAG_UPDATED: 'tag_updated',
    TAG_DELETED: 'tag_deleted',
    STUDIO_CREATED: 'studio_created',
    STUDIO_UPDATED: 'studio_updated',
    STUDIO_DELETED: 'studio_deleted',
  },
} as const; 