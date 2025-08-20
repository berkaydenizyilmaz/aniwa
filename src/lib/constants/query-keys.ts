// Query key factory - Normalized query keys for React Query

// Base arrays to avoid circular references
const USER_BASE = ['user'] as const;
const ANIME_BASE = ['anime'] as const;
const MASTER_DATA_BASE = ['master-data'] as const;
const ADMIN_BASE = ['admin'] as const;
const USER_ANIME_LIST_BASE = ['user-anime-list'] as const;
const COMMENT_BASE = ['comment'] as const;

export const queryKeys = {
  // User related queries
  user: {
    all: USER_BASE,
    byId: (id: string) => [...USER_BASE, id] as const,
    settings: (id: string) => [...USER_BASE, id, 'settings'] as const,
    profile: (id: string) => [...USER_BASE, id, 'profile'] as const,
    list: (filters?: any) => [...USER_BASE, 'list', filters] as const,
  },

  // Anime related queries
  anime: {
    all: ANIME_BASE,
    byId: (id: string) => [...ANIME_BASE, id] as const,
    series: {
      all: [...ANIME_BASE, 'series'] as const,
      byId: (id: string) => [...ANIME_BASE, 'series', id] as const,
      list: (filters?: any) => [...ANIME_BASE, 'series', 'list', filters] as const,
      withRelations: (id: string) => [...ANIME_BASE, 'series', id, 'relations'] as const,
    },
    mediaPart: {
      all: [...ANIME_BASE, 'media-part'] as const,
      byId: (id: string) => [...ANIME_BASE, 'media-part', id] as const,
      bySeriesId: (seriesId: string) => [...ANIME_BASE, 'series', seriesId, 'media-parts'] as const,
    },
    episode: {
      all: [...ANIME_BASE, 'episode'] as const,
      byId: (id: string) => [...ANIME_BASE, 'episode', id] as const,
      byMediaPartId: (mediaPartId: string) => [...ANIME_BASE, 'media-part', mediaPartId, 'episodes'] as const,
    },
    streamingLink: {
      all: [...ANIME_BASE, 'streaming-link'] as const,
      byId: (id: string) => [...ANIME_BASE, 'streaming-link', id] as const,
      byEpisodeId: (episodeId: string) => [...ANIME_BASE, 'episode', episodeId, 'streaming-links'] as const,
    },
  },

  // Master data queries
  masterData: {
    all: MASTER_DATA_BASE,
    genre: {
      all: [...MASTER_DATA_BASE, 'genre'] as const,
      byId: (id: string) => [...MASTER_DATA_BASE, 'genre', id] as const,
      list: (filters?: any) => [...MASTER_DATA_BASE, 'genre', 'list', filters] as const,
    },
    tag: {
      all: [...MASTER_DATA_BASE, 'tag'] as const,
      byId: (id: string) => [...MASTER_DATA_BASE, 'tag', id] as const,
      list: (filters?: any) => [...MASTER_DATA_BASE, 'tag', 'list', filters] as const,
    },
    studio: {
      all: [...MASTER_DATA_BASE, 'studio'] as const,
      byId: (id: string) => [...MASTER_DATA_BASE, 'studio', id] as const,
      list: (filters?: any) => [...MASTER_DATA_BASE, 'studio', 'list', filters] as const,
    },
    streamingPlatform: {
      all: [...MASTER_DATA_BASE, 'streaming-platform'] as const,
      byId: (id: string) => [...MASTER_DATA_BASE, 'streaming-platform', id] as const,
      list: (filters?: any) => [...MASTER_DATA_BASE, 'streaming-platform', 'list', filters] as const,
    },
  },

  // Admin queries
  admin: {
    all: ADMIN_BASE,
    user: {
      all: [...ADMIN_BASE, 'user'] as const,
      byId: (id: string) => [...ADMIN_BASE, 'user', id] as const,
      list: (filters?: any) => [...ADMIN_BASE, 'user', 'list', filters] as const,
    },
    log: {
      all: [...ADMIN_BASE, 'log'] as const,
      list: (filters?: any) => [...ADMIN_BASE, 'log', 'list', filters] as const,
    },
  },

  // User anime list queries
  userAnimeList: {
    all: USER_ANIME_LIST_BASE,
    byUserId: (userId: string) => [...USER_ANIME_LIST_BASE, userId] as const,
    byStatus: (userId: string, status: string) => [...USER_ANIME_LIST_BASE, userId, status] as const,
  },

  // Comments queries
  comment: {
    all: COMMENT_BASE,
    byId: (id: string) => [...COMMENT_BASE, id] as const,
    byAnimeId: (animeId: string) => [...ANIME_BASE, 'series', animeId, 'comments'] as const,
  },
} as const;
