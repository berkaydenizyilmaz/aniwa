// StreamingLink validasyon şemaları

import { z } from 'zod';
import { STREAMING } from '@/lib/constants/streaming.constants';

// Link oluşturma şeması
export const createStreamingLinkSchema = z.object({
  platformId: z.string().min(1, 'Platform ID gerekli'),
  url: z.string().url('Geçerli bir URL girin').max(STREAMING.LINK.URL.MAX_LENGTH, 'URL çok uzun'),
  animeSeriesId: z.string().optional(),
  animeMediaPartId: z.string().optional(),
  episodeId: z.string().optional(),
}).refine(
  (data) => {
    const hasTarget = data.animeSeriesId || data.animeMediaPartId || data.episodeId;
    return hasTarget && [data.animeSeriesId, data.animeMediaPartId, data.episodeId].filter(Boolean).length === 1;
  },
  {
    message: 'Tam olarak bir hedef (anime serisi, medya parçası veya bölüm) seçilmeli',
    path: ['animeSeriesId', 'animeMediaPartId', 'episodeId']
  }
);

// Link güncelleme şeması
export const updateStreamingLinkSchema = z.object({
  platformId: z.string().min(1, 'Platform ID gerekli').optional(),
  url: z.string().url('Geçerli bir URL girin').max(STREAMING.LINK.URL.MAX_LENGTH, 'URL çok uzun').optional(),
  animeSeriesId: z.string().optional(),
  animeMediaPartId: z.string().optional(),
  episodeId: z.string().optional(),
});

// Link filtreleme şeması
export const streamingLinkFiltersSchema = z.object({
  platformId: z.string().optional(),
  animeSeriesId: z.string().optional(),
  animeMediaPartId: z.string().optional(),
  episodeId: z.string().optional(),
  page: z.number().min(STREAMING.PAGINATION.MIN_PAGE).default(STREAMING.PAGINATION.MIN_PAGE),
  limit: z.number().min(STREAMING.PAGINATION.MIN_PAGE).max(STREAMING.PAGINATION.MAX_LIMIT).default(STREAMING.PAGINATION.DEFAULT_LIMIT),
});

// Toplu link güncelleme şeması
export const updateStreamingLinksSchema = z.object({
  links: z.array(z.object({
    platformId: z.string().min(1, 'Platform ID gerekli'),
    url: z.string().url('Geçerli bir URL girin').max(STREAMING.LINK.URL.MAX_LENGTH, 'URL çok uzun'),
  })).min(0, 'En az 0 link olabilir'),
});

// Tip türetmeleri
export type CreateStreamingLinkInput = z.infer<typeof createStreamingLinkSchema>;
export type UpdateStreamingLinkInput = z.infer<typeof updateStreamingLinkSchema>;
export type StreamingLinkFilters = z.infer<typeof streamingLinkFiltersSchema>; 