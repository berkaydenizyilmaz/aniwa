// CustomList API response tipleri

import { CustomList, CustomListItem } from '@prisma/client';

// Prisma CustomList tipini direkt kullan (küçük model)
export type CreateCustomListResponse = CustomList;
export type GetCustomListResponse = CustomList;
export type UpdateCustomListResponse = CustomList;
export type DeleteCustomListResponse = void;

// Sadece özel response için interface
export interface GetUserCustomListsResponse {
  customLists: CustomList[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// CustomListItem response tipleri
export type AddCustomListItemResponse = CustomListItem;
export type RemoveCustomListItemResponse = void;

// CustomList API istek tipleri
export interface CreateCustomListRequest {
  name: string;
  description?: string;
  isPublic?: boolean;
}

export interface UpdateCustomListRequest {
  name?: string;
  description?: string;
  isPublic?: boolean;
}

export interface GetUserCustomListsRequest {
  page?: number;
  limit?: number;
}

export interface AddCustomListItemRequest {
  userAnimeListId: string;
  order?: number;
} 