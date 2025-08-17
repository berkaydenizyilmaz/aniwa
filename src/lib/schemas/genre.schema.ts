// Genre validasyon şemaları

import { z } from 'zod';
import { baseNameSchema, baseFiltersSchema } from './shared/base';

// Genre oluşturma şeması
export const createGenreSchema = z.object({
  name: baseNameSchema,
});

// Genre güncelleme şeması
export const updateGenreSchema = z.object({
  name: baseNameSchema,
});

// Genre filtreleme şeması
export const genreFiltersSchema = baseFiltersSchema;

// Tip türetmeleri
export type CreateGenreInput = z.infer<typeof createGenreSchema>;
export type UpdateGenreInput = z.infer<typeof updateGenreSchema>;
export type GenreFilters = z.infer<typeof genreFiltersSchema>; 