// Comment ve CommentLike Zod validasyon şemaları

import { z } from 'zod';
import { COMMENT } from '@/lib/constants/comment.constants';

// Yorum oluşturma şeması
export const createCommentSchema = z.object({
  content: z.string()
    .min(COMMENT.CONTENT.MIN_LENGTH, 'Yorum içeriği boş olamaz')
    .max(COMMENT.CONTENT.MAX_LENGTH, 'Yorum içeriği 1000 karakterden uzun olamaz'),
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
    .min(COMMENT.CONTENT.MIN_LENGTH, 'Yorum içeriği boş olamaz')
    .max(COMMENT.CONTENT.MAX_LENGTH, 'Yorum içeriği 1000 karakterden uzun olamaz'),
});

// Yorum listeleme filtreleri şeması
export const getUserCommentsSchema = z.object({
  page: z.coerce.number().int().positive().default(COMMENT.PAGINATION.MIN_PAGE),
  limit: z.coerce.number().int().positive().max(COMMENT.PAGINATION.MAX_LIMIT).default(COMMENT.PAGINATION.DEFAULT_LIMIT),
});

// Anime yorumları filtreleri şeması
export const getAnimeCommentsSchema = z.object({
  page: z.coerce.number().int().positive().default(COMMENT.PAGINATION.MIN_PAGE),
  limit: z.coerce.number().int().positive().max(COMMENT.PAGINATION.MAX_LIMIT).default(COMMENT.PAGINATION.DEFAULT_LIMIT),
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