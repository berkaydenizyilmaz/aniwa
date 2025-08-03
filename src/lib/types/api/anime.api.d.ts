// Anime API response tipleri

import { AnimeSeries, AnimeMediaPart, Genre, Studio, Tag, AnimeType, AnimeStatus, Episode, StreamingLink, StreamingPlatform } from '@prisma/client';
import { 
  CreateAnimeSeriesInput, 
  UpdateAnimeSeriesInput, 
  CreateAnimeMediaPartInput, 
  UpdateAnimeMediaPartInput, 
  CreateEpisodeInput,
  UpdateEpisodeInput,
  CreateStreamingLinkInput,
  UpdateStreamingLinkInput,
  AnimeFilters 
} from '@/lib/schemas/anime.schema';

// Anime Series API response tipleri
export type CreateAnimeSeriesResponse = AnimeSeries;
export type GetAnimeSeriesResponse = AnimeSeries;
export type UpdateAnimeSeriesResponse = AnimeSeries;

// Anime Series ilişkilerle birlikte response tipi
export interface GetAnimeSeriesWithRelationsResponse extends AnimeSeries {
  animeGenres: Array<{
    genre: Genre;
  }>;
  animeTags: Array<{
    tag: Tag;
  }>;
  animeStudios: Array<{
    studio: Studio;
  }>;
}

// Anime Series ilişkileri response tipi
export interface GetAnimeSeriesRelationsResponse {
  genres: Genre[];
  studios: Studio[];
  tags: Tag[];
}

// Anime Media Part API response tipleri
export type CreateAnimeMediaPartResponse = AnimeMediaPart;
export type GetAnimeMediaPartResponse = AnimeMediaPart;
export type UpdateAnimeMediaPartResponse = AnimeMediaPart;

// Episode API response tipleri
export type CreateEpisodeResponse = Episode;
export type GetEpisodeResponse = Episode;
export type UpdateEpisodeResponse = Episode;

// Episode listesi response tipi
export interface GetEpisodeListResponse {
  episodes: Episode[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Anime Series listesi response tipi
export interface GetAnimeSeriesListResponse {
  animeSeries: Array<{
    id: string;
    aniwaPublicId: number;
    title: string;
    type: AnimeType;
    status: AnimeStatus;
    coverImage?: string;
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Anime Media Part listesi response tipi
export interface GetAnimeMediaPartsResponse {
  mediaParts: AnimeMediaPart[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Anime Series detay response tipi (MediaPart'larla birlikte)
export interface GetAnimeSeriesDetailResponse extends AnimeSeries {
  mediaParts: AnimeMediaPart[];
}

// Streaming Link API response tipleri
export type CreateStreamingLinkResponse = StreamingLink;
export type GetStreamingLinkResponse = StreamingLink;
export type UpdateStreamingLinkResponse = StreamingLink;

// Streaming Link listesi response tipi
export interface GetStreamingLinksResponse {
  streamingLinks: Array<StreamingLink & {
    platform: StreamingPlatform;
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Streaming Platform listesi response tipi
export interface GetStreamingPlatformsResponse {
  platforms: StreamingPlatform[];
}

// Anime API istek tipleri
export type CreateAnimeSeriesRequest = CreateAnimeSeriesInput;
export type UpdateAnimeSeriesRequest = UpdateAnimeSeriesInput;
export type CreateAnimeMediaPartRequest = CreateAnimeMediaPartInput;
export type UpdateAnimeMediaPartRequest = UpdateAnimeMediaPartInput;
export type CreateEpisodeRequest = CreateEpisodeInput;
export type UpdateEpisodeRequest = UpdateEpisodeInput;
export type CreateStreamingLinkRequest = CreateStreamingLinkInput;
export type UpdateStreamingLinkRequest = UpdateStreamingLinkInput;
export type GetAnimeSeriesRequest = AnimeFilters;
export type GetAnimeMediaPartsRequest = AnimeFilters;
export type GetEpisodeListRequest = AnimeFilters; 