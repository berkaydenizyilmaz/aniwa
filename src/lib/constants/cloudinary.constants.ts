// Cloudinary sabitleri

export const CLOUDINARY = {
  FOLDERS: {
    ANIME: {
      COVERS: 'aniwa/anime/covers',
      BANNERS: 'aniwa/anime/banners'
    },
    USERS: {
      AVATARS: 'aniwa/users/avatars',
      BANNERS: 'aniwa/users/banners'
    }
  }
} as const;

export const UPLOAD_CONFIGS = {
  ANIME_COVER: {
    folder: CLOUDINARY.FOLDERS.ANIME.COVERS,
    maxSize: 5 * 1024 * 1024, // 5MB
    accept: 'image/*',
    quality: 80,
    width: 400,
    height: 600
  },
  ANIME_BANNER: {
    folder: CLOUDINARY.FOLDERS.ANIME.BANNERS,
    maxSize: 10 * 1024 * 1024, // 10MB
    accept: 'image/*',
    quality: 85,
    width: 1200,
    height: 400
  },
  USER_AVATAR: {
    folder: CLOUDINARY.FOLDERS.USERS.AVATARS,
    maxSize: 2 * 1024 * 1024, // 2MB
    accept: 'image/*',
    quality: 90,
    width: 200,
    height: 200
  },
  USER_BANNER: {
    folder: CLOUDINARY.FOLDERS.USERS.BANNERS,
    maxSize: 5 * 1024 * 1024, // 5MB
    accept: 'image/*',
    quality: 85,
    width: 800,
    height: 200
  }
} as const; 