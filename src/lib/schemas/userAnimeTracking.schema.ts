// UserAnimeTracking validasyon şemaları

import { z } from 'zod';
import { SOCIAL } from '@/lib/constants/social.constants';

// Anime takip toggle şeması
export const toggleUserAnimeTrackingSchema = z.object({
  animeSeriesId: z.string().min(1, 'Anime serisi ID gerekli'),
});

// Anime takip filtreleme şeması
export const userAnimeTrackingFiltersSchema = z.object({
  page: z.coerce.number().int().positive().default(SOCIAL.PAGINATION.MIN_PAGE),
  limit: z.coerce.number().int().positive().max(SOCIAL.PAGINATION.MAX_LIMIT).default(SOCIAL.PAGINATION.DEFAULT_LIMIT),
});

// Tip türetmeleri
export type ToggleUserAnimeTrackingInput = z.infer<typeof toggleUserAnimeTrackingSchema>;
export type UserAnimeTrackingFilters = z.infer<typeof userAnimeTrackingFiltersSchema>; 