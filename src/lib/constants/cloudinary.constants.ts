// Cloudinary related constants

import { ImageDimensions, ImagePresetConfig, CloudinaryTransformation } from '@/lib/types/cloudinary';

// Cloudinary folder structure
export const CLOUDINARY_FOLDERS = {
  USERS: {
    PROFILES: 'aniwa/users/profiles',
    BANNERS: 'aniwa/users/banners',
  },
  ANIME: {
    SERIES: {
      COVERS: 'aniwa/anime/series/covers',
      BANNERS: 'aniwa/anime/series/banners',
    },
    EPISODES: {
      THUMBNAILS: 'aniwa/anime/episodes/thumbnails',
    },
  },
} as const;

// Image size limits (in bytes)
export const IMAGE_SIZE_LIMITS = {
  USER_PROFILE: 5 * 1024 * 1024,     // 5MB
  USER_BANNER: 10 * 1024 * 1024,     // 10MB
  ANIME_COVER: 8 * 1024 * 1024,      // 8MB
  ANIME_BANNER: 15 * 1024 * 1024,    // 15MB
  EPISODE_THUMBNAIL: 3 * 1024 * 1024, // 3MB
} as const;

// Standard image dimensions
export const IMAGE_DIMENSIONS = {
  USER_PROFILE: {
    width: 400,
    height: 400,
  },
  USER_BANNER: {
    width: 1200,
    height: 300,
  },
  ANIME_COVER: {
    width: 300,
    height: 450,
  },
  ANIME_BANNER: {
    width: 1200,
    height: 400,
  },
  EPISODE_THUMBNAIL: {
    width: 640,
    height: 360,
  },
} as const satisfies Record<string, ImageDimensions>;

// Responsive image dimensions
export const RESPONSIVE_DIMENSIONS = {
  USER_PROFILE: [
    { width: 100, height: 100 },   // Small avatar
    { width: 200, height: 200 },   // Medium avatar
    { width: 400, height: 400 },   // Large avatar
  ],
  ANIME_COVER: [
    { width: 150, height: 225 },   // Small cover
    { width: 300, height: 450 },   // Medium cover
    { width: 600, height: 900 },   // Large cover
  ],
} as const;

// Default transformations for different image types
export const DEFAULT_TRANSFORMATIONS = {
  USER_PROFILE: [
    {
      width: 400,
      height: 400,
      crop: 'fill',
      gravity: 'face',
      quality: 'auto',
      format: 'auto',
    },
  ],
  USER_BANNER: [
    {
      width: 1200,
      height: 300,
      crop: 'fill',
      gravity: 'center',
      quality: 'auto',
      format: 'auto',
    },
  ],
  ANIME_COVER: [
    {
      width: 300,
      height: 450,
      crop: 'fill',
      gravity: 'center',
      quality: 'auto',
      format: 'auto',
    },
  ],
  ANIME_BANNER: [
    {
      width: 1200,
      height: 400,
      crop: 'fill',
      gravity: 'center',
      quality: 'auto',
      format: 'auto',
    },
  ],
  EPISODE_THUMBNAIL: [
    {
      width: 640,
      height: 360,
      crop: 'fill',
      gravity: 'center',
      quality: 'auto',
      format: 'auto',
    },
  ],
} as const satisfies Record<string, CloudinaryTransformation[]>;

// Allowed file formats
export const ALLOWED_IMAGE_FORMATS = [
  'jpg',
  'jpeg',
  'png',
  'webp',
  'avif',
] as const;

// Image quality settings
export const IMAGE_QUALITY = {
  HIGH: 90,
  MEDIUM: 75,
  LOW: 60,
  AUTO: 'auto',
} as const;

// Preset configurations for different image types
export const IMAGE_PRESET_CONFIGS = {
  USER_PROFILE: {
    dimensions: IMAGE_DIMENSIONS.USER_PROFILE,
    transformations: DEFAULT_TRANSFORMATIONS.USER_PROFILE,
    allowedFormats: ALLOWED_IMAGE_FORMATS,
    maxSizeBytes: IMAGE_SIZE_LIMITS.USER_PROFILE,
  },
  USER_BANNER: {
    dimensions: IMAGE_DIMENSIONS.USER_BANNER,
    transformations: DEFAULT_TRANSFORMATIONS.USER_BANNER,
    allowedFormats: ALLOWED_IMAGE_FORMATS,
    maxSizeBytes: IMAGE_SIZE_LIMITS.USER_BANNER,
  },
  ANIME_COVER: {
    dimensions: IMAGE_DIMENSIONS.ANIME_COVER,
    transformations: DEFAULT_TRANSFORMATIONS.ANIME_COVER,
    allowedFormats: ALLOWED_IMAGE_FORMATS,
    maxSizeBytes: IMAGE_SIZE_LIMITS.ANIME_COVER,
  },
  ANIME_BANNER: {
    dimensions: IMAGE_DIMENSIONS.ANIME_BANNER,
    transformations: DEFAULT_TRANSFORMATIONS.ANIME_BANNER,
    allowedFormats: ALLOWED_IMAGE_FORMATS,
    maxSizeBytes: IMAGE_SIZE_LIMITS.ANIME_BANNER,
  },
  EPISODE_THUMBNAIL: {
    dimensions: IMAGE_DIMENSIONS.EPISODE_THUMBNAIL,
    transformations: DEFAULT_TRANSFORMATIONS.EPISODE_THUMBNAIL,
    allowedFormats: ALLOWED_IMAGE_FORMATS,
    maxSizeBytes: IMAGE_SIZE_LIMITS.EPISODE_THUMBNAIL,
  },
} as const satisfies Record<string, ImagePresetConfig>;

// Error messages
export const CLOUDINARY_ERROR_MESSAGES = {
  UPLOAD_FAILED: 'Görsel yükleme başarısız oldu',
  DELETE_FAILED: 'Görsel silme başarısız oldu',
  INVALID_FORMAT: 'Desteklenmeyen dosya formatı',
  FILE_TOO_LARGE: 'Dosya boyutu çok büyük',
  INVALID_DIMENSIONS: 'Görsel boyutları uygun değil',
  NETWORK_ERROR: 'Ağ bağlantısı hatası',
  UNAUTHORIZED: 'Yetkisiz erişim',
  QUOTA_EXCEEDED: 'Kullanım kotası aşıldı',
} as const;
