// FavouriteAnime API response tipleri

import { FavouriteAnimeSeries } from '@prisma/client';
import { ToggleFavouriteAnimeInput, FavouriteAnimeFilters } from '@/lib/schemas/favouriteAnime.schema';

// Schema tiplerini yeniden adlandır
export type ToggleFavouriteAnimeRequest = ToggleFavouriteAnimeInput;
export type GetUserFavouriteAnimesRequest = FavouriteAnimeFilters;

// Prisma FavouriteAnimeSeries tipini direkt kullan (küçük model)
export type GetFavouriteAnimeResponse = FavouriteAnimeSeries;
export type ToggleFavouriteAnimeResponse = FavouriteAnimeSeries;

// Sadece özel response için interface
export interface GetUserFavouriteAnimesResponse {
  favouriteAnimes: FavouriteAnimeSeries[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetAnimeFavouritesResponse {
  favourites: Array<FavouriteAnimeSeries & {
    user: {
      id: string;
      username: string;
      profilePicture?: string;
    };
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetAnimeFavouritesRequest {
  page?: number;
  limit?: number;
} 