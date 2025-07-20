// Comment ve CommentLike Zod validasyon şemaları

import { z } from 'zod';

// Yorum oluşturma şeması
export const createCommentSchema = z.object({
  content: z.string()
    .min(1, 'Yorum içeriği boş olamaz')
    .max(1000, 'Yorum içeriği 1000 karakterden uzun olamaz'),
  animeSeriesId: z.string().optional(),
  animeMediaPartId: z.string().optional(),
}).refine(
  (data) => data.animeSeriesId || data.animeMediaPartId,
  {
    message: 'Anime serisi veya medya parçası ID\'si gerekli',
    path: ['animeSeriesId'],
  }
);

// Yorum güncelleme şeması
export const updateCommentSchema = z.object({
  content: z.string()
    .min(1, 'Yorum içeriği boş olamaz')
    .max(1000, 'Yorum içeriği 1000 karakterden uzun olamaz'),
});

// Yorum listeleme filtreleri şeması
export const getUserCommentsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
});

// Anime yorumları filtreleri şeması
export const getAnimeCommentsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
});

// Yorum beğenisi toggle şeması
export const toggleCommentLikeSchema = z.object({
  commentId: z.string().min(1, 'Yorum ID gerekli'),
});

// Schema tiplerini export et
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type GetUserCommentsInput = z.infer<typeof getUserCommentsSchema>;
export type GetAnimeCommentsInput = z.infer<typeof getAnimeCommentsSchema>;
export type ToggleCommentLikeInput = z.infer<typeof toggleCommentLikeSchema>; 