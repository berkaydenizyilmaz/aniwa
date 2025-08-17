// User API response tipleri

import { User } from '@prisma/client';
import { UserFilters, UpdateUserInput } from '@/lib/schemas/user.schema';
import { PaginatedResponse, CrudResponses } from '../shared';

// CRUD response types
export type UserCrudResponses = CrudResponses<User>;
export type GetUserResponse = UserCrudResponses['Get'];
export type UpdateUserResponse = UserCrudResponses['Update'];

// Paginated response type
export type GetUsersResponse = PaginatedResponse<User>;

// Admin user filtreleme istek tipi
export type GetUsersRequest = UserFilters;

// Admin user güncelleme istek tipi
export type UpdateUserRequest = UpdateUserInput; 