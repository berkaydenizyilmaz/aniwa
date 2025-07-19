// Streaming validasyon şemaları

import { z } from 'zod';

// Streaming platform oluşturma şeması
export const createStreamingPlatformSchema = z.object({
  name: z.string().min(1, 'Platform adı gerekli').max(100, 'Platform adı çok uzun'),
  baseUrl: z.string().url('Geçerli bir URL girin').max(255, 'URL çok uzun'),
});

// Streaming platform güncelleme şeması
export const updateStreamingPlatformSchema = createStreamingPlatformSchema.partial();

// Streaming platform filtreleme şeması
export const streamingPlatformFiltersSchema = z.object({
  search: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(50),
});

// Streaming link oluşturma şeması
export const createStreamingLinkSchema = z.object({
  platformId: z.string().min(1, 'Platform ID gerekli'),
  url: z.string().url('Geçerli bir URL girin').max(500, 'URL çok uzun'),
  // Polymorphic ilişki - sadece biri dolu olacak
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

// Streaming link güncelleme şeması
export const updateStreamingLinkSchema = createStreamingLinkSchema.partial();

// Streaming link filtreleme şeması
export const streamingLinkFiltersSchema = z.object({
  platformId: z.string().optional(),
  animeSeriesId: z.string().optional(),
  animeMediaPartId: z.string().optional(),
  episodeId: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(50),
});

// Streaming link toplu güncelleme şeması
export const updateStreamingLinksSchema = z.object({
  links: z.array(z.object({
    platformId: z.string().min(1, 'Platform ID gerekli'),
    url: z.string().url('Geçerli bir URL girin').max(500, 'URL çok uzun'),
  })).min(0, 'En az 0 link olabilir'),
});

// Tip türetmeleri
export type CreateStreamingPlatformInput = z.infer<typeof createStreamingPlatformSchema>;
export type UpdateStreamingPlatformInput = z.infer<typeof updateStreamingPlatformSchema>;
export type StreamingPlatformFilters = z.infer<typeof streamingPlatformFiltersSchema>;

export type CreateStreamingLinkInput = z.infer<typeof createStreamingLinkSchema>;
export type UpdateStreamingLinkInput = z.infer<typeof updateStreamingLinkSchema>;
export type StreamingLinkFilters = z.infer<typeof streamingLinkFiltersSchema>; 