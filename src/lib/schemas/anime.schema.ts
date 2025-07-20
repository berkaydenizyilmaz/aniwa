// Anime validasyon şemaları

import { z } from 'zod';
import { ANIME } from '@/lib/constants/anime.constants';

// Bölüm oluşturma şeması
export const createEpisodeSchema = z.object({
  episodeNumber: z.number().min(1, 'Bölüm numarası 1\'den büyük olmalı'),
  title: z.string().optional(),
  englishTitle: z.string().optional(),
  japaneseTitle: z.string().optional(),
  description: z.string().optional(),
  thumbnailImage: z.string().url('Geçerli bir URL girin').optional(),
  airDate: z.date().optional(),
  duration: z.number().min(ANIME.DURATION.MIN, 'Süre 1 dakikadan fazla olmalı').optional(),
  isFiller: z.boolean().default(false),
  fillerNotes: z.string().optional(),
  averageScore: z.number().min(ANIME.SCORE.MIN).max(ANIME.SCORE.MAX_10, 'Puan 0-10 arası olmalı').optional(),
});

// Anime medya parçası oluşturma şeması
export const createAnimeMediaPartSchema = z.object({
  title: z.string().min(ANIME.TITLE.MIN_LENGTH, 'Başlık gerekli'),
  englishTitle: z.string().optional(),
  japaneseTitle: z.string().optional(),
  displayOrder: z.number().min(1, 'Sıra numarası 1\'den büyük olmalı').optional(),
  notes: z.string().optional(),
  type: z.nativeEnum(ANIME.TYPE),
  episodes: z.number().min(1, 'Bölüm sayısı 1\'den büyük olmalı').optional(),
  duration: z.number().min(ANIME.DURATION.MIN, 'Süre 1 dakikadan fazla olmalı').optional(),
  releaseDate: z.date().optional(),
  anilistAverageScore: z.number().min(ANIME.SCORE.MIN).max(ANIME.SCORE.MAX_100, 'Puan 0-100 arası olmalı').optional(),
  anilistPopularity: z.number().min(1, 'Popülerlik 1\'den büyük olmalı').optional(),
  averageScore: z.number().min(ANIME.SCORE.MIN).max(ANIME.SCORE.MAX_10, 'Puan 0-10 arası olmalı').optional(),
  popularity: z.number().min(1, 'Popülerlik 1\'den büyük olmalı').optional(),
  episodeList: z.array(createEpisodeSchema).optional(),
});

// Anime serisi oluşturma şeması
export const createAnimeSeriesSchema = z.object({
  title: z.string().min(ANIME.TITLE.MIN_LENGTH, 'Başlık gerekli').max(ANIME.TITLE.MAX_LENGTH, 'Başlık çok uzun'),
  englishTitle: z.string().optional(),
  japaneseTitle: z.string().optional(),
  synonyms: z.array(z.string()).optional(),
  type: z.nativeEnum(ANIME.TYPE),
  status: z.nativeEnum(ANIME.STATUS).default('RELEASING'),
  episodes: z.number().min(1, 'Bölüm sayısı 1\'den büyük olmalı').optional(),
  duration: z.number().min(ANIME.DURATION.MIN, 'Süre 1 dakikadan fazla olmalı').optional(),
  isAdult: z.boolean().default(false),
  season: z.nativeEnum(ANIME.SEASON).optional(),
  seasonYear: z.number().min(ANIME.YEAR.MIN, 'Yıl 1900\'den büyük olmalı').max(ANIME.YEAR.MAX, 'Yıl 2100\'den küçük olmalı').optional(),
  source: z.nativeEnum(ANIME.SOURCE).optional(),
  countryOfOrigin: z.string().optional(),
  anilistAverageScore: z.number().min(ANIME.SCORE.MIN).max(ANIME.SCORE.MAX_100, 'Puan 0-100 arası olmalı').optional(),
  anilistPopularity: z.number().min(1, 'Popülerlik 1\'den büyük olmalı').optional(),
  averageScore: z.number().min(ANIME.SCORE.MIN).max(ANIME.SCORE.MAX_10, 'Puan 0-10 arası olmalı').optional(),
  popularity: z.number().min(1, 'Popülerlik 1\'den büyük olmalı').optional(),
  coverImage: z.string().url('Geçerli bir URL girin').optional(),
  bannerImage: z.string().url('Geçerli bir URL girin').optional(),
  description: z.string().optional(),
  trailer: z.string().url('Geçerli bir URL girin').optional(),
  relatedAnimeIds: z.array(z.string()).optional(),
  genreIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  studioIds: z.array(z.string()).optional(),
  mediaParts: z.array(createAnimeMediaPartSchema).optional(),
});

// Anime serisi filtreleme şeması
export const animeSeriesFiltersSchema = z.object({
  search: z.string().optional(),
  type: z.nativeEnum(ANIME.TYPE).optional(),
  status: z.nativeEnum(ANIME.STATUS).optional(),
  season: z.nativeEnum(ANIME.SEASON).optional(),
  seasonYear: z.number().min(ANIME.YEAR.MIN).max(ANIME.YEAR.MAX).optional(),
  source: z.nativeEnum(ANIME.SOURCE).optional(),
  sortBy: z.enum(['title', 'averageScore', 'popularity', 'createdAt', 'seasonYear']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().min(ANIME.PAGINATION.MIN_PAGE).default(ANIME.PAGINATION.MIN_PAGE),
  limit: z.number().min(ANIME.PAGINATION.MIN_PAGE).max(ANIME.PAGINATION.MAX_LIMIT).default(ANIME.PAGINATION.DEFAULT_LIMIT),
});

// Tip türetmeleri
export type CreateAnimeSeriesInput = z.infer<typeof createAnimeSeriesSchema>;
export type CreateAnimeMediaPartInput = z.infer<typeof createAnimeMediaPartSchema>;
export type CreateEpisodeInput = z.infer<typeof createEpisodeSchema>;
export type AnimeSeriesFilters = z.infer<typeof animeSeriesFiltersSchema>;

// Anime serisi güncelleme şeması (tüm alanlar opsiyonel)
export const updateAnimeSeriesSchema = createAnimeSeriesSchema.partial(); 