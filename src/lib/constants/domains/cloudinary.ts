// Cloudinary domain constants - Cloudinary ile ilgili tüm sabitler

import { ImageDimensions, ImagePresetConfig, CloudinaryTransformation } from '@/lib/types/cloudinary';

export const CLOUDINARY_DOMAIN = {
  // Image categories
  CATEGORIES: {
    USER_PROFILE: 'USER_PROFILE',
    USER_BANNER: 'USER_BANNER',
    ANIME_COVER: 'ANIME_COVER',
    ANIME_BANNER: 'ANIME_BANNER',
    EPISODE_THUMBNAIL: 'EPISODE_THUMBNAIL',
  } as const,
  
  // Folder structure
  FOLDERS: {
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
  },
  
  // Image size limits (in bytes)
  SIZE_LIMITS: {
    USER_PROFILE: 5 * 1024 * 1024,     // 5MB
    USER_BANNER: 10 * 1024 * 1024,     // 10MB
    ANIME_COVER: 8 * 1024 * 1024,      // 8MB
    ANIME_BANNER: 15 * 1024 * 1024,    // 15MB
    EPISODE_THUMBNAIL: 3 * 1024 * 1024, // 3MB
  },
  
  // Standard image dimensions
  DIMENSIONS: {
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
  } satisfies Record<string, ImageDimensions>,
  
  // Responsive image dimensions
  RESPONSIVE_DIMENSIONS: {
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
  },
  
  // Default transformations for different image types
  TRANSFORMATIONS: {
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
  } satisfies Record<string, CloudinaryTransformation[]>,
  
  // Allowed file formats
  ALLOWED_FORMATS: [
    'jpg',
    'jpeg',
    'png',
    'webp',
    'avif',
  ],
  
  // Image quality settings
  QUALITY: {
    HIGH: 90,
    MEDIUM: 75,
    LOW: 60,
    AUTO: 'auto',
  },
  
  // Responsive breakpoints for image sizes
  BREAKPOINTS: {
    MOBILE: 640,
    TABLET: 768,
    DESKTOP: 1024,
  },
  
  // Responsive sizes configuration
  RESPONSIVE_SIZES: {
    USER_PROFILE: {
      MOBILE: 100,
      TABLET: 200,
      DESKTOP: 400,
    },
    ANIME_COVER: {
      MOBILE: 150,
      TABLET: 300,
      DESKTOP: 600,
    },
  },
  
  // Thumbnail and placeholder settings
  THUMBNAIL: {
    DEFAULT_SIZE: 150,
    PLACEHOLDER: {
      SIZE: 50,
      BLUR: 1000,
    },
  },
  
  // Cloudinary API limits
  LIMITS: {
    MAX_RESULTS_PER_QUERY: 500,
    MAX_DELETE_BATCH_SIZE: 100,
  },
  
  // Error messages
  ERROR_MESSAGES: {
    UPLOAD_FAILED: 'Görsel yükleme başarısız oldu',
    DELETE_FAILED: 'Görsel silme başarısız oldu',
    INVALID_FORMAT: 'Desteklenmeyen dosya formatı',
    FILE_TOO_LARGE: 'Dosya boyutu çok büyük',
    INVALID_DIMENSIONS: 'Görsel boyutları uygun değil',
    NETWORK_ERROR: 'Ağ bağlantısı hatası',
    UNAUTHORIZED: 'Yetkisiz erişim',
    QUOTA_EXCEEDED: 'Kullanım kotası aşıldı',
  },
} as const;

// Legacy exports for backward compatibility
export const IMAGE_PRESET_CONFIGS = {
  USER_PROFILE: {
    folder: CLOUDINARY_DOMAIN.FOLDERS.USERS.PROFILES,
    sizeLimit: CLOUDINARY_DOMAIN.SIZE_LIMITS.USER_PROFILE,
    dimensions: CLOUDINARY_DOMAIN.DIMENSIONS.USER_PROFILE,
    transformations: CLOUDINARY_DOMAIN.TRANSFORMATIONS.USER_PROFILE,
    allowedFormats: CLOUDINARY_DOMAIN.ALLOWED_FORMATS,
  },
  USER_BANNER: {
    folder: CLOUDINARY_DOMAIN.FOLDERS.USERS.BANNERS,
    sizeLimit: CLOUDINARY_DOMAIN.SIZE_LIMITS.USER_BANNER,
    dimensions: CLOUDINARY_DOMAIN.DIMENSIONS.USER_BANNER,
    transformations: CLOUDINARY_DOMAIN.TRANSFORMATIONS.USER_BANNER,
    allowedFormats: CLOUDINARY_DOMAIN.ALLOWED_FORMATS,
  },
  ANIME_COVER: {
    folder: CLOUDINARY_DOMAIN.FOLDERS.ANIME.SERIES.COVERS,
    sizeLimit: CLOUDINARY_DOMAIN.SIZE_LIMITS.ANIME_COVER,
    dimensions: CLOUDINARY_DOMAIN.DIMENSIONS.ANIME_COVER,
    transformations: CLOUDINARY_DOMAIN.TRANSFORMATIONS.ANIME_COVER,
    allowedFormats: CLOUDINARY_DOMAIN.ALLOWED_FORMATS,
  },
  ANIME_BANNER: {
    folder: CLOUDINARY_DOMAIN.FOLDERS.ANIME.SERIES.BANNERS,
    sizeLimit: CLOUDINARY_DOMAIN.SIZE_LIMITS.ANIME_BANNER,
    dimensions: CLOUDINARY_DOMAIN.DIMENSIONS.ANIME_BANNER,
    transformations: CLOUDINARY_DOMAIN.TRANSFORMATIONS.ANIME_BANNER,
    allowedFormats: CLOUDINARY_DOMAIN.ALLOWED_FORMATS,
  },
  EPISODE_THUMBNAIL: {
    folder: CLOUDINARY_DOMAIN.FOLDERS.ANIME.EPISODES.THUMBNAILS,
    sizeLimit: CLOUDINARY_DOMAIN.SIZE_LIMITS.EPISODE_THUMBNAIL,
    dimensions: CLOUDINARY_DOMAIN.DIMENSIONS.EPISODE_THUMBNAIL,
    transformations: CLOUDINARY_DOMAIN.TRANSFORMATIONS.EPISODE_THUMBNAIL,
    allowedFormats: CLOUDINARY_DOMAIN.ALLOWED_FORMATS,
  },
} as const;

// Legacy exports for backward compatibility
export const RESPONSIVE_DIMENSIONS = CLOUDINARY_DOMAIN.RESPONSIVE_DIMENSIONS;
export const RESPONSIVE_BREAKPOINTS = CLOUDINARY_DOMAIN.BREAKPOINTS;
export const RESPONSIVE_SIZES = CLOUDINARY_DOMAIN.RESPONSIVE_SIZES;
export const THUMBNAIL_SETTINGS = CLOUDINARY_DOMAIN.THUMBNAIL;
export const CLOUDINARY_ERROR_MESSAGES = CLOUDINARY_DOMAIN.ERROR_MESSAGES;
export const CLOUDINARY_LIMITS = CLOUDINARY_DOMAIN.LIMITS;
