// Tag API response tipleri

import { Tag } from '@prisma/client';
import { CreateTagInput, UpdateTagInput, TagFilters } from '@/lib/schemas/tag.schema';

// Prisma Tag tipini direkt kullan (küçük model)
export type CreateTagResponse = Tag;
export type GetTagResponse = Tag;
export type UpdateTagResponse = Tag;

// Sadece özel response için interface
export interface GetTagsResponse {
  tags: Tag[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tag API istek tipleri
export type CreateTagRequest = CreateTagInput;
export type UpdateTagRequest = UpdateTagInput;
export type GetTagsRequest = TagFilters; 