// Tag API response tipleri

import { Tag } from '@prisma/client';
import { CreateTagInput, UpdateTagInput, TagFilters } from '@/lib/schemas/tag.schema';
import { PaginatedResponse, CrudResponses } from '../shared';

// CRUD response types
export type TagCrudResponses = CrudResponses<Tag>;
export type CreateTagResponse = TagCrudResponses['Create'];
export type GetTagResponse = TagCrudResponses['Get'];
export type UpdateTagResponse = TagCrudResponses['Update'];

// Paginated response type
export type GetTagsResponse = PaginatedResponse<Tag>;

// Tag API istek tipleri
export type CreateTagRequest = CreateTagInput;
export type UpdateTagRequest = UpdateTagInput;
export type GetTagsRequest = TagFilters; 