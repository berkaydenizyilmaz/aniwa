// Studio API response tipleri

import { Studio } from '@prisma/client';
import { CreateStudioInput, UpdateStudioInput, StudioFilters } from '@/lib/schemas/studio.schema';

// Prisma Studio tipini direkt kullan (küçük model)
export type CreateStudioResponse = Studio;
export type GetStudioResponse = Studio;
export type UpdateStudioResponse = Studio;

// Sadece özel response için interface
export interface GetStudiosResponse {
  studios: Studio[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Studio API istek tipleri
export type CreateStudioRequest = CreateStudioInput;
export type UpdateStudioRequest = UpdateStudioInput;
export type GetStudiosRequest = StudioFilters; 