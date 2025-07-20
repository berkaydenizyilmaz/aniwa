// UserFollow Zod validasyon şemaları

import { z } from 'zod';
import { SOCIAL } from '@/lib/constants/social.constants';

// Kullanıcı takip toggle şeması
export const toggleUserFollowSchema = z.object({
  followingId: z.string().min(1, 'Takip edilecek kullanıcı ID gerekli'),
});

// Takipçi listeleme filtreleri şeması
export const getUserFollowersSchema = z.object({
  page: z.coerce.number().int().positive().default(SOCIAL.PAGINATION.MIN_PAGE),
  limit: z.coerce.number().int().positive().max(SOCIAL.PAGINATION.MAX_LIMIT).default(SOCIAL.PAGINATION.DEFAULT_LIMIT),
});

// Takip edilen listeleme filtreleri şeması
export const getUserFollowingSchema = z.object({
  page: z.coerce.number().int().positive().default(SOCIAL.PAGINATION.MIN_PAGE),
  limit: z.coerce.number().int().positive().max(SOCIAL.PAGINATION.MAX_LIMIT).default(SOCIAL.PAGINATION.DEFAULT_LIMIT),
});

// Takip durumu kontrolü şeması
export const checkFollowStatusSchema = z.object({
  followingId: z.string().min(1, 'Takip edilecek kullanıcı ID gerekli'),
});

// Schema tiplerini export et
export type ToggleUserFollowInput = z.infer<typeof toggleUserFollowSchema>;
export type GetUserFollowersInput = z.infer<typeof getUserFollowersSchema>;
export type GetUserFollowingInput = z.infer<typeof getUserFollowingSchema>;
export type CheckFollowStatusInput = z.infer<typeof checkFollowStatusSchema>; 