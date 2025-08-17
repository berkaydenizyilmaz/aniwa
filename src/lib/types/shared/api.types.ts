// Shared API response types

// Paginated response for list endpoints
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// CRUD operation response types
export type CrudResponses<T> = {
  Create: T;
  Get: T;
  Update: T;
  Delete: { success: boolean };
};

// Common API request types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface SearchParams {
  search?: string;
}

export interface ApiFilters extends PaginationParams, SearchParams {}

// Error response type
export interface ApiErrorResponse {
  error: string;
  code: string;
  details?: Record<string, any>;
}
