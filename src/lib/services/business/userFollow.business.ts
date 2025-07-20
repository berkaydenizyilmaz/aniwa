// UserFollow iş mantığı katmanı

import { BusinessError } from '@/lib/errors';
import {
  createUserFollow as createUserFollowDB,
  findUserFollowByFollowerAndFollowing,
  findFollowersByUserId,
  findFollowingByUserId,
  deleteUserFollow as deleteUserFollowDB,
  countFollowers,
  countFollowing,
} from '@/lib/services/db/userFollow.db';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/utils/logger';
import { EVENTS } from '@/lib/constants/events.constants';
import { ApiResponse } from '@/lib/types/api';
import {
  ToggleUserFollowRequest,
  GetUserFollowersRequest,
  GetUserFollowingRequest,
  ToggleUserFollowResponse,
  GetUserFollowersResponse,
  GetUserFollowingResponse,
} from '@/lib/types/api/userFollow.api';

// Kullanıcı takip etme/çıkarma (toggle)
export async function toggleUserFollow(
  followerId: string,
  data: ToggleUserFollowRequest,
  user: { id: string; username: string }
): Promise<ApiResponse<ToggleUserFollowResponse>> {
  try {
    // Kendini takip etme kontrolü
    if (followerId === data.followingId) {
      throw new BusinessError('Kendinizi takip edemezsiniz');
    }

    // Mevcut takip durumunu kontrol et
    const existingFollow = await findUserFollowByFollowerAndFollowing(
      followerId,
      data.followingId
    );

    // Transaction ile güvenli işlem
    const result = await prisma.$transaction(async (tx) => {
      if (existingFollow) {
        // Takip varsa çıkar
        const deletedFollow = await deleteUserFollowDB(
          { followerId_followingId: { followerId, followingId: data.followingId } },
          tx
        );

        return { action: 'unfollowed' as const, follow: deletedFollow };
      } else {
        // Takip yoksa ekle
        const newFollow = await createUserFollowDB({
          follower: { connect: { id: followerId } },
          following: { connect: { id: data.followingId } },
        }, tx);

        return { action: 'followed' as const, follow: newFollow };
      }
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Kullanıcı takip toggle sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        followerId,
        followingId: data.followingId,
        username: user.username,
      }
    );

    throw new BusinessError('Kullanıcı takip işlemi başarısız');
  }
}

// Kullanıcının takipçilerini getirme
export async function getUserFollowers(
  userId: string,
  filters?: GetUserFollowersRequest
): Promise<ApiResponse<GetUserFollowersResponse>> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    // Kullanıcının takipçilerini getir
    const followers = await findFollowersByUserId(userId, skip, limit);
    const total = await countFollowers({ followingId: userId });
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: {
        followers,
        total,
        page,
        limit,
        totalPages,
      },
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Kullanıcı takipçileri getirme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        userId,
        filters,
      }
    );

    throw new BusinessError('Kullanıcı takipçileri getirme başarısız');
  }
}

// Kullanıcının takip ettiklerini getirme
export async function getUserFollowing(
  userId: string,
  filters?: GetUserFollowingRequest
): Promise<ApiResponse<GetUserFollowingResponse>> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    // Kullanıcının takip ettiklerini getir
    const following = await findFollowingByUserId(userId, skip, limit);
    const total = await countFollowing({ followerId: userId });
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: {
        following,
        total,
        page,
        limit,
        totalPages,
      },
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Kullanıcı takip edilenleri getirme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        userId,
        filters,
      }
    );

    throw new BusinessError('Kullanıcı takip edilenleri getirme başarısız');
  }
}

// Takip durumunu kontrol etme
export async function checkFollowStatus(
  followerId: string,
  followingId: string
): Promise<ApiResponse<{ isFollowing: boolean }>> {
  try {
    // Takip durumunu kontrol et
    const existingFollow = await findUserFollowByFollowerAndFollowing(
      followerId,
      followingId
    );

    return {
      success: true,
      data: {
        isFollowing: !!existingFollow,
      },
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Takip durumu kontrolü sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        followerId,
        followingId,
      }
    );

    throw new BusinessError('Takip durumu kontrolü başarısız');
  }
} 