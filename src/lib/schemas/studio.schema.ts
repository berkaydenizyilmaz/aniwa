// Studio validasyon şemaları

import { z } from 'zod';

// Studio oluşturma şeması
export const createStudioSchema = z.object({
  name: z.string().min(1, 'Stüdyo adı gerekli').max(100, 'Stüdyo adı çok uzun'),
  isAnimationStudio: z.boolean().default(true),
});

// Studio güncelleme şeması
export const updateStudioSchema = z.object({
  name: z.string().min(1, 'Stüdyo adı gerekli').max(100, 'Stüdyo adı çok uzun').optional(),
  isAnimationStudio: z.boolean().optional(),
});

// Studio filtreleme şeması
export const studioFiltersSchema = z.object({
  search: z.string().optional(),
  isAnimationStudio: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(50),
});

// Tip türetmeleri
export type CreateStudioInput = z.infer<typeof createStudioSchema>;
export type UpdateStudioInput = z.infer<typeof updateStudioSchema>;
export type StudioFilters = z.infer<typeof studioFiltersSchema>; 