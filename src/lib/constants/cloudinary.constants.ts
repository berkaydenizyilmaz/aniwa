// Cloudinary sabitleri

export const CLOUDINARY = {
  FOLDERS: {
    ANIME: {
      COVERS: 'aniwa/anime/covers',
      BANNERS: 'aniwa/anime/banners'
    },
    EPISODES: {
      THUMBNAILS: 'aniwa/episodes/thumbnails'
    },
    USERS: {
      AVATARS: 'aniwa/users/avatars',
      BANNERS: 'aniwa/users/banners'
    }
  },
  CONFIGS: {
    ANIME_COVER: {
      folder: 'aniwa/anime/covers',
      maxSize: 5 * 1024 * 1024, // 5MB
      width: 400, 
      height: 600,
      quality: 80
    },
    ANIME_BANNER: {
      folder: 'aniwa/anime/banners', 
      maxSize: 10 * 1024 * 1024, // 10MB
      width: 1200, 
      height: 400,
      quality: 85
    },
    EPISODE_THUMBNAIL: {
      folder: 'aniwa/episodes/thumbnails',
      maxSize: 5 * 1024 * 1024, // 5MB
      width: 400, 
      height: 225,
      quality: 80
    },
    USER_AVATAR: {
      folder: 'aniwa/users/avatars',
      maxSize: 2 * 1024 * 1024, // 2MB
      width: 200, 
      height: 200,
      quality: 90
    },
    USER_BANNER: {
      folder: 'aniwa/users/banners',
      maxSize: 5 * 1024 * 1024, // 5MB
      width: 800, 
      height: 200,
      quality: 85
    }
  }
} as const; 