// User validasyon şemaları

import { z } from 'zod';
import { UserRole } from '@prisma/client';
import { USER_DOMAIN } from '@/lib/constants/domains/user';
import { AUTH_DOMAIN } from '@/lib/constants/domains/auth';
import { baseFiltersSchema } from './shared/base';

// User filtreleme şeması
export const userFiltersSchema = baseFiltersSchema.extend({
  role: z.nativeEnum(UserRole).optional(),
  isBanned: z.boolean().optional(),
});

// User güncelleme şeması
export const updateUserSchema = z.object({
  username: z.string().min(AUTH_DOMAIN.VALIDATION.USERNAME.MIN_LENGTH, 'Kullanıcı adı gerekli').max(AUTH_DOMAIN.VALIDATION.USERNAME.MAX_LENGTH, 'Kullanıcı adı çok uzun').optional(),
  email: z.string().email('Geçerli bir e-posta adresi girin').optional(),
  roles: z.array(z.nativeEnum(UserRole)).optional(),
  isBanned: z.boolean().optional(),
});

// Tip türetmeleri
export type UserFilters = z.infer<typeof userFiltersSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>; 