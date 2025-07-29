// Anime validasyon şemaları

import { z } from 'zod';
import { AnimeType, AnimeStatus, Season, Source, CountryOfOrigin } from '@prisma/client';
import { ANIME } from '@/lib/constants/anime.constants';
import { MASTER_DATA } from '@/lib/constants/masterData.constants';

// Anime Series oluşturma şeması
export const createAnimeSeriesSchema = z.object({
  title: z.string().min(ANIME.TITLE.MIN_LENGTH, 'Anime başlığı gerekli').max(ANIME.TITLE.MAX_LENGTH, 'Anime başlığı çok uzun'),
  englishTitle: z.string().max(ANIME.TITLE.MAX_LENGTH, 'İngilizce başlık çok uzun').optional(),
  japaneseTitle: z.string().max(ANIME.TITLE.MAX_LENGTH, 'Japonca başlık çok uzun').optional(),
  synopsis: z.string().max(ANIME.SYNOPSIS.MAX_LENGTH, 'Özet çok uzun').optional(),
  type: z.nativeEnum(AnimeType),
  status: z.nativeEnum(AnimeStatus),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  season: z.nativeEnum(Season).optional(),
  year: z.number().min(ANIME.YEAR.MIN).max(ANIME.YEAR.MAX).optional(),
  source: z.nativeEnum(Source).optional(),
  countryOfOrigin: z.nativeEnum(CountryOfOrigin).optional(),
  isAdult: z.boolean().default(false),
  trailer: z.string().url('Geçerli bir URL girin').optional(),
  synonyms: z.array(z.string()).optional(),
  genres: z.array(z.string()).optional(),
  studios: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

// Anime Series güncelleme şeması
export const updateAnimeSeriesSchema = z.object({
  title: z.string().min(ANIME.TITLE.MIN_LENGTH, 'Anime başlığı gerekli').max(ANIME.TITLE.MAX_LENGTH, 'Anime başlığı çok uzun').optional(),
  englishTitle: z.string().max(ANIME.TITLE.MAX_LENGTH, 'İngilizce başlık çok uzun').optional(),
  japaneseTitle: z.string().max(ANIME.TITLE.MAX_LENGTH, 'Japonca başlık çok uzun').optional(),
  synopsis: z.string().max(ANIME.SYNOPSIS.MAX_LENGTH, 'Özet çok uzun').optional(),
  type: z.nativeEnum(AnimeType).optional(),
  status: z.nativeEnum(AnimeStatus).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  season: z.nativeEnum(Season).optional(),
  year: z.number().min(ANIME.YEAR.MIN).max(ANIME.YEAR.MAX).optional(),
  source: z.nativeEnum(Source).optional(),
  countryOfOrigin: z.nativeEnum(CountryOfOrigin).optional(),
  isAdult: z.boolean().optional(),
  trailer: z.string().url('Geçerli bir URL girin').optional(),
  synonyms: z.array(z.string()).optional(),
  genres: z.array(z.string()).optional(),
  studios: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

// Anime Media Part oluşturma şeması
export const createAnimeMediaPartSchema = z.object({
  seriesId: z.string().min(1, 'Anime serisi ID gerekli'),
  title: z.string().min(ANIME.TITLE.MIN_LENGTH, 'Medya parçası başlığı gerekli').max(ANIME.TITLE.MAX_LENGTH, 'Medya parçası başlığı çok uzun'),
  englishTitle: z.string().max(ANIME.TITLE.MAX_LENGTH, 'İngilizce başlık çok uzun').optional(),
  japaneseTitle: z.string().max(ANIME.TITLE.MAX_LENGTH, 'Japonca başlık çok uzun').optional(),
  notes: z.string().max(ANIME.SYNOPSIS.MAX_LENGTH, 'Notlar çok uzun').optional(),
  episodes: z.number().min(ANIME.EPISODES.MIN, 'Bölüm sayısı en az 1 olmalı').max(ANIME.EPISODES.MAX, 'Bölüm sayısı çok yüksek').optional(),
  duration: z.number().min(1, 'Süre en az 1 dakika olmalı').max(1000, 'Süre çok yüksek').optional(),
  releaseDate: z.date().optional(),
  anilistId: z.number().optional(),
  malId: z.number().optional(),
  averageScore: z.number().min(ANIME.SCORE.MIN).max(ANIME.SCORE.MAX).optional(),
  popularity: z.number().min(ANIME.POPULARITY.MIN).optional(),
  anilistAverageScore: z.number().min(ANIME.SCORE.MIN).max(ANIME.SCORE.MAX).optional(),
  anilistPopularity: z.number().min(ANIME.POPULARITY.MIN).optional(),
});

// Anime Media Part güncelleme şeması
export const updateAnimeMediaPartSchema = z.object({
  title: z.string().min(ANIME.TITLE.MIN_LENGTH, 'Medya parçası başlığı gerekli').max(ANIME.TITLE.MAX_LENGTH, 'Medya parçası başlığı çok uzun').optional(),
  englishTitle: z.string().max(ANIME.TITLE.MAX_LENGTH, 'İngilizce başlık çok uzun').optional(),
  japaneseTitle: z.string().max(ANIME.TITLE.MAX_LENGTH, 'Japonca başlık çok uzun').optional(),
  notes: z.string().max(ANIME.SYNOPSIS.MAX_LENGTH, 'Notlar çok uzun').optional(),
  episodes: z.number().min(ANIME.EPISODES.MIN, 'Bölüm sayısı en az 1 olmalı').max(ANIME.EPISODES.MAX, 'Bölüm sayısı çok yüksek').optional(),
  duration: z.number().min(1, 'Süre en az 1 dakika olmalı').max(1000, 'Süre çok yüksek').optional(),
  releaseDate: z.date().optional(),
  anilistId: z.number().optional(),
  malId: z.number().optional(),
  averageScore: z.number().min(ANIME.SCORE.MIN).max(ANIME.SCORE.MAX).optional(),
  popularity: z.number().min(ANIME.POPULARITY.MIN).optional(),
  anilistAverageScore: z.number().min(ANIME.SCORE.MIN).max(ANIME.SCORE.MAX).optional(),
  anilistPopularity: z.number().min(ANIME.POPULARITY.MIN).optional(),
});

// Anime filtreleme şeması
export const animeFiltersSchema = z.object({
  search: z.string().optional(),
  type: z.nativeEnum(AnimeType).optional(),
  status: z.nativeEnum(AnimeStatus).optional(),
  season: z.nativeEnum(Season).optional(),
  year: z.number().min(ANIME.YEAR.MIN).max(ANIME.YEAR.MAX).optional(),
  source: z.nativeEnum(Source).optional(),
  genres: z.array(z.string()).optional(),
  studios: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  page: z.number().min(MASTER_DATA.PAGINATION.MIN_PAGE).default(MASTER_DATA.PAGINATION.MIN_PAGE),
  limit: z.number().min(MASTER_DATA.PAGINATION.MIN_PAGE).max(MASTER_DATA.PAGINATION.MAX_LIMIT).default(MASTER_DATA.PAGINATION.DEFAULT_LIMIT),
});

// Tip türetmeleri
export type CreateAnimeSeriesInput = z.infer<typeof createAnimeSeriesSchema>;
export type UpdateAnimeSeriesInput = z.infer<typeof updateAnimeSeriesSchema>;
export type CreateAnimeMediaPartInput = z.infer<typeof createAnimeMediaPartSchema>;
export type UpdateAnimeMediaPartInput = z.infer<typeof updateAnimeMediaPartSchema>;
export type AnimeFilters = z.infer<typeof animeFiltersSchema>; 