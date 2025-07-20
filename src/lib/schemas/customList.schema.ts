// CustomList validasyon şemaları

import { z } from 'zod';
import { LIST } from '@/lib/constants/list.constants';

// Özel liste oluşturma şeması
export const createCustomListSchema = z.object({
  name: z.string().min(LIST.NAME.MIN_LENGTH, 'Liste adı gerekli').max(LIST.NAME.MAX_LENGTH, 'Liste adı çok uzun'),
  description: z.string().max(LIST.DESCRIPTION.MAX_LENGTH, 'Açıklama çok uzun').optional(),
  isPublic: z.boolean().default(true),
});

// Özel liste güncelleme şeması
export const updateCustomListSchema = z.object({
  name: z.string().min(LIST.NAME.MIN_LENGTH, 'Liste adı gerekli').max(LIST.NAME.MAX_LENGTH, 'Liste adı çok uzun').optional(),
  description: z.string().max(LIST.DESCRIPTION.MAX_LENGTH, 'Açıklama çok uzun').optional(),
  isPublic: z.boolean().optional(),
});

// Özel liste filtreleme şeması
export const customListFiltersSchema = z.object({
  page: z.number().min(LIST.PAGINATION.MIN_PAGE).default(LIST.PAGINATION.MIN_PAGE),
  limit: z.number().min(LIST.PAGINATION.MIN_PAGE).max(LIST.PAGINATION.MAX_LIMIT).default(LIST.PAGINATION.DEFAULT_LIMIT),
});

// Tip türetmeleri
export type CreateCustomListInput = z.infer<typeof createCustomListSchema>;
export type UpdateCustomListInput = z.infer<typeof updateCustomListSchema>;
export type CustomListFilters = z.infer<typeof customListFiltersSchema>; 