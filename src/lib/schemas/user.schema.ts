// User validasyon şemaları

import { z } from 'zod';
import { USER } from '@/lib/constants/user.constants';
import { AUTH } from '@/lib/constants/auth.constants';
import { UserRole } from '@prisma/client';

// User filtreleme şeması
export const userFiltersSchema = z.object({
  search: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  isBanned: z.boolean().optional(),
  page: z.number().min(USER.PAGINATION.MIN_PAGE).default(USER.PAGINATION.MIN_PAGE),
  limit: z.number().min(USER.PAGINATION.MIN_PAGE).max(USER.PAGINATION.MAX_LIMIT).default(USER.PAGINATION.DEFAULT_LIMIT),
});

// User güncelleme şeması
export const updateUserSchema = z.object({
  username: z.string().min(AUTH.USERNAME.MIN_LENGTH, 'Kullanıcı adı gerekli').max(AUTH.USERNAME.MAX_LENGTH, 'Kullanıcı adı çok uzun').optional(),
  email: z.string().email('Geçerli bir e-posta adresi girin').optional(),
  roles: z.array(z.nativeEnum(UserRole)).optional(),
  isBanned: z.boolean().optional(),
});

// Tip türetmeleri
export type UserFilters = z.infer<typeof userFiltersSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>; 