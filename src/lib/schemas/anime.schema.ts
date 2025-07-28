// Anime validasyon şemaları

import { z } from 'zod';
import { ANIME } from '@/lib/constants/anime.constants';
import { AnimeStatus, AnimeType, Season, Source } from '@prisma/client';

// İlk form - Anime tipi seçimi
export const selectAnimeTypeSchema = z.object({
  type: z.nativeEnum(AnimeType, {
    message: 'Anime tipi seçiniz'
  })
});

// Ana form - Anime serisi oluşturma şeması
export const createAnimeSeriesSchema = z.object({
  // Her zaman zorunlu
  type: z.nativeEnum(AnimeType, {
    message: 'Anime tipi seçiniz'
  }),
  title: z.string().min(ANIME.TITLE.MIN_LENGTH, 'Başlık gerekli').max(ANIME.TITLE.MAX_LENGTH, 'Başlık çok uzun'),
  status: z.nativeEnum(AnimeStatus, {
    message: 'Yayın durumu seçiniz'
  }),
  isAdult: z.boolean(),
  
  // Opsiyonel alanlar
  englishTitle: z.string().optional(),
  japaneseTitle: z.string().optional(),
  synonyms: z.array(z.string()).optional(),
  synopsis: z.string().optional(),
  episodes: z.coerce.number().min(1, 'Bölüm sayısı en az 1 olmalı').optional(),
  duration: z.coerce.number().min(ANIME.DURATION.MIN, 'Süre en az 1 dakika olmalı').optional(),
  season: z.nativeEnum(Season).optional(),
  seasonYear: z.coerce.number().min(ANIME.YEAR.MIN, 'Yıl 1900-2100 arasında olmalı').max(ANIME.YEAR.MAX, 'Yıl 1900-2100 arasında olmalı').optional(),
  releaseDate: z.date().optional(),
  source: z.nativeEnum(Source).optional(),
  countryOfOrigin: z.string().optional(),
  anilistAverageScore: z.coerce.number().min(0, 'Puan 0-100 arasında olmalı').max(100, 'Puan 0-100 arasında olmalı').optional(),
  anilistPopularity: z.coerce.number().min(0, 'Popülerlik 0\'dan büyük olmalı').optional(),
  coverImage: z.string().optional(),
  bannerImage: z.string().optional(),
  coverImageFile: z.string().optional(), // Base64 dosya
  bannerImageFile: z.string().optional(), // Base64 dosya
  trailer: z.string().url('Geçerli bir URL girin').optional(),
  
  // İlişkiler
  genreIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  studioIds: z.array(z.string()).optional(),

  isMultiPart: z.boolean(),
  
  // MOVIE için zorunlu, diğerleri için opsiyonel
  anilistId: z.coerce.number().positive('AniList ID pozitif bir sayı olmalı').optional(),
  malId: z.coerce.number().positive('MAL ID pozitif bir sayı olmalı').optional(),
}).refine((data) => {
  // MOVIE ise anilistId zorunlu
  if (data.type === AnimeType.MOVIE && !data.anilistId) {
    return false;
  }
  return true;
}, {
  message: "Film türü için AniList ID zorunludur",
  path: ["anilistId"]
});

// Anime serisi güncelleme şeması
export const updateAnimeSeriesSchema = z.object({
  // Her zaman zorunlu
  type: z.nativeEnum(AnimeType, {
    message: 'Anime tipi seçiniz'
  }),
  title: z.string().min(ANIME.TITLE.MIN_LENGTH, 'Başlık gerekli').max(ANIME.TITLE.MAX_LENGTH, 'Başlık çok uzun'),
  status: z.nativeEnum(AnimeStatus, {
    message: 'Yayın durumu seçiniz'
  }),
  isAdult: z.boolean(),
  
  // Opsiyonel alanlar
  englishTitle: z.string().optional(),
  japaneseTitle: z.string().optional(),
  synonyms: z.array(z.string()).optional(),
  synopsis: z.string().optional(),
  episodes: z.coerce.number().min(1, 'Bölüm sayısı en az 1 olmalı').optional(),
  duration: z.coerce.number().min(ANIME.DURATION.MIN, 'Süre en az 1 dakika olmalı').optional(),
  season: z.nativeEnum(Season).optional(),
  seasonYear: z.coerce.number().min(ANIME.YEAR.MIN, 'Yıl 1900-2100 arasında olmalı').max(ANIME.YEAR.MAX, 'Yıl 1900-2100 arasında olmalı').optional(),
  releaseDate: z.date().optional(),
  source: z.nativeEnum(Source).optional(),
  countryOfOrigin: z.string().optional(),
  anilistAverageScore: z.coerce.number().min(0, 'Puan 0-100 arasında olmalı').max(100, 'Puan 0-100 arasında olmalı').optional(),
  anilistPopularity: z.coerce.number().min(0, 'Popülerlik 0\'dan büyük olmalı').optional(),
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

  isMultiPart: z.boolean(),
  
  // MOVIE için zorunlu, diğerleri için opsiyonel
  anilistId: z.coerce.number().positive('AniList ID pozitif bir sayı olmalı').optional(),
  malId: z.coerce.number().positive('MAL ID pozitif bir sayı olmalı').optional(),
}).refine((data) => {
  // MOVIE ise anilistId zorunlu
  if (data.type === AnimeType.MOVIE && !data.anilistId) {
    return false;
  }
  return true;
}, {
  message: "Film türü için AniList ID zorunludur",
  path: ["anilistId"]
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
export type SelectAnimeTypeInput = z.infer<typeof selectAnimeTypeSchema>;
export type CreateAnimeSeriesInput = z.infer<typeof createAnimeSeriesSchema>;
export type UpdateAnimeSeriesInput = z.infer<typeof updateAnimeSeriesSchema>;
export type AnimeSeriesFilters = z.infer<typeof animeSeriesFiltersSchema>; 