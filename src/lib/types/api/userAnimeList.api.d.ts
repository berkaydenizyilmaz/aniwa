// UserAnimeList API response tipleri

import { UserAnimeList } from '@prisma/client';
import { AddAnimeToListInput, GetUserAnimeListsInput } from '@/lib/schemas/userAnimeList.schema';

// Schema tiplerini yeniden adlandır
export type AddAnimeToListRequest = AddAnimeToListInput;
export type GetUserAnimeListsRequest = GetUserAnimeListsInput;

// Prisma UserAnimeList tipini direkt kullan (küçük model)
export type AddAnimeToListResponse = UserAnimeList;
export type RemoveAnimeFromListResponse = void;
export type GetUserAnimeListByAnimeResponse = UserAnimeList | null;

// Sadece özel response için interface
export interface GetUserAnimeListsResponse {
  userAnimeLists: UserAnimeList[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 