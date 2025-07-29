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
  
  // duration ve anilistId alanları için preprocess kullan
  duration: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number()
      .int("Süre tam sayı olmalı.")
      .min(1, 'Süre en az 1 dakika olmalı.')
      .optional()
  ),
  anilistId: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number()
      .int("Anilist ID tam sayı olmalı.")
      .positive('Anilist ID pozitif bir sayı olmalı.')
      .optional()
  ),
  
  // Sezon bilgileri
  season: z.nativeEnum(Season, { message: 'Sezon seçiniz' }).optional(),
  seasonYear: z.number().min(1900, 'Yıl 1900-2100 arasında olmalı').max(2100, 'Yıl 1900-2100 arasında olmalı').optional(),
  releaseDate: z.date().optional(),
  
  // Kaynak ve ülke
  source: z.nativeEnum(Source, { message: 'Kaynak materyal seçiniz' }).optional(),
  countryOfOrigin: z.nativeEnum(CountryOfOrigin, { message: 'Köken ülke seçiniz' }).optional(),
  
  // MAL ID
  malId: z.number().positive('MAL ID pozitif bir sayı olmalı').optional(),
  
  // Puanlama
  anilistAverageScore: z.number().min(0, 'Puan 0-100 arasında olmalı').max(100, 'Puan 0-100 arasında olmalı').optional(),
  anilistPopularity: z.number().min(0, 'Popülerlik 0\'dan büyük olmalı').optional(),
  
  // Görsel içerik
  trailer: z.string().url('Geçerli bir URL girin').optional(),
  coverImage: z.string().optional(), // Mevcut resim URL'i
  bannerImage: z.string().optional(), // Mevcut resim URL'i
  coverImageFile: z.any().optional(), // File objesi
  bannerImageFile: z.any().optional(), // File objesi
  
  // İlişkili veriler - Formdan string array olarak gelir
  genreIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  studioIds: z.array(z.string()).optional(),
}).superRefine((data, ctx) => {
  // isMultiPart false (yani tek parçalı) ise duration zorunlu
  if (!data.isMultiPart) {
    if (data.duration === null || data.duration === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Tek parçalı anime için süre zorunludur.',
        path: ['duration'],
      });
    }
    if (data.anilistId === null || data.anilistId === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Tek parçalı anime için Anilist ID zorunludur.',
        path: ['anilistId'],
      });
    }
  }
  // Çok parçalı ise episodes ve duration undefined olmalı
  if (data.isMultiPart && (data.episodes !== undefined || data.duration !== undefined)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Çok parçalı anime için bölüm sayısı ve süre otomatik hesaplanır.',
      path: ['episodes'],
    });
  }
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