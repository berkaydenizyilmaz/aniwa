// UserAnimeTracking API response tipleri

import { UserAnimeTracking } from '@prisma/client';
import { ToggleUserAnimeTrackingInput, UserAnimeTrackingFilters } from '@/lib/schemas/userAnimeTracking.schema';

// Schema tiplerini yeniden adlandır
export type ToggleUserAnimeTrackingRequest = ToggleUserAnimeTrackingInput;
export type GetUserAnimeTrackingRequest = UserAnimeTrackingFilters;

// Toggle response tipi
export interface ToggleUserAnimeTrackingResponse {
  action: 'tracked' | 'untracked';
  tracking: UserAnimeTracking;
}

// Takip durumu kontrolü response tipi
export interface CheckTrackingStatusResponse {
  isTracking: boolean;
}

// Sadece özel response için interface
export interface GetUserAnimeTrackingResponse {
  trackingRecords: UserAnimeTracking[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 