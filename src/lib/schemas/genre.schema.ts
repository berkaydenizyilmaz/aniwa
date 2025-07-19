// Genre validasyon şemaları

import { z } from 'zod';

// Genre oluşturma şeması
export const createGenreSchema = z.object({
  name: z.string().min(1, 'Tür adı gerekli').max(50, 'Tür adı çok uzun'),
});

// Genre güncelleme şeması
export const updateGenreSchema = z.object({
  name: z.string().min(1, 'Tür adı gerekli').max(50, 'Tür adı çok uzun').optional(),
});

// Genre filtreleme şeması
export const genreFiltersSchema = z.object({
  search: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(50),
});

// Tip türetmeleri
export type CreateGenreInput = z.infer<typeof createGenreSchema>;
export type UpdateGenreInput = z.infer<typeof updateGenreSchema>;
export type GenreFilters = z.infer<typeof genreFiltersSchema>; 