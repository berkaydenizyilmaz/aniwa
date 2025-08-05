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
    MAX: 100,
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
  
  // Anime type renkleri (UI için)
  TYPE_COLORS: {
    TV: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    TV_SHORT: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    MOVIE: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    SPECIAL: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    OVA: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    ONA: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  } as const,
  
  // Anime status etiketleri
  STATUS_LABELS: {
    FINISHED: 'Tamamlandı',
    RELEASING: 'Yayınlanıyor',
    NOT_YET_RELEASED: 'Henüz Yayınlanmadı',
    CANCELLED: 'İptal Edildi',
    HIATUS: 'Ara Verildi',
  } as const,
  
  // Anime status renkleri (UI için)
  STATUS_COLORS: {
    FINISHED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    RELEASING: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    NOT_YET_RELEASED: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    HIATUS: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  } as const,
  
  // Season etiketleri
  SEASON_LABELS: {
    WINTER: 'Kış',
    SPRING: 'İlkbahar',
    SUMMER: 'Yaz',
    FALL: 'Sonbahar',
  } as const,

  // Title Language etiketleri
  TITLE_LANGUAGE_LABELS: {
    ROMAJI: 'Romaji',
    ENGLISH: 'İngilizce',
    NATIVE: 'Yerel',
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