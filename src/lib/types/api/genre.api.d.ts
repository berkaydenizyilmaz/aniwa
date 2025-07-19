// Genre API response tipleri

import { Genre } from '@prisma/client';
import { CreateGenreInput, UpdateGenreInput, GenreFilters } from '@/lib/schemas/genre.schema';

// Prisma Genre tipini direkt kullan (küçük model)
export type CreateGenreResponse = Genre;
export type GetGenreResponse = Genre;
export type UpdateGenreResponse = Genre;

// Sadece özel response için interface
export interface GetGenresResponse {
  genres: Genre[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Genre API istek tipleri
export type CreateGenreRequest = CreateGenreInput;
export type UpdateGenreRequest = UpdateGenreInput;
export type GetGenresRequest = GenreFilters; 