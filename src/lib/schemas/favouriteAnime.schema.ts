// FavouriteAnime validasyon şemaları

import { z } from 'zod';
import { ANIME_LIST } from '@/lib/constants/animeList.constants';

// Favori anime toggle şeması
export const toggleFavouriteAnimeSchema = z.object({
  animeSeriesId: z.string().min(1, 'Anime serisi ID gerekli'),
});

// Favori anime filtreleme şeması
export const favouriteAnimeFiltersSchema = z.object({
  page: z.number().min(ANIME_LIST.PAGINATION.MIN_PAGE).default(ANIME_LIST.PAGINATION.MIN_PAGE),
  limit: z.number().min(ANIME_LIST.PAGINATION.MIN_PAGE).max(ANIME_LIST.PAGINATION.MAX_LIMIT).default(ANIME_LIST.PAGINATION.DEFAULT_LIMIT),
});

// Tip türetmeleri
export type ToggleFavouriteAnimeInput = z.infer<typeof toggleFavouriteAnimeSchema>;
export type FavouriteAnimeFilters = z.infer<typeof favouriteAnimeFiltersSchema>; 