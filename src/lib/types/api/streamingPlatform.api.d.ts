// StreamingPlatform API response tipleri

import { StreamingPlatform } from '@prisma/client';
import { CreateStreamingPlatformInput, UpdateStreamingPlatformInput, StreamingPlatformFilters } from '@/lib/schemas/streamingPlatform.schema';

// Prisma tipini direkt kullan (küçük model)
export type CreateStreamingPlatformResponse = StreamingPlatform;
export type GetStreamingPlatformResponse = StreamingPlatform;
export type UpdateStreamingPlatformResponse = StreamingPlatform;

// Sadece özel response için interface
export interface GetStreamingPlatformsResponse {
  platforms: StreamingPlatform[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API istek tipleri
export type CreateStreamingPlatformRequest = CreateStreamingPlatformInput;
export type UpdateStreamingPlatformRequest = UpdateStreamingPlatformInput;
export type GetStreamingPlatformsRequest = StreamingPlatformFilters; 