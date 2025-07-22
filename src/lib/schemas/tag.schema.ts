// Tag validasyon şemaları

import { z } from 'zod';
import { MASTER_DATA } from '@/lib/constants/masterData.constants';

// Tag oluşturma şeması
export const createTagSchema = z.object({
  name: z.string().min(MASTER_DATA.NAME.MIN_LENGTH, 'Etiket adı gerekli').max(MASTER_DATA.NAME.MAX_LENGTH, 'Etiket adı çok uzun'),
  description: z.string().max(MASTER_DATA.DESCRIPTION.MAX_LENGTH, 'Açıklama çok uzun').optional(),
  category: z.nativeEnum(MASTER_DATA.TAG_CATEGORY).optional(),
  isAdult: z.boolean(),
  isSpoiler: z.boolean(),
});

// Tag güncelleme şeması
export const updateTagSchema = z.object({
  name: z.string().min(MASTER_DATA.NAME.MIN_LENGTH, 'Etiket adı gerekli').max(MASTER_DATA.NAME.MAX_LENGTH, 'Etiket adı çok uzun').optional(),
  description: z.string().max(MASTER_DATA.DESCRIPTION.MAX_LENGTH, 'Açıklama çok uzun').optional(),
  category: z.nativeEnum(MASTER_DATA.TAG_CATEGORY).optional(),
  isAdult: z.boolean().optional(),
  isSpoiler: z.boolean().optional(),
});

// Tag filtreleme şeması
export const tagFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.nativeEnum(MASTER_DATA.TAG_CATEGORY).optional(),
  isAdult: z.boolean().optional(),
  isSpoiler: z.boolean().optional(),
  page: z.number().min(MASTER_DATA.PAGINATION.MIN_PAGE).default(MASTER_DATA.PAGINATION.MIN_PAGE),
  limit: z.number().min(MASTER_DATA.PAGINATION.MIN_PAGE).max(MASTER_DATA.PAGINATION.MAX_LIMIT).default(MASTER_DATA.PAGINATION.DEFAULT_LIMIT),
});

// Tip türetmeleri
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
export type TagFilters = z.infer<typeof tagFiltersSchema>; 