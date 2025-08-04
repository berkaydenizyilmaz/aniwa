// Studio validasyon şemaları

import { z } from 'zod';
import { MASTER_DATA } from '@/lib/constants/masterData.constants';
  
// Studio oluşturma şeması
export const createStudioSchema = z.object({
  name: z.string().min(MASTER_DATA.NAME.MIN_LENGTH, 'Stüdyo adı gerekli').max(MASTER_DATA.NAME.MAX_LENGTH, 'Stüdyo adı çok uzun'),
  isAnimationStudio: z.boolean().default(true),
});

// Studio güncelleme şeması
export const updateStudioSchema = z.object({
  name: z.string().min(MASTER_DATA.NAME.MIN_LENGTH, 'Stüdyo adı gerekli').max(MASTER_DATA.NAME.MAX_LENGTH, 'Stüdyo adı çok uzun').optional(),
  isAnimationStudio: z.boolean().optional(),
});

// Studio filtreleme şeması
export const studioFiltersSchema = z.object({
  search: z.string().optional(),
  isAnimationStudio: z.boolean().optional(),
  page: z.number().min(MASTER_DATA.PAGINATION.MIN_PAGE).default(MASTER_DATA.PAGINATION.MIN_PAGE),
  limit: z.number().min(MASTER_DATA.PAGINATION.MIN_PAGE).max(MASTER_DATA.PAGINATION.MAX_LIMIT).default(MASTER_DATA.PAGINATION.DEFAULT_LIMIT),
});

// Tip türetmeleri
export type CreateStudioInput = z.infer<typeof createStudioSchema>;
export type UpdateStudioInput = z.infer<typeof updateStudioSchema>;
export type StudioFilters = z.infer<typeof studioFiltersSchema>; 