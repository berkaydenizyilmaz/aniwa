// Anime validasyon şemaları

import { z } from 'zod';
import { ANIME } from '@/lib/constants/anime.constants';
import { AnimeStatus, AnimeType, Season, Source } from '@prisma/client';

// Anime serisi oluşturma şeması
export const createAnimeSeriesSchema = z.object({
  title: z.string().min(ANIME.TITLE.MIN_LENGTH, 'Başlık gerekli').max(ANIME.TITLE.MAX_LENGTH, 'Başlık çok uzun'),
  englishTitle: z.string().optional(),
  japaneseTitle: z.string().optional(),
  synonyms: z.array(z.string()).optional(),
  anilistId: z.string().optional().refine((val) => {
    if (!val) return true; // Boş ise geçerli
    const num = parseInt(val, 10);
    return !isNaN(num) && num > 0;
  }, 'AniList ID geçerli bir pozitif sayı olmalı').transform((val) => {
    if (!val) return undefined;
    const num = parseInt(val, 10);
    return isNaN(num) ? undefined : num;
  }),
  idMal: z.string().optional().refine((val) => {
    if (!val) return true; // Boş ise geçerli
    const num = parseInt(val, 10);
    return !isNaN(num) && num > 0;
  }, 'MAL ID geçerli bir pozitif sayı olmalı').transform((val) => {
    if (!val) return undefined;
    const num = parseInt(val, 10);
    return isNaN(num) ? undefined : num;
  }),
  type: z.nativeEnum(AnimeType),
  status: z.nativeEnum(AnimeStatus),
  episodes: z.string().optional().refine((val) => {
    if (!val) return true; // Boş ise geçerli
    const num = parseInt(val, 10);
    return !isNaN(num) && num >= 1;
  }, 'Bölüm sayısı 1\'den büyük olmalı').transform((val) => {
    if (!val) return undefined;
    const num = parseInt(val, 10);
    return isNaN(num) ? undefined : num;
  }),
  duration: z.string().optional().refine((val) => {
    if (!val) return true; // Boş ise geçerli
    const num = parseInt(val, 10);
    return !isNaN(num) && num >= ANIME.DURATION.MIN;
  }, 'Süre 1 dakikadan fazla olmalı').transform((val) => {
    if (!val) return undefined;
    const num = parseInt(val, 10);
    return isNaN(num) ? undefined : num;
  }),
  isAdult: z.boolean(),
  season: z.nativeEnum(Season).optional(),
  seasonYear: z.number().min(ANIME.YEAR.MIN, 'Yıl 1900\'den büyük olmalı').max(ANIME.YEAR.MAX, 'Yıl 2100\'den küçük olmalı').optional(),
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
}).refine(() => {
  // Tüm türler için sezon ve yıl opsiyonel (film dahil)
  return true;
}, {
  message: 'Sezon ve yıl bilgisi opsiyoneldir',
  path: ['season']
});

// Anime serisi güncelleme şeması
export const updateAnimeSeriesSchema = z.object({
  title: z.string().min(ANIME.TITLE.MIN_LENGTH, 'Başlık gerekli').max(ANIME.TITLE.MAX_LENGTH, 'Başlık çok uzun'),
  englishTitle: z.string().optional(),
  japaneseTitle: z.string().optional(),
  synonyms: z.array(z.string()).optional(),
  anilistId: z.string().optional().refine((val) => {
    if (!val) return true; // Boş ise geçerli
    const num = parseInt(val, 10);
    return !isNaN(num) && num > 0;
  }, 'AniList ID pozitif olmalı').transform((val) => {
    if (!val) return undefined;
    const num = parseInt(val, 10);
    return isNaN(num) ? undefined : num;
  }),
  idMal: z.string().optional().refine((val) => {
    if (!val) return true; // Boş ise geçerli
    const num = parseInt(val, 10);
    return !isNaN(num) && num > 0;
  }, 'MAL ID pozitif olmalı').transform((val) => {
    if (!val) return undefined;
    const num = parseInt(val, 10);
    return isNaN(num) ? undefined : num;
  }),
  type: z.nativeEnum(AnimeType),
  status: z.nativeEnum(AnimeStatus),
  episodes: z.string().optional().refine((val) => {
    if (!val) return true; // Boş ise geçerli
    const num = parseInt(val, 10);
    return !isNaN(num) && num >= 1;
  }, 'Bölüm sayısı 1\'den büyük olmalı').transform((val) => {
    if (!val) return undefined;
    const num = parseInt(val, 10);
    return isNaN(num) ? undefined : num;
  }),
  duration: z.string().optional().refine((val) => {
    if (!val) return true; // Boş ise geçerli
    const num = parseInt(val, 10);
    return !isNaN(num) && num >= ANIME.DURATION.MIN;
  }, 'Süre 1 dakikadan fazla olmalı').transform((val) => {
    if (!val) return undefined;
    const num = parseInt(val, 10);
    return isNaN(num) ? undefined : num;
  }),
  isAdult: z.boolean(),
  season: z.nativeEnum(Season).optional(),
  seasonYear: z.number().min(ANIME.YEAR.MIN, 'Yıl 1900\'den büyük olmalı').max(ANIME.YEAR.MAX, 'Yıl 2100\'den küçük olmalı').optional(),
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
}).refine(() => {
  // Tüm türler için sezon ve yıl opsiyonel (film dahil)
  return true;
}, {
  message: 'Sezon ve yıl bilgisi opsiyoneldir',
  path: ['season']
});

// Anime serisi filtreleme şeması
export const animeSeriesFiltersSchema = z.object({
  search: z.string().optional(),
  type: z.nativeEnum(AnimeType).optional(),
  status: z.nativeEnum(AnimeStatus).optional(),
  season: z.nativeEnum(Season).optional(),
  seasonYear: z.number().min(ANIME.YEAR.MIN, 'Yıl 1900\'den büyük olmalı').max(ANIME.YEAR.MAX, 'Yıl 2100\'den küçük olmalı').optional(),
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