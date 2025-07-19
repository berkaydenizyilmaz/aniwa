// CustomList validasyon şemaları

import { z } from 'zod';

// Özel liste oluşturma şeması
export const createCustomListSchema = z.object({
  name: z.string().min(1, 'Liste adı gerekli').max(100, 'Liste adı çok uzun'),
  description: z.string().max(500, 'Açıklama çok uzun').optional(),
  isPublic: z.boolean().default(true),
});

// Özel liste güncelleme şeması
export const updateCustomListSchema = z.object({
  name: z.string().min(1, 'Liste adı gerekli').max(100, 'Liste adı çok uzun').optional(),
  description: z.string().max(500, 'Açıklama çok uzun').optional(),
  isPublic: z.boolean().optional(),
});

// Özel liste filtreleme şeması
export const customListFiltersSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(50),
});

// Tip türetmeleri
export type CreateCustomListInput = z.infer<typeof createCustomListSchema>;
export type UpdateCustomListInput = z.infer<typeof updateCustomListSchema>;
export type CustomListFilters = z.infer<typeof customListFiltersSchema>; 