// Streaming API response tipleri

import { StreamingPlatform, StreamingLink } from '@prisma/client';
import { CreateStreamingPlatformInput, UpdateStreamingPlatformInput, StreamingPlatformFilters, CreateStreamingLinkInput, UpdateStreamingLinkInput, StreamingLinkFilters } from '@/lib/schemas/streaming.schema';

// Prisma tiplerini direkt kullan (küçük model)
export type CreateStreamingPlatformResponse = StreamingPlatform;
export type GetStreamingPlatformResponse = StreamingPlatform;
export type UpdateStreamingPlatformResponse = StreamingPlatform;

export type CreateStreamingLinkResponse = StreamingLink;
export type GetStreamingLinkResponse = StreamingLink;
export type UpdateStreamingLinkResponse = StreamingLink;

// Sadece özel response için interface
export interface GetAllStreamingPlatformsResponse {
  platforms: StreamingPlatform[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetAllStreamingLinksResponse {
  links: StreamingLink[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UpdateStreamingLinksResponse {
  message: string;
  updatedCount: number;
}

// Streaming API istek tipleri
export type CreateStreamingPlatformRequest = CreateStreamingPlatformInput;
export type UpdateStreamingPlatformRequest = UpdateStreamingPlatformInput;
export type GetStreamingPlatformsRequest = StreamingPlatformFilters;

export type CreateStreamingLinkRequest = CreateStreamingLinkInput;
export type UpdateStreamingLinkRequest = UpdateStreamingLinkInput;
export type GetStreamingLinksRequest = StreamingLinkFilters;

export type UpdateStreamingLinksRequest = {
  links: Array<{
    platformId: string;
    url: string;
  }>;
}; 