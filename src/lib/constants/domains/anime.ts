// Anime domain constants - Anime ile ilgili tüm sabitler

import { SHARED_VALIDATION } from '../shared/validation';
import { SHARED_UI } from '../shared/ui';

export const ANIME_DOMAIN = {
  // Validation Rules
  VALIDATION: {
    TITLE: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 100,
    },
    SYNOPSIS: {
      MAX_LENGTH: 500,
    },
    EPISODES: {
      MIN: 1,
      MAX: 9999,
    },
    SCORE: {
      MIN: 0,
      MAX: 100,
    },
    POPULARITY: {
      MIN: 0,
    },
    YEAR: {
      MIN: 1900,
      MAX: 2100,
    },
  },
  
  // Business Rules
  BUSINESS: {
    MAX_MEDIA_PARTS: 50,
    MAX_EPISODES_PER_PART: 999,
    DEFAULT_STATUS: 'RELEASING' as const,
  },

  // List Rules
  LIST: {
    PAGINATION: {
      DEFAULT_PAGE: 1,
      DEFAULT_LIMIT: 20,
      MAX_LIMIT: 50,
      MIN_LIMIT: 1,
    },
    SORT: {
      OPTIONS: {
        POPULARITY: 'popularity',
        ANILIST_SCORE: 'anilistAverageScore',
        CREATED_AT: 'createdAt',
        TITLE: 'title',
      } as const,
      DEFAULT: 'popularity' as const,
      DEFAULT_ORDER: 'desc' as const,
    },
    FILTERS: {
      DEFAULT_ADULT: false,
    },
  },
  
  // UI Presentation
  UI: {
    TYPE_LABELS: {
      TV: 'TV Dizisi',
      TV_SHORT: 'Kısa TV Dizisi',
      MOVIE: 'Film',
      SPECIAL: 'Özel Bölüm',
      OVA: 'OVA',
      ONA: 'ONA',
    },
    TYPE_COLORS: {
      TV: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      TV_SHORT: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      MOVIE: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      SPECIAL: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      OVA: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      ONA: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    },
    STATUS_LABELS: {
      FINISHED: 'Tamamlandı',
      RELEASING: 'Yayınlanıyor',
      NOT_YET_RELEASED: 'Henüz Yayınlanmadı',
      CANCELLED: 'İptal Edildi',
      HIATUS: 'Ara Verildi',
    },
    STATUS_COLORS: {
      FINISHED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      RELEASING: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      NOT_YET_RELEASED: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      HIATUS: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    },
    SEASON_LABELS: {
      WINTER: 'Kış',
      SPRING: 'İlkbahar',
      SUMMER: 'Yaz',
      FALL: 'Sonbahar',
    },
    TITLE_LANGUAGE_LABELS: {
      ROMAJI: 'Romaji',
      ENGLISH: 'İngilizce',
      NATIVE: 'Yerel',
    },
    SOURCE_LABELS: {
      ORIGINAL: 'Özgün',
      MANGA: 'Manga',
      LIGHT_NOVEL: 'Light Novel',
      VISUAL_NOVEL: 'Görsel Roman',
      VIDEO_GAME: 'Video Oyunu',
      NOVEL: 'Roman',
      DOUJINSHI: 'Doujinshi',
      WEB_NOVEL: 'Web Roman',
      LIVE_ACTION: 'Live Action',
      GAME: 'Oyun',
      COMIC: 'Çizgi Roman',
      MULTIMEDIA_PROJECT: 'Multimedya Projesi',
      PICTURE_BOOK: 'Resimli Kitap',
      OTHER: 'Diğer',
    },
    COUNTRY_OF_ORIGIN_LABELS: {
      JAPAN: 'Japonya',
      SOUTH_KOREA: 'Güney Kore',
      CHINA: 'Çin',
    },
  },
  
  // Pagination (inherits from shared)
  PAGINATION: SHARED_VALIDATION.PAGINATION,
} as const;
