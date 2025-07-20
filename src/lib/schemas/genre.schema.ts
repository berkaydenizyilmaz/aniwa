// Genre validasyon şemaları

import { z } from 'zod';
import { MASTER_DATA } from '@/lib/constants/masterData.constants';

// Genre oluşturma şeması
export const createGenreSchema = z.object({
  name: z.string().min(MASTER_DATA.NAME.MIN_LENGTH, 'Tür adı gerekli').max(MASTER_DATA.NAME.MAX_LENGTH, 'Tür adı çok uzun'),
});

// Genre güncelleme şeması
export const updateGenreSchema = z.object({
  name: z.string().min(MASTER_DATA.NAME.MIN_LENGTH, 'Tür adı gerekli').max(MASTER_DATA.NAME.MAX_LENGTH, 'Tür adı çok uzun').optional(),
});

// Genre filtreleme şeması
export const genreFiltersSchema = z.object({
  search: z.string().optional(),
  page: z.number().min(MASTER_DATA.PAGINATION.MIN_PAGE).default(MASTER_DATA.PAGINATION.MIN_PAGE),
  limit: z.number().min(MASTER_DATA.PAGINATION.MIN_PAGE).max(MASTER_DATA.PAGINATION.MAX_LIMIT).default(MASTER_DATA.PAGINATION.DEFAULT_LIMIT),
});

// Tip türetmeleri
export type CreateGenreInput = z.infer<typeof createGenreSchema>;
export type UpdateGenreInput = z.infer<typeof updateGenreSchema>;
export type GenreFilters = z.infer<typeof genreFiltersSchema>; 