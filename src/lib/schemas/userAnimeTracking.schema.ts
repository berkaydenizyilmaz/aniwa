// UserAnimeTracking validasyon şemaları

import { z } from 'zod';

// Anime takip toggle şeması
export const toggleUserAnimeTrackingSchema = z.object({
  animeSeriesId: z.string().min(1, 'Anime serisi ID gerekli'),
});

// Anime takip filtreleme şeması
export const userAnimeTrackingFiltersSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
});

// Tip türetmeleri
export type ToggleUserAnimeTrackingInput = z.infer<typeof toggleUserAnimeTrackingSchema>;
export type UserAnimeTrackingFilters = z.infer<typeof userAnimeTrackingFiltersSchema>; 