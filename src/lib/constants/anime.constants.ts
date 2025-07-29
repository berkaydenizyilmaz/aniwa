// Anime sabitleri

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
    WEB_NOVEL: 'Web Roman',
    LIVE_ACTION: 'Live Action',
    GAME: 'Oyun',
    COMIC: 'Çizgi Roman',
    MULTIMEDIA_PROJECT: 'Multimedya Projesi',
    PICTURE_BOOK: 'Resimli Kitap',
    OTHER: 'Diğer',
  } as const,
  
  // Country of origin etiketleri
  COUNTRY_OF_ORIGIN_LABELS: {
    JAPAN: 'Japonya',
    SOUTH_KOREA: 'Güney Kore',
    CHINA: 'Çin',
  } as const,
} as const; 