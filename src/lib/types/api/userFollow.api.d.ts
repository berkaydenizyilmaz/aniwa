// UserFollow API response tipleri

import { UserFollow } from '@prisma/client';
import { 
  ToggleUserFollowInput, 
  GetUserFollowersInput, 
  GetUserFollowingInput,
  CheckFollowStatusInput
} from '@/lib/schemas/userFollow.schema';

export type ToggleUserFollowRequest = ToggleUserFollowInput;
export type GetUserFollowersRequest = GetUserFollowersInput;
export type GetUserFollowingRequest = GetUserFollowingInput;
export type CheckFollowStatusRequest = CheckFollowStatusInput;

// Toggle response tipi
export interface ToggleUserFollowResponse {
  action: 'followed' | 'unfollowed';
  follow: UserFollow;
}

// Takip durumu kontrolü response tipi
export interface CheckFollowStatusResponse {
  isFollowing: boolean;
}

// Sayfalama response tipleri
export interface GetUserFollowersResponse {
  followers: UserFollow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetUserFollowingResponse {
  following: UserFollow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 