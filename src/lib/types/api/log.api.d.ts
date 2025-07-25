// Log API response tipleri

import { Log } from '@prisma/client';
import { CreateLogInput, LogFilters } from '@/lib/schemas/log.schema';

// Prisma Log tipini direkt kullan (küçük model)
export type GetLogResponse = Log & {
  user?: {
    id: string;
    username: string;
    email: string;
  } | null;
};

// Sadece özel response için interface
export interface GetLogsResponse {
  logs: (Log & {
    user?: {
      id: string;
      username: string;
      email: string;
    } | null;
  })[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Log API istek tipleri
export type CreateLogRequest = CreateLogInput;
export type GetLogsRequest = LogFilters; 