// StreamingPlatform validasyon şemaları

import { z } from 'zod';
import { baseNameSchema, baseUrlSchema, baseFiltersSchema } from './shared/base';

// Platform oluşturma şeması
export const createStreamingPlatformSchema = z.object({
  name: baseNameSchema,
  baseUrl: baseUrlSchema,
});

// Platform güncelleme şeması
export const updateStreamingPlatformSchema = z.object({
  name: baseNameSchema.optional(),
  baseUrl: baseUrlSchema.optional(),
});

// Platform filtreleme şeması
export const streamingPlatformFiltersSchema = baseFiltersSchema;

// Tip türetmeleri
export type CreateStreamingPlatformInput = z.infer<typeof createStreamingPlatformSchema>;
export type UpdateStreamingPlatformInput = z.infer<typeof updateStreamingPlatformSchema>;
export type StreamingPlatformFilters = z.infer<typeof streamingPlatformFiltersSchema>; 