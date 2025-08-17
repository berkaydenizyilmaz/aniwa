// Studio API response tipleri

import { Studio } from '@prisma/client';
import { CreateStudioInput, UpdateStudioInput, StudioFilters } from '@/lib/schemas/studio.schema';
import { PaginatedResponse, CrudResponses } from '../shared';

// CRUD response types
export type StudioCrudResponses = CrudResponses<Studio>;
export type CreateStudioResponse = StudioCrudResponses['Create'];
export type GetStudioResponse = StudioCrudResponses['Get'];
export type UpdateStudioResponse = StudioCrudResponses['Update'];

// Paginated response type
export type GetStudiosResponse = PaginatedResponse<Studio>;

// Studio API istek tipleri
export type CreateStudioRequest = CreateStudioInput;
export type UpdateStudioRequest = UpdateStudioInput;
export type GetStudiosRequest = StudioFilters; 