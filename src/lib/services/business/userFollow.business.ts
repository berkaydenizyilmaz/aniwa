// UserFollow iş mantığı katmanı

import { BusinessError, DatabaseError } from '@/lib/errors';
import {
  createUserFollowDB,
  findUserFollowByFollowerAndFollowingDB,
  findFollowersByUserIdDB,
  findFollowingByUserIdDB,
  deleteUserFollowDB,
  countFollowersDB,
  countFollowingDB,
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
export async function toggleUserFollowBusiness(
  followerId: string,
  data: ToggleUserFollowRequest
): Promise<ApiResponse<ToggleUserFollowResponse>> {
  try {
    // Kendini takip etme kontrolü
    if (followerId === data.followingId) {
      throw new BusinessError('Kendinizi takip edemezsiniz');
    }

    // Mevcut takip durumunu kontrol et
    const existingFollow = await findUserFollowByFollowerAndFollowingDB(
      followerId,
      data.followingId
    );

    // Transaction ile güvenli işlem
    const result = await prisma.$transaction(async (tx) => {
      if (existingFollow) {
        // Takip varsa çıkar
        const deletedFollow = await deleteUserFollowDB({
          followerId_followingId: { followerId, followingId: data.followingId }
        }, tx);

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

    // Başarılı işlem logu
    await logger.info(
      EVENTS.USER.FOLLOW_TOGGLED,
      `Kullanıcı ${result.action === 'followed' ? 'takip edildi' : 'takip çıkarıldı'}`,
      {
        action: result.action,
        followerId,
        followingId: data.followingId,
      },
      followerId
    );

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Kullanıcı takip toggle sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        followerId,
        followingId: data.followingId,
      },
      followerId
    );

    throw new BusinessError('Kullanıcı takip işlemi başarısız');
  }
}

// Kullanıcının takipçilerini getirme
export async function getUserFollowersBusiness(
  userId: string,
  filters?: GetUserFollowersRequest
): Promise<ApiResponse<GetUserFollowersResponse>> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    // Kullanıcının takipçilerini getir
    const followers = await findFollowersByUserIdDB(userId, skip, limit);
    const total = await countFollowersDB({ followingId: userId });
    const totalPages = Math.ceil(total / limit);

    // Başarılı işlem logu
    await logger.info(
      EVENTS.USER.FOLLOWERS_RETRIEVED,
      'Kullanıcı takipçileri görüntülendi',
      {
        userId,
        total,
        page,
        limit,
        totalPages,
      },
      userId
    );

    return {
      success: true,
      data: {
        followers,
        total,
        page,
        limit,
        totalPages,
      }
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Kullanıcı takipçileri getirme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        userId,
        filters,
      },
      userId
    );

    throw new BusinessError('Kullanıcı takipçileri getirme başarısız');
  }
}

// Kullanıcının takip ettiklerini getirme
export async function getUserFollowingBusiness(
  userId: string,
  filters?: GetUserFollowingRequest
): Promise<ApiResponse<GetUserFollowingResponse>> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    // Kullanıcının takip ettiklerini getir
    const following = await findFollowingByUserIdDB(userId, skip, limit);
    const total = await countFollowingDB({ followerId: userId });
    const totalPages = Math.ceil(total / limit);

    // Başarılı işlem logu
    await logger.info(
      EVENTS.USER.FOLLOWING_RETRIEVED,
      'Kullanıcı takip edilenler görüntülendi',
      {
        userId,
        total,
        page,
        limit,
        totalPages,
      },
      userId
    );

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
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Kullanıcı takip edilenler getirme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        userId,
        filters,
      },
      userId
    );

    throw new BusinessError('Kullanıcı takip edilenler getirme başarısız');
  }
}

// Takip durumu kontrolü
export async function checkFollowStatusBusiness(
  followerId: string,
  followingId: string
): Promise<ApiResponse<{ isFollowing: boolean }>> {
  try {
    const follow = await findUserFollowByFollowerAndFollowingDB(followerId, followingId);

    // Başarılı işlem logu
    await logger.info(
      EVENTS.USER.FOLLOW_STATUS_CHECKED,
      'Takip durumu kontrol edildi',
      {
        followerId,
        followingId,
        isFollowing: !!follow,
      },
      followerId
    );

    return {
      success: true,
      data: { isFollowing: !!follow },
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Takip durumu kontrolü sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        followerId,
        followingId,
      },
      followerId
    );

    throw new BusinessError('Takip durumu kontrolü başarısız');
  }
} 