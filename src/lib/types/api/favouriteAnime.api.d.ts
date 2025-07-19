// FavouriteAnime API response tipleri

import { FavouriteAnimeSeries } from '@prisma/client';

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

// FavouriteAnime API istek tipleri
export interface GetUserFavouriteAnimesRequest {
  page?: number;
  limit?: number;
  order?: 'asc' | 'desc';
}

export interface GetAnimeFavouritesRequest {
  page?: number;
  limit?: number;
}

export interface ToggleFavouriteAnimeRequest {
  animeSeriesId: string;
} 