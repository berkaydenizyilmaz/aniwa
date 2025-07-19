// UserAnimeList validasyon şemaları

import { z } from 'zod';
import { MediaListStatus } from '@prisma/client';

// Anime listeye ekleme şeması
export const addAnimeToListSchema = z.object({
  animeSeriesId: z.string().min(1, 'Anime serisi ID gerekli'),
  status: z.nativeEnum(MediaListStatus).default('PLANNING'),
  score: z.number().min(0).max(10).optional(),
  progressEpisodes: z.number().min(0).optional(),
  notes: z.string().max(1000, 'Not çok uzun').optional(),
  private: z.boolean().default(false),
});

// Anime listesi filtreleme şeması
export const getUserAnimeListsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(50),
});

// Tip türetmeleri
export type AddAnimeToListInput = z.infer<typeof addAnimeToListSchema>;
export type GetUserAnimeListsInput = z.infer<typeof getUserAnimeListsSchema>; 