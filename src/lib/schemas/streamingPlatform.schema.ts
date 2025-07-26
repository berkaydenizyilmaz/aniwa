// StreamingPlatform validasyon şemaları

import { z } from 'zod';
import { STREAMING } from '@/lib/constants/streaming.constants';

// Platform oluşturma şeması
export const createStreamingPlatformSchema = z.object({
  name: z.string().min(STREAMING.PLATFORM.NAME.MIN_LENGTH, 'Platform adı gerekli').max(STREAMING.PLATFORM.NAME.MAX_LENGTH, 'Platform adı çok uzun'),
  baseUrl: z.string().url('Geçerli bir URL girin').max(STREAMING.PLATFORM.BASE_URL.MAX_LENGTH, 'URL çok uzun'),
});

// Platform güncelleme şeması
export const updateStreamingPlatformSchema = z.object({
  name: z.string().min(STREAMING.PLATFORM.NAME.MIN_LENGTH, 'Platform adı gerekli').max(STREAMING.PLATFORM.NAME.MAX_LENGTH, 'Platform adı çok uzun').optional(),
  baseUrl: z.string().url('Geçerli bir URL girin').max(STREAMING.PLATFORM.BASE_URL.MAX_LENGTH, 'URL çok uzun').optional(),
});

// Platform filtreleme şeması
export const streamingPlatformFiltersSchema = z.object({
  search: z.string().optional(),
  page: z.number().min(STREAMING.PAGINATION.MIN_PAGE).default(STREAMING.PAGINATION.MIN_PAGE),
  limit: z.number().min(STREAMING.PAGINATION.MIN_PAGE).max(STREAMING.PAGINATION.MAX_LIMIT).default(STREAMING.PAGINATION.DEFAULT_LIMIT),
});

// Tip türetmeleri
export type CreateStreamingPlatformInput = z.infer<typeof createStreamingPlatformSchema>;
export type UpdateStreamingPlatformInput = z.infer<typeof updateStreamingPlatformSchema>;
export type StreamingPlatformFilters = z.infer<typeof streamingPlatformFiltersSchema>; 