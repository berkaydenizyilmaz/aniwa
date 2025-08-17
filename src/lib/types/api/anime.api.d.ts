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
import { PaginatedResponse, CrudResponses } from '../shared';

// Anime Series API response tipleri
export type AnimeSeriesCrudResponses = CrudResponses<AnimeSeries>;
export type CreateAnimeSeriesResponse = AnimeSeriesCrudResponses['Create'];
export type GetAnimeSeriesResponse = AnimeSeriesCrudResponses['Get'];
export type UpdateAnimeSeriesResponse = AnimeSeriesCrudResponses['Update'];

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
export type AnimeMediaPartCrudResponses = CrudResponses<AnimeMediaPart>;
export type CreateAnimeMediaPartResponse = AnimeMediaPartCrudResponses['Create'];
export type GetAnimeMediaPartResponse = AnimeMediaPartCrudResponses['Get'];
export type UpdateAnimeMediaPartResponse = AnimeMediaPartCrudResponses['Update'];

// Episode API response tipleri
export type EpisodeCrudResponses = CrudResponses<Episode>;
export type CreateEpisodeResponse = EpisodeCrudResponses['Create'];
export type GetEpisodeResponse = EpisodeCrudResponses['Get'];
export type UpdateEpisodeResponse = EpisodeCrudResponses['Update'];

// Episode listesi response tipi
export type GetEpisodeListResponse = PaginatedResponse<Episode>;

// Anime Series listesi response tipi
export type GetAnimeSeriesListResponse = PaginatedResponse<{
  id: string;
  aniwaPublicId: number;
  title: string;
  type: AnimeType;
  status: AnimeStatus;
  coverImage?: string;
}>;

// Anime Media Part listesi response tipi
export type GetAnimeMediaPartsResponse = PaginatedResponse<AnimeMediaPart>;

// Anime Series detay response tipi (MediaPart'larla birlikte)
export interface GetAnimeSeriesDetailResponse extends AnimeSeries {
  mediaParts: AnimeMediaPart[];
}

// Streaming Link API response tipleri
export type StreamingLinkCrudResponses = CrudResponses<StreamingLink>;
export type CreateStreamingLinkResponse = StreamingLinkCrudResponses['Create'];
export type GetStreamingLinkResponse = StreamingLinkCrudResponses['Get'];
export type UpdateStreamingLinkResponse = StreamingLinkCrudResponses['Update'];

// Streaming Link listesi response tipi
export type GetStreamingLinksResponse = PaginatedResponse<StreamingLink & {
  platform: StreamingPlatform;
}>;

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