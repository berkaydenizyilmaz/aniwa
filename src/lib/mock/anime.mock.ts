import { AnimeSeries, AnimeType, AnimeStatus } from '@prisma/client';
import { AnimeSeason, AnimeSource, AnimeCountryOfOrigin } from '@/lib/types/constants';

export const mockAnimes: AnimeSeries[] = [
  {
    id: '1',
    aniwaPublicId: 1,
    title: 'Shingeki no Kyojin',
    englishTitle: 'Attack on Titan',
    nativeTitle: '進撃の巨人',
    synonyms: ['Shingeki no Kyojin'],
    synopsis: 'Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called Titans, forcing humans to hide in fear behind enormous concentric walls.',
    coverImage: '/aot.jpg',
    bannerImage: '/images/anime/attack-on-titan-banner.jpg',
    type: 'TV' as AnimeType,
    status: 'FINISHED' as AnimeStatus,
    season: 'SPRING',
    seasonYear: 2013,
    episodes: 25,
    duration: 24,
    source: 'MANGA',
    countryOfOrigin: 'JAPAN',
    isAdult: false,
    anilistAverageScore: 8.54,
    anilistPopularity: 95,
    averageScore: 8.5,
    popularity: 95,
    trailer: null,
    releaseDate: new Date('2013-04-07'),
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-12-01')
  },
  {
    id: '2',
    aniwaPublicId: 2,
    title: 'Kimetsu no Yaiba',
    englishTitle: 'Demon Slayer',
    nativeTitle: '鬼滅の刃',
    synonyms: ['Kimetsu no Yaiba'],
    synopsis: 'A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly.',
    coverImage: '/demon.jpg',
    bannerImage: '/images/anime/demon-slayer-banner.jpg',
    type: 'TV' as AnimeType,
    status: 'ONGOING' as AnimeStatus,
    season: 'SPRING',
    seasonYear: 2019,
    episodes: 26,
    duration: 24,
    source: 'MANGA',
    countryOfOrigin: 'JAPAN',
    isAdult: false,
    anilistAverageScore: 8.49,
    anilistPopularity: 98,
    averageScore: 8.4,
    popularity: 98,
    trailer: null,
    releaseDate: new Date('2019-04-06'),
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date('2023-11-15')
  },
  {
    id: '3',
    aniwaPublicId: 3,
    title: 'Jujutsu Kaisen',
    englishTitle: 'Jujutsu Kaisen',
    nativeTitle: '呪術廻戦',
    synonyms: ['JJK'],
    synopsis: 'A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman\'s school to be able to locate the demon\'s other body parts.',
    coverImage: '/jjk.jpg',
    bannerImage: '/images/anime/jujutsu-kaisen-banner.jpg',
    type: 'TV' as AnimeType,
    status: 'ONGOING' as AnimeStatus,
    season: 'FALL',
    seasonYear: 2020,
    episodes: 24,
    duration: 24,
    source: 'MANGA',
    countryOfOrigin: 'JAPAN',
    isAdult: false,
    anilistAverageScore: 8.62,
    anilistPopularity: 96,
    averageScore: 8.6,
    popularity: 96,
    trailer: null,
    releaseDate: new Date('2020-10-03'),
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2023-10-20')
  },
  {
    id: '4',
    aniwaPublicId: 4,
    title: 'One Piece',
    englishTitle: 'One Piece',
    nativeTitle: 'ワンピース',
    synonyms: ['OP'],
    synopsis: 'Follows the adventures of Monkey D. Luffy and his pirate crew in order to find the greatest treasure ever left by the legendary Pirate, Gold Roger.',
    coverImage: '/onepiece.jpg',
    bannerImage: '/images/anime/one-piece-banner.jpg',
    type: 'TV' as AnimeType,
    status: 'ONGOING' as AnimeStatus,
    season: 'FALL',
    seasonYear: 1999,
    episodes: 1000,
    duration: 24,
    source: 'MANGA',
    countryOfOrigin: 'JAPAN',
    isAdult: false,
    anilistAverageScore: 8.71,
    anilistPopularity: 99,
    averageScore: 8.7,
    popularity: 99,
    trailer: null,
    releaseDate: new Date('1999-10-20'),
    createdAt: new Date('2023-01-05'),
    updatedAt: new Date('2023-12-15')
  },
  {
    id: '5',
    aniwaPublicId: 5,
    title: 'Boku no Hero Academia',
    englishTitle: 'My Hero Academia',
    nativeTitle: '僕のヒーローアカデミア',
    synonyms: ['Boku no Hero Academia', 'BNHA'],
    synopsis: 'In a world where people with superpowers are the norm, Izuku Midoriya has dreams of becoming a hero despite being born completely normal.',
    coverImage: '/mha.jpg',
    bannerImage: '/images/anime/my-hero-academia-banner.jpg',
    type: 'TV' as AnimeType,
    status: 'ONGOING' as AnimeStatus,
    season: 'SPRING',
    seasonYear: 2016,
    episodes: 25,
    duration: 24,
    source: 'MANGA',
    countryOfOrigin: 'JAPAN',
    isAdult: false,
    anilistAverageScore: 7.88,
    anilistPopularity: 94,
    averageScore: 7.8,
    popularity: 94,
    trailer: null,
    releaseDate: new Date('2016-04-03'),
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2023-11-30')
  },
  {
    id: '6',
    aniwaPublicId: 6,
    title: 'Death Note',
    englishTitle: 'Death Note',
    nativeTitle: 'デスノート',
    synonyms: ['DN'],
    synopsis: 'A high school student discovers a supernatural notebook that allows him to kill anyone whose name he writes in it.',
    coverImage: '/deathnote.jpg',
    bannerImage: '/images/anime/death-note-banner.jpg',
    type: 'TV' as AnimeType,
    status: 'FINISHED' as AnimeStatus,
    season: 'FALL',
    seasonYear: 2006,
    episodes: 37,
    duration: 23,
    source: 'MANGA',
    countryOfOrigin: 'JAPAN',
    isAdult: false,
    anilistAverageScore: 8.62,
    anilistPopularity: 97,
    averageScore: 8.6,
    popularity: 97,
    trailer: null,
    releaseDate: new Date('2006-10-04'),
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2023-12-10')
  }
];

// Mock genres for filtering
export const mockGenres = [
  { id: '1', name: 'Action' },
  { id: '2', name: 'Drama' },
  { id: '3', name: 'Fantasy' },
  { id: '4', name: 'Supernatural' },
  { id: '5', name: 'Historical' },
  { id: '6', name: 'Horror' },
  { id: '7', name: 'Adventure' },
  { id: '8', name: 'Comedy' },
  { id: '9', name: 'Mystery' },
  { id: '10', name: 'Psychological' },
  { id: '11', name: 'Fantasy' },
  { id: '12', name: 'Martial Arts' },
  { id: '13', name: 'Superhero' },
  { id: '14', name: 'School Life' }
];

// Mock years for filtering
export const mockYears = [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000, 1999, 1998, 1997, 1996, 1995, 1994, 1993, 1992, 1991, 1990, 1989];

// Mock seasons for filtering
export const mockSeasons = [
  { value: 'WINTER', label: 'Winter' },
  { value: 'SPRING', label: 'Spring' },
  { value: 'SUMMER', label: 'Summer' },
  { value: 'FALL', label: 'Fall' }
];

// Mock formats for filtering
export const mockFormats = [
  { value: 'TV', label: 'TV' },
  { value: 'MOVIE', label: 'Movie' },
  { value: 'OVA', label: 'OVA' },
  { value: 'ONA', label: 'ONA' },
  { value: 'SPECIAL', label: 'Special' }
];

// Mock statuses for filtering
export const mockStatuses = [
  { value: 'FINISHED', label: 'Finished' },
  { value: 'ONGOING', label: 'Ongoing' },
  { value: 'NOT_YET_RELEASED', label: 'Not Yet Released' },
  { value: 'CANCELLED', label: 'Cancelled' }
];

// Mock countries for filtering
export const mockCountries = [
  { value: 'JAPAN', label: 'Japonya' },
  { value: 'SOUTH_KOREA', label: 'Güney Kore' },
  { value: 'CHINA', label: 'Çin' },
  { value: 'UNITED_STATES', label: 'Amerika Birleşik Devletleri' },
  { value: 'UNITED_KINGDOM', label: 'Birleşik Krallık' },
  { value: 'FRANCE', label: 'Fransa' },
  { value: 'GERMANY', label: 'Almanya' },
  { value: 'ITALY', label: 'İtalya' },
  { value: 'SPAIN', label: 'İspanya' },
  { value: 'CANADA', label: 'Kanada' }
];

// Mock sources for filtering
export const mockSources = [
  { value: 'MANGA', label: 'Manga' },
  { value: 'LIGHT_NOVEL', label: 'Light Novel' },
  { value: 'VISUAL_NOVEL', label: 'Visual Novel' },
  { value: 'GAME', label: 'Oyun' },
  { value: 'ORIGINAL', label: 'Orijinal' },
  { value: 'NOVEL', label: 'Roman' },
  { value: 'WEB_NOVEL', label: 'Web Novel' },
  { value: 'BOOK', label: 'Kitap' },
  { value: 'CARD_GAME', label: 'Kart Oyunu' },
  { value: 'MUSIC', label: 'Müzik' }
];

// Mock tags for filtering
export const mockTags = [
  // DEMOGRAPHICS - Hedef Kitle
  { id: '1', name: 'Shounen', category: 'DEMOGRAPHICS', description: 'Erkek gençler için tasarlanmış anime ve manga türü. Genellikle aksiyon, macera ve büyüme temalarını içerir. Karakterler genellikle güçlü olma, hedeflerine ulaşma ve arkadaşlık değerlerini öğrenme yolculuğunda olur.' },
  { id: '2', name: 'Shoujo', category: 'DEMOGRAPHICS', description: 'Kız gençler için tasarlanmış anime ve manga türü. Romantik ilişkiler, duygusal gelişim ve kişisel büyüme temalarına odaklanır. Karakterler genellikle aşk, arkadaşlık ve kendini keşfetme süreçlerinde yer alır.' },
  { id: '3', name: 'Seinen', category: 'DEMOGRAPHICS', description: 'Yetişkin erkekler için tasarlanmış anime ve manga türü. Daha karmaşık hikayeler, olgun temalar ve gerçekçi karakter gelişimi içerir. Genellikle psikolojik derinlik, sosyal konular ve yetişkin yaşamın zorluklarını ele alır.' },
  { id: '4', name: 'Josei', category: 'DEMOGRAPHICS', description: 'Yetişkin kadınlar için tasarlanmış anime ve manga türü. Romantik ilişkiler, kariyer, aile ve kişisel gelişim gibi yetişkin yaşamın gerçekliklerini yansıtır. Karakterler genellikle 20\'li ve 30\'lu yaşlarda olur.' },
  { id: '5', name: 'Kids', category: 'DEMOGRAPHICS', description: 'Çocuklar için tasarlanmış anime ve manga türü. Eğitici içerik, basit hikayeler ve pozitif değerler içerir. Şiddet ve karmaşık temalar genellikle bulunmaz, bunun yerine arkadaşlık, aile ve öğrenme temalarına odaklanır.' },
  
  // THEMES - Ana Temalar
  { id: '6', name: 'Friendship', category: 'THEMES' },
  { id: '7', name: 'Love', category: 'THEMES' },
  { id: '8', name: 'Revenge', category: 'THEMES' },
  { id: '9', name: 'Coming of Age', category: 'THEMES' },
  { id: '10', name: 'Family', category: 'THEMES' },
  { id: '11', name: 'Betrayal', category: 'THEMES' },
  { id: '12', name: 'Redemption', category: 'THEMES' },
  
  // CONTENT - İçerik Niteliği
  { id: '13', name: 'Action', category: 'CONTENT' },
  { id: '14', name: 'Adventure', category: 'CONTENT' },
  { id: '15', name: 'Comedy', category: 'CONTENT' },
  { id: '16', name: 'Drama', category: 'CONTENT' },
  { id: '17', name: 'Fantasy', category: 'CONTENT' },
  { id: '18', name: 'Horror', category: 'CONTENT' },
  { id: '19', name: 'Mystery', category: 'CONTENT' },
  { id: '20', name: 'Psychological', category: 'CONTENT' },
  { id: '21', name: 'Romance', category: 'CONTENT' },
  { id: '22', name: 'Sci-Fi', category: 'CONTENT' },
  { id: '23', name: 'Slice of Life', category: 'CONTENT' },
  { id: '24', name: 'Sports', category: 'CONTENT' },
  { id: '25', name: 'Thriller', category: 'CONTENT' },
  
  // SETTING - Ortam
  { id: '26', name: 'School', category: 'SETTING' },
  { id: '27', name: 'Fantasy World', category: 'SETTING' },
  { id: '28', name: 'Modern Day', category: 'SETTING' },
  { id: '29', name: 'Historical', category: 'SETTING' },
  { id: '30', name: 'Post-Apocalyptic', category: 'SETTING' },
  { id: '31', name: 'Space', category: 'SETTING' },
  { id: '32', name: 'Military', category: 'SETTING' },
  { id: '33', name: 'Urban Fantasy', category: 'SETTING' },
  
  // ELEMENTS - Spesifik Öğeler
  { id: '34', name: 'Magic', category: 'ELEMENTS' },
  { id: '35', name: 'Martial Arts', category: 'ELEMENTS' },
  { id: '36', name: 'Mecha', category: 'ELEMENTS' },
  { id: '37', name: 'Supernatural', category: 'ELEMENTS' },
  { id: '38', name: 'Vampires', category: 'ELEMENTS' },
  { id: '39', name: 'Demons', category: 'ELEMENTS' },
  { id: '40', name: 'Angels', category: 'ELEMENTS' },
  { id: '41', name: 'Time Travel', category: 'ELEMENTS' },
  { id: '42', name: 'Reincarnation', category: 'ELEMENTS' },
  { id: '43', name: 'Isekai', category: 'ELEMENTS' },
  { id: '44', name: 'Harem', category: 'ELEMENTS' },
  { id: '45', name: 'Reverse Harem', category: 'ELEMENTS' }
];
