// StreamingLink API response tipleri

import { StreamingLink } from '@prisma/client';
import { CreateStreamingLinkInput, UpdateStreamingLinkInput, StreamingLinkFilters } from '@/lib/schemas/streamingLink.schema';

// Prisma tipini direkt kullan (küçük model)
export type CreateStreamingLinkResponse = StreamingLink;
export type GetStreamingLinkResponse = StreamingLink;
export type UpdateStreamingLinkResponse = StreamingLink;

// Sadece özel response için interface
export interface GetStreamingLinksResponse {
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

// API istek tipleri
export type CreateStreamingLinkRequest = CreateStreamingLinkInput;
export type UpdateStreamingLinkRequest = UpdateStreamingLinkInput;
export type GetStreamingLinksRequest = StreamingLinkFilters;

export type UpdateStreamingLinksRequest = {
  links: Array<{
    platformId: string;
    url: string;
  }>;
}; 