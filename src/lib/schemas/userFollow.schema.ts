// UserFollow Zod validasyon şemaları

import { z } from 'zod';

// Kullanıcı takip toggle şeması
export const toggleUserFollowSchema = z.object({
  followingId: z.string().min(1, 'Takip edilecek kullanıcı ID gerekli'),
});

// Takipçi listeleme filtreleri şeması
export const getUserFollowersSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
});

// Takip edilen listeleme filtreleri şeması
export const getUserFollowingSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
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