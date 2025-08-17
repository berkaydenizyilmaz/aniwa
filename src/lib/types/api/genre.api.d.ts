// Genre API response tipleri

import { Genre } from '@prisma/client';
import { CreateGenreInput, UpdateGenreInput, GenreFilters } from '@/lib/schemas/genre.schema';
import { PaginatedResponse, CrudResponses } from '../shared';

// CRUD response types
export type GenreCrudResponses = CrudResponses<Genre>;
export type CreateGenreResponse = GenreCrudResponses['Create'];
export type GetGenreResponse = GenreCrudResponses['Get'];
export type UpdateGenreResponse = GenreCrudResponses['Update'];

// Paginated response type
export type GetGenresResponse = PaginatedResponse<Genre>;

// Genre API istek tipleri
export type CreateGenreRequest = CreateGenreInput;
export type UpdateGenreRequest = UpdateGenreInput;
export type GetGenresRequest = GenreFilters; 