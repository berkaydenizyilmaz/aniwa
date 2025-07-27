// Anime validasyon şemaları

import { z } from 'zod';
import { ANIME } from '@/lib/constants/anime.constants';
import { AnimeStatus, AnimeType, Season, Source } from '@prisma/client';

// Anime serisi oluşturma şeması
export const createAnimeSeriesSchema = z.object({
  title: z.string().min(ANIME.TITLE.MIN_LENGTH, 'Başlık gerekli').max(ANIME.TITLE.MAX_LENGTH, 'Başlık çok uzun'),
  englishTitle: z.string().optional(),
  japaneseTitle: z.string().optional(),
  synonyms: z.string().optional(),
  anilistId: z.coerce.number().positive('AniList ID pozitif bir sayı olmalı'),
  idMal: z.coerce.number().positive('MAL ID pozitif bir sayı olmalı').optional(),
  type: z.nativeEnum(AnimeType),
  status: z.nativeEnum(AnimeStatus),
  episodes: z.coerce.number().min(1, 'Bölüm sayısı en az 1 olmalı').optional(),
  duration: z.coerce.number().min(ANIME.DURATION.MIN, 'Süre en az 1 dakika olmalı').optional(),
  isAdult: z.boolean(),
  season: z.nativeEnum(Season).optional(),
  seasonYear: z.coerce.number().min(ANIME.YEAR.MIN, 'Yıl 1900-2100 arasında olmalı').max(ANIME.YEAR.MAX, 'Yıl 1900-2100 arasında olmalı').optional(),
  releaseDate: z.date().optional(),
  source: z.nativeEnum(Source).optional(),
  countryOfOrigin: z.string().optional(),
  description: z.string().optional(),
  isMultiPart: z.boolean(),
  // Görsel İçerik
  coverImage: z.string().optional(),
  bannerImage: z.string().optional(),
  coverImageFile: z.string().optional(), // Base64 dosya
  bannerImageFile: z.string().optional(), // Base64 dosya
  trailer: z.string().url('Geçerli bir URL girin').optional(),
  // İlişkiler
  genreIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  studioIds: z.array(z.string()).optional(),
});

// Anime serisi güncelleme şeması
export const updateAnimeSeriesSchema = z.object({
  title: z.string().min(ANIME.TITLE.MIN_LENGTH, 'Başlık gerekli').max(ANIME.TITLE.MAX_LENGTH, 'Başlık çok uzun'),
  englishTitle: z.string().optional(),
  japaneseTitle: z.string().optional(),
  synonyms: z.string().optional(),
  anilistId: z.coerce.number().positive('AniList ID pozitif bir sayı olmalı'),
  idMal: z.coerce.number().positive('MAL ID pozitif bir sayı olmalı').optional(),
  type: z.nativeEnum(AnimeType),
  status: z.nativeEnum(AnimeStatus),
  episodes: z.coerce.number().min(1, 'Bölüm sayısı en az 1 olmalı').optional(),
  duration: z.coerce.number().min(ANIME.DURATION.MIN, 'Süre en az 1 dakika olmalı').optional(),
  isAdult: z.boolean(),
  season: z.nativeEnum(Season).optional(),
  seasonYear: z.coerce.number().min(ANIME.YEAR.MIN, 'Yıl 1900-2100 arasında olmalı').max(ANIME.YEAR.MAX, 'Yıl 1900-2100 arasında olmalı').optional(),
  releaseDate: z.date().optional(),
  source: z.nativeEnum(Source).optional(),
  countryOfOrigin: z.string().optional(),
  description: z.string().optional(),
  isMultiPart: z.boolean(),
  // Görsel İçerik
  coverImage: z.string().optional(),
  bannerImage: z.string().optional(),
  coverImageFile: z.string().optional(), // Base64 dosya
  bannerImageFile: z.string().optional(), // Base64 dosya
  coverImageToDelete: z.boolean().optional(), // Mevcut resmi silmek için
  bannerImageToDelete: z.boolean().optional(), // Mevcut resmi silmek için
  trailer: z.string().url('Geçerli bir URL girin').optional(),
  // İlişkiler
  genreIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  studioIds: z.array(z.string()).optional(),
});

// Anime serisi filtreleme şeması
export const animeSeriesFiltersSchema = z.object({
  search: z.string().optional(),
  type: z.nativeEnum(AnimeType).optional(),
  status: z.nativeEnum(AnimeStatus).optional(),
  season: z.nativeEnum(Season).optional(),
  seasonYear: z.coerce.number().min(ANIME.YEAR.MIN, 'Yıl 1900\'den büyük olmalı').max(ANIME.YEAR.MAX, 'Yıl 2100\'den küçük olmalı').optional(),
  source: z.nativeEnum(Source).optional(),
  sortBy: z.enum(['title', 'averageScore', 'popularity', 'createdAt', 'seasonYear']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().min(ANIME.PAGINATION.MIN_PAGE).default(ANIME.PAGINATION.MIN_PAGE),
  limit: z.number().min(ANIME.PAGINATION.MIN_PAGE).max(ANIME.PAGINATION.MAX_LIMIT).default(ANIME.PAGINATION.DEFAULT_LIMIT),
});

// Tip türetmeleri
export type CreateAnimeSeriesInput = z.infer<typeof createAnimeSeriesSchema>;
export type UpdateAnimeSeriesInput = z.infer<typeof updateAnimeSeriesSchema>;
export type AnimeSeriesFilters = z.infer<typeof animeSeriesFiltersSchema>; 