// Tag validasyon şemaları

import { z } from 'zod';
import { TagCategory } from '@prisma/client';
import { baseNameSchema, baseDescriptionSchema, baseFiltersSchema } from './shared/base';

// Tag oluşturma şeması
export const createTagSchema = z.object({
  name: baseNameSchema,
  description: baseDescriptionSchema,
  category: z.nativeEnum(TagCategory).optional(),
  isAdult: z.boolean(),
  isSpoiler: z.boolean(),
});

// Tag güncelleme şeması
export const updateTagSchema = z.object({
  name: baseNameSchema.optional(),
  description: baseDescriptionSchema,
  category: z.nativeEnum(TagCategory).optional(),
  isAdult: z.boolean().optional(),
  isSpoiler: z.boolean().optional(),
});

// Tag filtreleme şeması
export const tagFiltersSchema = baseFiltersSchema.extend({
  category: z.nativeEnum(TagCategory).optional(),
  isAdult: z.boolean().optional(),
  isSpoiler: z.boolean().optional(),
});

// Tip türetmeleri
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
export type TagFilters = z.infer<typeof tagFiltersSchema>; 