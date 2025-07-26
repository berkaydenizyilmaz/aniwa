// Anime validasyon şemaları

import { z } from 'zod';
import { ANIME } from '@/lib/constants/anime.constants';

// Anime serisi oluşturma şeması
export const createAnimeSeriesSchema = z.object({
  title: z.string().min(ANIME.TITLE.MIN_LENGTH, 'Başlık gerekli').max(ANIME.TITLE.MAX_LENGTH, 'Başlık çok uzun'),
  englishTitle: z.string().optional(),
  japaneseTitle: z.string().optional(),
  synonyms: z.array(z.string()).optional(),
  type: z.nativeEnum(ANIME.TYPE),
  status: z.nativeEnum(ANIME.STATUS),
  episodes: z.number().min(1, 'Bölüm sayısı 1\'den büyük olmalı').optional(),
  duration: z.number().min(ANIME.DURATION.MIN, 'Süre 1 dakikadan fazla olmalı').optional(),
  isAdult: z.boolean(),
  season: z.nativeEnum(ANIME.SEASON).optional(),
  seasonYear: z.number().min(ANIME.YEAR.MIN, 'Yıl 1900\'den büyük olmalı').max(ANIME.YEAR.MAX, 'Yıl 2100\'den küçük olmalı').optional(),
  source: z.nativeEnum(ANIME.SOURCE).optional(),
  countryOfOrigin: z.string().optional(),
  description: z.string().optional(),
  isMultiPart: z.boolean(),
  // Görsel İçerik
  coverImage: z.string().url('Geçerli bir URL girin').optional(),
  bannerImage: z.string().url('Geçerli bir URL girin').optional(),
  trailer: z.string().url('Geçerli bir URL girin').optional(),
  // İlişkiler
  genreIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  studioIds: z.array(z.string()).optional(),
}).refine((data) => {
  // Film değilse sezon ve yıl zorunlu
  if (data.type !== 'MOVIE') {
    return data.season && data.seasonYear;
  }
  return true;
}, {
  message: 'Film dışındaki türler için sezon ve yıl zorunludur',
  path: ['season']
}).refine((data) => {
  // OVA/ONA için bölüm sayısı zorunlu
  if (data.type === 'OVA' || data.type === 'ONA') {
    return data.episodes && data.episodes > 0;
  }
  return true;
}, {
  message: 'OVA/ONA türleri için bölüm sayısı zorunludur',
  path: ['episodes']
});

// Anime serisi güncelleme şeması
export const updateAnimeSeriesSchema = z.object({
  title: z.string().min(ANIME.TITLE.MIN_LENGTH, 'Başlık gerekli').max(ANIME.TITLE.MAX_LENGTH, 'Başlık çok uzun'),
  englishTitle: z.string().optional(),
  japaneseTitle: z.string().optional(),
  synonyms: z.array(z.string()).optional(),
  type: z.nativeEnum(ANIME.TYPE),
  status: z.nativeEnum(ANIME.STATUS),
  episodes: z.number().min(1, 'Bölüm sayısı 1\'den büyük olmalı').optional(),
  duration: z.number().min(ANIME.DURATION.MIN, 'Süre 1 dakikadan fazla olmalı').optional(),
  isAdult: z.boolean(),
  season: z.nativeEnum(ANIME.SEASON).optional(),
  seasonYear: z.number().min(ANIME.YEAR.MIN, 'Yıl 1900\'den büyük olmalı').max(ANIME.YEAR.MAX, 'Yıl 2100\'den küçük olmalı').optional(),
  source: z.nativeEnum(ANIME.SOURCE).optional(),
  countryOfOrigin: z.string().optional(),
  description: z.string().optional(),
  isMultiPart: z.boolean(),
  // Görsel İçerik
  coverImage: z.string().url('Geçerli bir URL girin').optional(),
  bannerImage: z.string().url('Geçerli bir URL girin').optional(),
  trailer: z.string().url('Geçerli bir URL girin').optional(),
  // İlişkiler
  genreIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  studioIds: z.array(z.string()).optional(),
}).refine((data) => {
  // Film değilse sezon ve yıl zorunlu
  if (data.type !== 'MOVIE') {
    return data.season && data.seasonYear;
  }
  return true;
}, {
  message: 'Film dışındaki türler için sezon ve yıl zorunludur',
  path: ['season']
}).refine((data) => {
  // OVA/ONA için bölüm sayısı zorunlu
  if (data.type === 'OVA' || data.type === 'ONA') {
    return data.episodes && data.episodes > 0;
  }
  return true;
}, {
  message: 'OVA/ONA türleri için bölüm sayısı zorunludur',
  path: ['episodes']
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
export type UpdateAnimeSeriesInput = z.infer<typeof updateAnimeSeriesSchema>;
export type AnimeSeriesFilters = z.infer<typeof animeSeriesFiltersSchema>; 