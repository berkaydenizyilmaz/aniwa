// User API response tipleri

import { User } from '@prisma/client';
import { UserFilters, UpdateUserInput } from '@/lib/schemas/user.schema';

// Admin user listeleme response tipi
export interface GetUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Admin user detay response tipi
export type GetUserResponse = User;

// Admin user güncelleme response tipi
export type UpdateUserResponse = User;

// Admin user filtreleme istek tipi
export type GetUsersRequest = UserFilters;

// Admin user güncelleme istek tipi
export type UpdateUserRequest = UpdateUserInput; 