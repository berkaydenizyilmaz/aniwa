// User validasyon şemaları

import { z } from 'zod';
import { UserRole } from '@prisma/client';

// User filtreleme şeması
export const userFiltersSchema = z.object({
  search: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  isBanned: z.boolean().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(50),
});

// User güncelleme şeması
export const updateUserSchema = z.object({
  username: z.string().min(1, 'Kullanıcı adı gerekli').max(50, 'Kullanıcı adı çok uzun').optional(),
  email: z.string().email('Geçerli bir e-posta adresi girin').optional(),
  roles: z.array(z.nativeEnum(UserRole)).optional(),
  isBanned: z.boolean().optional(),
});

// Tip türetmeleri
export type UserFilters = z.infer<typeof userFiltersSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>; 