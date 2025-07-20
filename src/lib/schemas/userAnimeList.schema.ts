// UserAnimeList validasyon şemaları

import { z } from 'zod';
import { ANIME_LIST } from '@/lib/constants/animeList.constants';

// Anime listeye ekleme şeması
export const addAnimeToListSchema = z.object({
  animeSeriesId: z.string().min(1, 'Anime serisi ID gerekli'),
  status: z.nativeEnum(ANIME_LIST.STATUS).default('PLANNING'),
  score: z.number().min(ANIME_LIST.SCORE.MIN).max(ANIME_LIST.SCORE.MAX).optional(),
  progressEpisodes: z.number().min(0).optional(),
  notes: z.string().max(ANIME_LIST.NOTES.MAX_LENGTH, 'Not çok uzun').optional(),
  private: z.boolean().default(false),
});

// Anime listesi filtreleme şeması
export const getUserAnimeListsSchema = z.object({
  page: z.number().min(ANIME_LIST.PAGINATION.MIN_PAGE).default(ANIME_LIST.PAGINATION.MIN_PAGE),
  limit: z.number().min(ANIME_LIST.PAGINATION.MIN_PAGE).max(ANIME_LIST.PAGINATION.MAX_LIMIT).default(ANIME_LIST.PAGINATION.DEFAULT_LIMIT),
});

// Tip türetmeleri
export type AddAnimeToListInput = z.infer<typeof addAnimeToListSchema>;
export type GetUserAnimeListsInput = z.infer<typeof getUserAnimeListsSchema>; 