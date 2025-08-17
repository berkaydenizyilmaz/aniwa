// Studio validasyon şemaları

import { z } from 'zod';
import { baseNameSchema, baseFiltersSchema } from './shared/base';
  
// Studio oluşturma şeması
export const createStudioSchema = z.object({
  name: baseNameSchema,
  isAnimationStudio: z.boolean().default(true),
});

// Studio güncelleme şeması
export const updateStudioSchema = z.object({
  name: baseNameSchema.optional(),
  isAnimationStudio: z.boolean().optional(),
});

// Studio filtreleme şeması
export const studioFiltersSchema = baseFiltersSchema.extend({
  isAnimationStudio: z.boolean().optional(),
});

// Tip türetmeleri
export type CreateStudioInput = z.infer<typeof createStudioSchema>;
export type UpdateStudioInput = z.infer<typeof updateStudioSchema>;
export type StudioFilters = z.infer<typeof studioFiltersSchema>; 