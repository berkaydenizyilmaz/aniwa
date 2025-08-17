// Log API response tipleri

import { Log } from '@prisma/client';
import { CreateLogInput, LogFilters } from '@/lib/schemas/log.schema';
import { PaginatedResponse, CrudResponses } from '../shared';

// Log with user info type
export type LogWithUser = Log & {
  user?: {
    id: string;
    username: string;
    email: string;
  } | null;
};

// CRUD response types
export type LogCrudResponses = CrudResponses<LogWithUser>;
export type GetLogResponse = LogCrudResponses['Get'];

// Paginated response type
export type GetLogsResponse = PaginatedResponse<LogWithUser>;

// Log API istek tipleri
export type CreateLogRequest = CreateLogInput;
export type GetLogsRequest = LogFilters; 