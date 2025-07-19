// FavouriteAnime validasyon şemaları

import { z } from 'zod';

// Favori anime toggle şeması
export const toggleFavouriteAnimeSchema = z.object({
  animeSeriesId: z.string().min(1, 'Anime serisi ID gerekli'),
});

// Favori anime filtreleme şeması
export const favouriteAnimeFiltersSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(50),
});

// Tip türetmeleri
export type ToggleFavouriteAnimeInput = z.infer<typeof toggleFavouriteAnimeSchema>;
export type FavouriteAnimeFilters = z.infer<typeof favouriteAnimeFiltersSchema>; 