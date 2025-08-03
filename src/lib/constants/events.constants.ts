// Log event sabitleri - Katmanlara göre organize edilmiş

export const EVENTS = {
  // Auth Events
  AUTH: {
    USER_REGISTERED: 'user_registered',
    USER_LOGIN: 'user_login',
    USER_LOGOUT: 'user_logout',
    LOGIN_FAILED: 'login_failed',
    PASSWORD_RESET_REQUESTED: 'password_reset_requested',
    PASSWORD_RESET_COMPLETED: 'password_reset_completed',
  },
  
  // User Events
  USER: {
    CUSTOM_LIST_CREATED: 'user_custom_list_created',
    CUSTOM_LIST_UPDATED: 'user_custom_list_updated',
    CUSTOM_LIST_DELETED: 'user_custom_list_deleted',
    CUSTOM_LISTS_RETRIEVED: 'user_custom_lists_retrieved',
    FOLLOW_TOGGLED: 'user_follow_toggled',
    FOLLOWERS_RETRIEVED: 'user_followers_retrieved',
    FOLLOWING_RETRIEVED: 'user_following_retrieved',
    FOLLOW_STATUS_CHECKED: 'user_follow_status_checked',
    ANIME_ADDED_TO_LIST: 'user_anime_added_to_list',
    ANIME_REMOVED_FROM_LIST: 'user_anime_removed_from_list',
    ANIME_LIST_RETRIEVED: 'user_anime_list_retrieved',
    ANIME_LIST_STATUS_CHECKED: 'user_anime_list_status_checked',
    ANIME_TRACKING_TOGGLED: 'user_anime_tracking_toggled',
    ANIME_TRACKING_RETRIEVED: 'user_anime_tracking_retrieved',
    ANIME_TRACKING_STATUS_CHECKED: 'user_anime_tracking_status_checked',
    FAVOURITE_ANIME_TOGGLED: 'user_favourite_anime_toggled',
    FAVOURITE_ANIMES_RETRIEVED: 'user_favourite_animes_retrieved',
    COMMENT_CREATED: 'user_comment_created',
    COMMENTS_RETRIEVED: 'user_comments_retrieved',
    COMMENT_UPDATED: 'user_comment_updated',
    COMMENT_DELETED: 'user_comment_deleted',
    COMMENT_LIKE_TOGGLED: 'user_comment_like_toggled',
  },
  
  // Admin Events
  ADMIN: {
    // User Management
    USER_UPDATED: 'admin_user_updated',
    USER_BANNED: 'admin_user_banned',
    USER_UNBANNED: 'admin_user_unbanned',
    USER_DELETED: 'admin_user_deleted',
    USERS_RETRIEVED: 'admin_users_retrieved',
    USER_RETRIEVED: 'admin_user_retrieved',
    
    // Genre Management
    GENRE_CREATED: 'admin_genre_created',
    GENRE_RETRIEVED: 'admin_genre_retrieved',
    GENRES_RETRIEVED: 'admin_genres_retrieved',
    GENRE_UPDATED: 'admin_genre_updated',
    GENRE_DELETED: 'admin_genre_deleted',
    
    // Tag Management
    TAG_CREATED: 'admin_tag_created',
    TAG_RETRIEVED: 'admin_tag_retrieved',
    TAGS_RETRIEVED: 'admin_tags_retrieved',
    TAG_UPDATED: 'admin_tag_updated',
    TAG_DELETED: 'admin_tag_deleted',
    
    // Studio Management
    STUDIO_CREATED: 'admin_studio_created',
    STUDIO_RETRIEVED: 'admin_studio_retrieved',
    STUDIOS_RETRIEVED: 'admin_studios_retrieved',
    STUDIO_UPDATED: 'admin_studio_updated',
    STUDIO_DELETED: 'admin_studio_deleted',
    
    // Log Management
    LOG_CREATED: 'admin_log_created',
    LOG_RETRIEVED: 'admin_log_retrieved',
    LOGS_RETRIEVED: 'admin_logs_retrieved',
    LOG_DELETED: 'admin_log_deleted',
    
    // Streaming Platform Management
    STREAMING_PLATFORM_CREATED: 'admin_streaming_platform_created',
    STREAMING_PLATFORM_RETRIEVED: 'admin_streaming_platform_retrieved',
    STREAMING_PLATFORMS_RETRIEVED: 'admin_streaming_platforms_retrieved',
    STREAMING_PLATFORM_UPDATED: 'admin_streaming_platform_updated',
    STREAMING_PLATFORM_DELETED: 'admin_streaming_platform_deleted',
    
    // Anime Management
    ANIME_SERIES_CREATED: 'admin_anime_series_created',
    ANIME_SERIES_RETRIEVED: 'admin_anime_series_retrieved',
    ANIME_SERIES_UPDATED: 'admin_anime_series_updated',
    ANIME_SERIES_DELETED: 'admin_anime_series_deleted',
  },

  // Editor Events
  EDITOR: {
    STREAMING_LINKS_UPDATED: 'editor_streaming_links_updated',
    
    // Anime Series Management
    ANIME_SERIES_CREATED: 'editor_anime_series_created',
    ANIME_SERIES_RETRIEVED: 'editor_anime_series_retrieved',
    ANIME_SERIES_LIST_RETRIEVED: 'editor_anime_series_list_retrieved',
    ANIME_SERIES_UPDATED: 'editor_anime_series_updated',
    ANIME_SERIES_DELETED: 'editor_anime_series_deleted',
    ANIME_SERIES_RELATIONS_RETRIEVED: 'editor_anime_series_relations_retrieved',
    ANIME_SERIES_WITH_RELATIONS_RETRIEVED: 'editor_anime_series_with_relations_retrieved',
    
    // Anime Media Part Management
    ANIME_MEDIA_PART_CREATED: 'editor_anime_media_part_created',
    ANIME_MEDIA_PART_RETRIEVED: 'editor_anime_media_part_retrieved',
    ANIME_MEDIA_PART_UPDATED: 'editor_anime_media_part_updated',
    ANIME_MEDIA_PART_DELETED: 'editor_anime_media_part_deleted',
    
    // Episode Management
    EPISODE_CREATED: 'editor_episode_created',
    EPISODE_RETRIEVED: 'editor_episode_retrieved',
    EPISODE_LIST_RETRIEVED: 'editor_episode_list_retrieved',
    EPISODE_UPDATED: 'editor_episode_updated',
    EPISODE_DELETED: 'editor_episode_deleted',
    EPISODE_CREATE_FAILED: 'editor_episode_create_failed',
    EPISODE_RETRIEVE_FAILED: 'editor_episode_retrieve_failed',
    EPISODE_LIST_RETRIEVE_FAILED: 'editor_episode_list_retrieve_failed',
    EPISODE_UPDATE_FAILED: 'editor_episode_update_failed',
    EPISODE_DELETE_FAILED: 'editor_episode_delete_failed',
  },
  
  // System Events - Katmanlara göre organize
  SYSTEM: {
    // External Services
    EMAIL_SEND_FAILED: 'system_email_send_failed',
    
    // Database Layer
    DATABASE_ERROR: 'system_database_error',
    
    // Business Layer
    BUSINESS_ERROR: 'system_business_error',
    
    // Action Layer
    ACTION_ERROR: 'system_action_error',
    
    // API Layer
    API_ERROR: 'system_api_error',
    
    // General System
    UNEXPECTED_ERROR: 'system_unexpected_error',
  },
} as const; 