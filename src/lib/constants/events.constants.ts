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
    CUSTOM_LIST_CREATED: 'user_custom_list_created',
    CUSTOM_LIST_UPDATED: 'user_custom_list_updated',
    CUSTOM_LIST_DELETED: 'user_custom_list_deleted',
    FAVOURITE_ANIME_ADDED: 'user_favourite_anime_added',
    FAVOURITE_ANIME_REMOVED: 'user_favourite_anime_removed',
    ANIME_ADDED_TO_LIST: 'user_anime_added_to_list',
    ANIME_REMOVED_FROM_LIST: 'user_anime_removed_from_list',
    CUSTOM_LIST_ITEM_ADDED: 'user_custom_list_item_added',
    CUSTOM_LIST_ITEM_REMOVED: 'user_custom_list_item_removed',
    COMMENT_CREATED: 'user_comment_created',
    COMMENT_UPDATED: 'user_comment_updated',
    COMMENT_DELETED: 'user_comment_deleted',
    COMMENT_LIKE_ADDED: 'user_comment_like_added',
    COMMENT_LIKE_REMOVED: 'user_comment_like_removed',
    USER_FOLLOWED: 'user_followed',
    USER_UNFOLLOWED: 'user_unfollowed',
    ANIME_TRACKING_ADDED: 'user_anime_tracking_added',
    ANIME_TRACKING_REMOVED: 'user_anime_tracking_removed',
  },
  
  // Admin Events
  ADMIN: {
    USER_UPDATED: 'admin_user_updated',
    USER_BANNED: 'admin_user_banned',
    USER_UNBANNED: 'admin_user_unbanned',
    USER_DELETED: 'admin_user_deleted',
    USERS_RETRIEVED: 'admin_users_retrieved',
    USER_RETRIEVED: 'admin_user_retrieved',
    GENRE_CREATED: 'admin_genre_created',
    GENRE_RETRIEVED: 'admin_genre_retrieved',
    GENRES_RETRIEVED: 'admin_genres_retrieved',
    GENRE_UPDATED: 'admin_genre_updated',
    GENRE_DELETED: 'admin_genre_deleted',
    TAG_CREATED: 'admin_tag_created',
    TAG_RETRIEVED: 'admin_tag_retrieved',
    TAGS_RETRIEVED: 'admin_tags_retrieved',
    TAG_UPDATED: 'admin_tag_updated',
    TAG_DELETED: 'admin_tag_deleted',
    STUDIO_CREATED: 'admin_studio_created',
    STUDIO_RETRIEVED: 'admin_studio_retrieved',
    STUDIOS_RETRIEVED: 'admin_studios_retrieved',
    STUDIO_UPDATED: 'admin_studio_updated',
    STUDIO_DELETED: 'admin_studio_deleted',
    LOG_CREATED: 'admin_log_created',
    LOG_RETRIEVED: 'admin_log_retrieved',
    LOGS_RETRIEVED: 'admin_logs_retrieved',
    LOG_DELETED: 'admin_log_deleted',
    ANIME_SERIES_CREATED: 'admin_anime_series_created',
    ANIME_SERIES_UPDATED: 'admin_anime_series_updated',
    ANIME_SERIES_DELETED: 'admin_anime_series_deleted',
    STREAMING_PLATFORM_CREATED: 'admin_streaming_platform_created',
    STREAMING_PLATFORM_UPDATED: 'admin_streaming_platform_updated',
    STREAMING_PLATFORM_DELETED: 'admin_streaming_platform_deleted',
  },

  // Editor Events
  EDITOR: {
    STREAMING_LINKS_UPDATED: 'editor_streaming_links_updated',
  },
  
  // System Events
  SYSTEM: {
    EMAIL_SEND_FAILED: 'email_send_failed',
    API_ERROR: 'api_error',
  },
} as const; 