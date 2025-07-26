// CustomList API response tipleri

import { CustomList, CustomListItem } from '@prisma/client';
import { CreateCustomListInput, UpdateCustomListInput, CustomListFilters } from '@/lib/schemas/customList.schema';

// Schema tiplerini yeniden adlandır
export type CreateCustomListRequest = CreateCustomListInput;
export type UpdateCustomListRequest = UpdateCustomListInput;
export type GetUserCustomListsRequest = CustomListFilters;

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

// Liste itemları için response tipi
export interface GetCustomListItemsResponse {
  customListItems: CustomListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// CustomListItem response tipleri
export type AddCustomListItemResponse = CustomListItem;
export type RemoveCustomListItemResponse = void;

// CustomList API istek tipleri
export interface AddCustomListItemRequest {
  userAnimeListId: string;
  order?: number;
} 