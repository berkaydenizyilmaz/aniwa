// Tag validasyon şemaları

import { z } from 'zod';
import { TagCategory } from '@prisma/client';

// Tag oluşturma şeması
export const createTagSchema = z.object({
  name: z.string().min(1, 'Etiket adı gerekli').max(50, 'Etiket adı çok uzun'),
  description: z.string().max(200, 'Açıklama çok uzun').optional(),
  category: z.nativeEnum(TagCategory).optional(),
  isAdult: z.boolean().default(false),
  isSpoiler: z.boolean().default(false),
});

// Tag güncelleme şeması
export const updateTagSchema = z.object({
  name: z.string().min(1, 'Etiket adı gerekli').max(50, 'Etiket adı çok uzun').optional(),
  description: z.string().max(200, 'Açıklama çok uzun').optional(),
  category: z.nativeEnum(TagCategory).optional(),
  isAdult: z.boolean().optional(),
  isSpoiler: z.boolean().optional(),
});

// Tag filtreleme şeması
export const tagFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.nativeEnum(TagCategory).optional(),
  isAdult: z.boolean().optional(),
  isSpoiler: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(50),
});

// Tip türetmeleri
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
export type TagFilters = z.infer<typeof tagFiltersSchema>; 