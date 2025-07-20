// Comment ve CommentLike API response tipleri

import { Comment, CommentLike } from '@prisma/client';
import { 
  CreateCommentInput, 
  UpdateCommentInput, 
  GetUserCommentsInput, 
  GetAnimeCommentsInput, 
  ToggleCommentLikeInput 
} from '@/lib/schemas/comment.schema';

export type CreateCommentRequest = CreateCommentInput;
export type UpdateCommentRequest = UpdateCommentInput;
export type GetUserCommentsRequest = GetUserCommentsInput;
export type GetAnimeCommentsRequest = GetAnimeCommentsInput;
export type ToggleCommentLikeRequest = ToggleCommentLikeInput;

// Prisma Comment tipini direkt kullan (küçük model)
export type CreateCommentResponse = Comment;
export type UpdateCommentResponse = Comment;
export type DeleteCommentResponse = void;

// Toggle response tipi
export interface ToggleCommentLikeResponse {
  action: 'added' | 'removed';
  like: CommentLike;
}

// Sayfalama response tipleri
export interface GetUserCommentsResponse {
  comments: Comment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetAnimeCommentsResponse {
  comments: Comment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 