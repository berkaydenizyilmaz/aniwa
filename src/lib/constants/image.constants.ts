// Modern görsel yönetimi sabitleri

export const IMAGE_TYPES = {
  USER_AVATAR: 'user-avatar',
  USER_BANNER: 'user-banner',
  ANIME_COVER: 'anime-cover',
  ANIME_BANNER: 'anime-banner',
  EPISODE_THUMBNAIL: 'episode-thumbnail',
} as const;

export type ImageType = typeof IMAGE_TYPES[keyof typeof IMAGE_TYPES];

// Cloudinary konfigürasyonları
export const IMAGE_CONFIG = {
  [IMAGE_TYPES.USER_AVATAR]: {
    folder: 'users/avatars',
    maxSize: 2 * 1024 * 1024, // 2MB
    dimensions: { width: 200, height: 200 },
    quality: 90,
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'] as const,
    transformations: {
      main: { width: 200, height: 200, crop: 'fill' },
      thumbnail: { width: 50, height: 50, crop: 'fill' }
    }
  },
  [IMAGE_TYPES.USER_BANNER]: {
    folder: 'users/banners',
    maxSize: 5 * 1024 * 1024, // 5MB
    dimensions: { width: 1200, height: 300 },
    quality: 85,
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'] as const,
    transformations: {
      main: { width: 1200, height: 300, crop: 'fill' },
      mobile: { width: 800, height: 200, crop: 'fill' }
    }
  },
  [IMAGE_TYPES.ANIME_COVER]: {
    folder: 'anime/covers',
    maxSize: 5 * 1024 * 1024, // 5MB
    dimensions: { width: 400, height: 600 },
    quality: 85,
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'] as const,
    transformations: {
      main: { width: 400, height: 600, crop: 'fill' },
      thumbnail: { width: 150, height: 225, crop: 'fill' },
      large: { width: 600, height: 900, crop: 'fill' }
    }
  },
  [IMAGE_TYPES.ANIME_BANNER]: {
    folder: 'anime/banners',
    maxSize: 10 * 1024 * 1024, // 10MB
    dimensions: { width: 1400, height: 400 },
    quality: 85,
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'] as const,
    transformations: {
      main: { width: 1400, height: 400, crop: 'fill' },
      mobile: { width: 800, height: 250, crop: 'fill' }
    }
  },
  [IMAGE_TYPES.EPISODE_THUMBNAIL]: {
    folder: 'episodes/thumbnails',
    maxSize: 3 * 1024 * 1024, // 3MB
    dimensions: { width: 480, height: 270 },
    quality: 80,
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'] as const,
    transformations: {
      main: { width: 480, height: 270, crop: 'fill' },
      small: { width: 240, height: 135, crop: 'fill' }
    }
  }
} as const;

// Cloudinary klasör prefixi
export const CLOUDINARY_PREFIX = 'aniwa' as const;

// Upload durumları
export const UPLOAD_STATUS = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  SUCCESS: 'success',
  ERROR: 'error'
} as const;

export type UploadStatus = typeof UPLOAD_STATUS[keyof typeof UPLOAD_STATUS];

// Entity prefiksleri
export const ENTITY_PREFIXES = {
  [IMAGE_TYPES.USER_AVATAR]: 'user',
  [IMAGE_TYPES.USER_BANNER]: 'user',
  [IMAGE_TYPES.ANIME_COVER]: 'anime',
  [IMAGE_TYPES.ANIME_BANNER]: 'anime',
  [IMAGE_TYPES.EPISODE_THUMBNAIL]: 'episode',
} as const;
