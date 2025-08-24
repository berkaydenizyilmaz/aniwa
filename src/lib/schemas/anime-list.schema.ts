// Anime listeleme validasyon şemaları

import { z } from 'zod';
import { AnimeType, AnimeStatus, Season, Source, CountryOfOrigin } from '@prisma/client';
import { ANIME_DOMAIN } from '@/lib/constants/domains/anime';

// Anime listeleme filtreleri şeması
export const animeListFiltersSchema = z.object({
  // Temel filtreler
  search: z.string().optional(),
  genre: z.string().optional(),
  year: z.number().min(ANIME_DOMAIN.VALIDATION.YEAR.MIN).max(ANIME_DOMAIN.VALIDATION.YEAR.MAX).optional(),
  season: z.nativeEnum(Season).optional(),
  format: z.nativeEnum(AnimeType).optional(),
  
  // Ayrıntılı filtreler
  status: z.nativeEnum(AnimeStatus).optional(),
  country: z.nativeEnum(CountryOfOrigin).optional(),
  source: z.nativeEnum(Source).optional(),
  yearFrom: z.number().min(ANIME_DOMAIN.VALIDATION.YEAR.MIN).max(ANIME_DOMAIN.VALIDATION.YEAR.MAX).optional(),
  yearTo: z.number().min(ANIME_DOMAIN.VALIDATION.YEAR.MIN).max(ANIME_DOMAIN.VALIDATION.YEAR.MAX).optional(),
  episodesFrom: z.number().min(1).max(9999).optional(),
  episodesTo: z.number().min(1).max(9999).optional(),
  durationFrom: z.number().min(1).max(1000).optional(),
  durationTo: z.number().min(1).max(1000).optional(),
  showAdult: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  
  // Sıralama
  sortBy: z.enum(['popularity', 'anilistAverageScore', 'createdAt', 'title']).default('popularity'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  
  // Sayfalama
  page: z.number().min(ANIME_DOMAIN.PAGINATION.MIN_PAGE).default(ANIME_DOMAIN.PAGINATION.MIN_PAGE),
  limit: z.number().min(1).max(ANIME_DOMAIN.PAGINATION.MAX_LIMIT).default(ANIME_DOMAIN.PAGINATION.DEFAULT_LIMIT),
});

// Anime listeleme isteği şeması (infinite scroll için)
export const animeListRequestSchema = z.object({
  // Cursor-based pagination için
  cursor: z.string().optional(),
  
  // Filtreler
  filters: animeListFiltersSchema.optional(),
});

// Tip türetmeleri
export type AnimeListFilters = z.infer<typeof animeListFiltersSchema>;
export type AnimeListRequest = z.infer<typeof animeListRequestSchema>;
