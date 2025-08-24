// Anime listeleme validation şemaları

import { z } from 'zod';
import { Season, AnimeType, AnimeStatus } from '@prisma/client';
import { ANIME_DOMAIN } from '@/lib/constants/domains/anime';

// Anime listeleme filtreleri şeması
export const animeListFiltersSchema = z.object({
  genres: z.array(z.string()).optional(),
  studios: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  year: z.number().min(ANIME_DOMAIN.VALIDATION.YEAR.MIN).max(ANIME_DOMAIN.VALIDATION.YEAR.MAX).optional(),
  season: z.nativeEnum(Season).optional(),
  type: z.nativeEnum(AnimeType).optional(),
  status: z.nativeEnum(AnimeStatus).optional(),
  isAdult: z.boolean().optional(),
  sortBy: z.enum(['popularity', 'anilistAverageScore', 'createdAt', 'title']).default(ANIME_DOMAIN.LIST.SORT.DEFAULT),
  sortOrder: z.enum(['asc', 'desc']).default(ANIME_DOMAIN.LIST.SORT.DEFAULT_ORDER),
  page: z.number().min(1).default(ANIME_DOMAIN.LIST.PAGINATION.DEFAULT_PAGE),
  limit: z.number().min(ANIME_DOMAIN.LIST.PAGINATION.MIN_LIMIT).max(ANIME_DOMAIN.LIST.PAGINATION.MAX_LIMIT).default(ANIME_DOMAIN.LIST.PAGINATION.DEFAULT_LIMIT)
});

// Anime ID şeması
export const animeIdSchema = z.object({
  animeId: z.string().min(1, 'Anime ID gerekli')
});

// Filtre verileri şeması
export const filterDataSchema = z.object({
  includeCounts: z.boolean().default(true)
});

// Anime ilişkili veriler şeması
export const animeRelationsSchema = z.object({
  animeId: z.string().min(1, 'Anime ID gerekli'),
  includeGenres: z.boolean().default(true),
  includeStudios: z.boolean().default(true),
  includeTags: z.boolean().default(true)
});

// Tip tanımları
export type AnimeListFiltersInput = z.infer<typeof animeListFiltersSchema>;
export type AnimeIdInput = z.infer<typeof animeIdSchema>;
export type FilterDataInput = z.infer<typeof filterDataSchema>;
export type AnimeRelationsInput = z.infer<typeof animeRelationsSchema>;
