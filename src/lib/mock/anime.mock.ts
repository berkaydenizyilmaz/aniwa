import { AnimeSeries, AnimeType, AnimeStatus } from '@prisma/client';
import { AnimeSeason, AnimeSource, AnimeCountryOfOrigin } from '@/lib/types/constants';

export const mockAnimes: AnimeSeries[] = [
  {
    id: '1',
    aniwaPublicId: 1,
    title: 'Attack on Titan',
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
    title: 'Demon Slayer',
    englishTitle: 'Demon Slayer: Kimetsu no Yaiba',
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
