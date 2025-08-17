// StreamingPlatform API response tipleri

import { StreamingPlatform } from '@prisma/client';
import { CreateStreamingPlatformInput, UpdateStreamingPlatformInput, StreamingPlatformFilters } from '@/lib/schemas/streamingPlatform.schema';
import { PaginatedResponse, CrudResponses } from '../shared';

// CRUD response types
export type StreamingPlatformCrudResponses = CrudResponses<StreamingPlatform>;
export type CreateStreamingPlatformResponse = StreamingPlatformCrudResponses['Create'];
export type GetStreamingPlatformResponse = StreamingPlatformCrudResponses['Get'];
export type UpdateStreamingPlatformResponse = StreamingPlatformCrudResponses['Update'];

// Paginated response type
export type GetStreamingPlatformsResponse = PaginatedResponse<StreamingPlatform>;

// API istek tipleri
export type CreateStreamingPlatformRequest = CreateStreamingPlatformInput;
export type UpdateStreamingPlatformRequest = UpdateStreamingPlatformInput;
export type GetStreamingPlatformsRequest = StreamingPlatformFilters; 