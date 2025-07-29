// Anime sabitleri

import { AnimeType, AnimeStatus, Season, Source } from '@prisma/client';

export const ANIME = {
  // Title kuralları
  TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },
  
  // Synopsis kuralları
  SYNOPSIS: {
    MAX_LENGTH: 500,
  },
  
  // Episodes kuralları
  EPISODES: {
    MIN: 1,
    MAX: 9999,
  },
  
  // Score kuralları
  SCORE: {
    MIN: 0,
    MAX: 10,
  },
  
  // Popularity kuralları
  POPULARITY: {
    MIN: 0,
  },
  
  // Year kuralları
  YEAR: {
    MIN: 1900,
    MAX: 2100,
  },
  
  // Prisma enum'ları
  TYPE: AnimeType,
  STATUS: AnimeStatus,
  SEASON: Season,
  SOURCE: Source,
  
  // Anime type etiketleri
  TYPE_LABELS: {
    TV: 'TV Dizisi',
    TV_SHORT: 'Kısa TV Dizisi',
    MOVIE: 'Film',
    SPECIAL: 'Özel Bölüm',
    OVA: 'OVA',
    ONA: 'ONA',
  } as const,
  
  // Anime status etiketleri
  STATUS_LABELS: {
    FINISHED: 'Tamamlandı',
    RELEASING: 'Yayınlanıyor',
    NOT_YET_RELEASED: 'Henüz Yayınlanmadı',
    CANCELLED: 'İptal Edildi',
    HIATUS: 'Ara Verildi',
  } as const,
  
  // Season etiketleri
  SEASON_LABELS: {
    WINTER: 'Kış',
    SPRING: 'İlkbahar',
    SUMMER: 'Yaz',
    FALL: 'Sonbahar',
  } as const,
  
  // Source etiketleri
  SOURCE_LABELS: {
    ORIGINAL: 'Özgün',
    MANGA: 'Manga',
    LIGHT_NOVEL: 'Light Novel',
    VISUAL_NOVEL: 'Görsel Roman',
    VIDEO_GAME: 'Video Oyunu',
    NOVEL: 'Roman',
    DOUJINSHI: 'Doujinshi',
  } as const,
} as const; 