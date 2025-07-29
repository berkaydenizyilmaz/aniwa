import { z } from 'zod';
import { AnimeType, AnimeStatus, Season, Source, CountryOfOrigin } from '@prisma/client';

// İlk adım: Anime tipi seçimi
export const selectAnimeTypeSchema = z.object({
  type: z.nativeEnum(AnimeType),
});

// Anime serisi oluşturma şeması (backend'e uygun)
export const createAnimeSeriesSchema = z.object({
  // Temel bilgiler
  title: z.string().min(1, 'Başlık zorunludur').max(255, 'Başlık çok uzun'),
  englishTitle: z.string().max(255, 'İngilizce başlık çok uzun').optional(),
  japaneseTitle: z.string().max(255, 'Japonca başlık çok uzun').optional(),
  synonyms: z.array(z.string()).optional(), // Veritabanına uygun: String[]
  synopsis: z.string().max(2000, 'Açıklama çok uzun').optional(),
  
  // Tip ve durum
  type: z.nativeEnum(AnimeType, { message: 'Anime tipi seçiniz' }),
  status: z.nativeEnum(AnimeStatus, { message: 'Yayın durumu seçiniz' }),
  isAdult: z.boolean(),
  isMultiPart: z.boolean(),
  
  // Bölüm bilgileri (tek parçalı için)
  episodes: z.number().min(1, 'Bölüm sayısı en az 1 olmalı').optional(),
  duration: z.number().min(1, 'Süre en az 1 dakika olmalı').optional(),
  
  // Sezon bilgileri
  season: z.nativeEnum(Season, { message: 'Sezon seçiniz' }).optional(),
  seasonYear: z.number().min(1900, 'Yıl 1900-2100 arasında olmalı').max(2100, 'Yıl 1900-2100 arasında olmalı').optional(),
  releaseDate: z.date().optional(),
  
  // Kaynak ve ülke
  source: z.nativeEnum(Source, { message: 'Kaynak materyal seçiniz' }).optional(),
  countryOfOrigin: z.nativeEnum(CountryOfOrigin, { message: 'Köken ülke seçiniz' }).optional(),
  
  // Harici ID'ler
  anilistId: z.number().positive('Anilist ID pozitif bir sayı olmalı').optional(),
  malId: z.number().positive('MAL ID pozitif bir sayı olmalı').optional(),
  
  // Puanlama
  anilistAverageScore: z.number().min(0, 'Puan 0-100 arasında olmalı').max(100, 'Puan 0-100 arasında olmalı').optional(),
  anilistPopularity: z.number().min(0, 'Popülerlik 0\'dan büyük olmalı').optional(),
  
  // Görsel içerik
  trailer: z.string().url('Geçerli bir URL girin').optional(),
  coverImage: z.string().optional(), // Mevcut resim URL'i
  bannerImage: z.string().optional(), // Mevcut resim URL'i
  coverImageFile: z.string().optional(), // Base64 dosya
  bannerImageFile: z.string().optional(), // Base64 dosya
  
  // İlişkili veriler
  genreIds: z.array(z.number()).optional(),
  tagIds: z.array(z.number()).optional(),
  studioIds: z.array(z.number()).optional(),
}).refine((data) => {
  // Tek parçalı için anilistId zorunlu
  if (!data.isMultiPart && !data.anilistId) {
    return false;
  }
  return true;
}, {
  message: 'Tek parçalı anime için Anilist ID zorunludur',
  path: ['anilistId'],
}).refine((data) => {
  // Tek parçalı için duration zorunlu
  if (!data.isMultiPart && !data.duration) {
    return false;
  }
  return true;
}, {
  message: 'Tek parçalı anime için süre zorunludur',
  path: ['duration'],
}).refine((data) => {
  // Çok parçalı ise episodes ve duration undefined olmalı
  if (data.isMultiPart && (data.episodes !== undefined || data.duration !== undefined)) {
    return false;
  }
  return true;
}, {
  message: 'Çok parçalı anime için bölüm sayısı ve süre otomatik hesaplanır',
  path: ['episodes'],
});

// Anime serisi güncelleme şeması
export const updateAnimeSeriesSchema = createAnimeSeriesSchema.partial().extend({
  id: z.string(),
});

// Anime serisi filtreleme şeması
export const getAnimeSeriesSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  type: z.nativeEnum(AnimeType).optional(),
  status: z.nativeEnum(AnimeStatus).optional(),
  season: z.nativeEnum(Season).optional(),
  seasonYear: z.number().optional(),
  source: z.nativeEnum(Source).optional(),
  countryOfOrigin: z.nativeEnum(CountryOfOrigin).optional(),
});

// Tip tanımları
export type SelectAnimeTypeRequest = z.infer<typeof selectAnimeTypeSchema>;
export type CreateAnimeSeriesRequest = z.infer<typeof createAnimeSeriesSchema>;
export type UpdateAnimeSeriesRequest = z.infer<typeof updateAnimeSeriesSchema>;
export type GetAnimeSeriesRequest = z.infer<typeof getAnimeSeriesSchema>; 