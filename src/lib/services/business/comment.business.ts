// Comment ve CommentLike iş mantığı katmanı

import { BusinessError, NotFoundError, DatabaseError } from '@/lib/errors';
import {
  createComment as createCommentDB,
  findCommentById,
  findCommentsByUserId,
  findCommentsByAnimeSeriesId,
  findCommentsByAnimeMediaPartId,
  updateComment as updateCommentDB,
  deleteComment as deleteCommentDB,
  countComments,
  createCommentLike as createCommentLikeDB,
  findCommentLikeByUserAndComment,
  deleteCommentLike as deleteCommentLikeDB,
} from '@/lib/services/db/comment.db';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/utils/logger';
import { EVENTS } from '@/lib/constants/events.constants';
import { ApiResponse } from '@/lib/types/api';
import {
  CreateCommentRequest,
  GetUserCommentsRequest,
  GetAnimeCommentsRequest,
  ToggleCommentLikeRequest,
  CreateCommentResponse,
  GetUserCommentsResponse,
  GetAnimeCommentsResponse,
  ToggleCommentLikeResponse,
  UpdateCommentResponse,
  DeleteCommentResponse,
} from '@/lib/types/api/comment.api';

// Yorum oluşturma
export async function createComment(
  userId: string,
  data: CreateCommentRequest
): Promise<ApiResponse<CreateCommentResponse>> {
  try {
    // Transaction ile güvenli işlem
    const result = await prisma.$transaction(async (tx) => {
      return await createCommentDB({
        user: { connect: { id: userId } },
        content: data.content,
        ...(data.animeSeriesId && { animeSeries: { connect: { id: data.animeSeriesId } } }),
        ...(data.animeMediaPartId && { animeMediaPart: { connect: { id: data.animeMediaPartId } } }),
      }, tx);
    });

    // Başarılı işlem logu
    await logger.info(
      EVENTS.USER.COMMENT_CREATED,
      'Yorum oluşturuldu',
      {
        userId,
        commentId: result.id,
        animeSeriesId: data.animeSeriesId,
        animeMediaPartId: data.animeMediaPartId,
      },
      userId
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
      'Yorum oluşturma sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        userId,
        animeSeriesId: data.animeSeriesId,
        animeMediaPartId: data.animeMediaPartId,
      },
      userId
    );

    throw new BusinessError('Yorum oluşturma başarısız');
  }
}

// Kullanıcının yorumlarını getirme
export async function getUserComments(
  userId: string,
  filters?: GetUserCommentsRequest
): Promise<ApiResponse<GetUserCommentsResponse>> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    // Kullanıcının yorumlarını getir
    const comments = await findCommentsByUserId(userId, skip, limit);
    const total = await countComments({ userId });
    const totalPages = Math.ceil(total / limit);

    // Başarılı işlem logu
    await logger.info(
      EVENTS.USER.COMMENTS_RETRIEVED,
      'Kullanıcı yorumları görüntülendi',
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
        comments,
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
      'Kullanıcı yorumları getirme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        userId,
        filters,
      }
    );

    throw new BusinessError('Kullanıcı yorumları getirme başarısız');
  }
}

// Anime serisi yorumlarını getirme
export async function getAnimeSeriesComments(
  animeSeriesId: string,
  filters?: GetAnimeCommentsRequest
): Promise<ApiResponse<GetAnimeCommentsResponse>> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    // Anime serisi yorumlarını getir
    const comments = await findCommentsByAnimeSeriesId(animeSeriesId, skip, limit);
    const total = await countComments({ animeSeriesId });
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: {
        comments,
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
      'Anime serisi yorumları getirme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        animeSeriesId,
        filters,
      }
    );

    throw new BusinessError('Anime serisi yorumları getirme başarısız');
  }
}

// Anime medya parçası yorumlarını getirme
export async function getAnimeMediaPartComments(
  animeMediaPartId: string,
  filters?: GetAnimeCommentsRequest
): Promise<ApiResponse<GetAnimeCommentsResponse>> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    // Anime medya parçası yorumlarını getir
    const comments = await findCommentsByAnimeMediaPartId(animeMediaPartId, skip, limit);
    const total = await countComments({ animeMediaPartId });
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: {
        comments,
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
      'Anime medya parçası yorumları getirme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        animeMediaPartId,
        filters,
      }
    );

    throw new BusinessError('Anime medya parçası yorumları getirme başarısız');
  }
}

// Yorum güncelleme
export async function updateComment(
  commentId: string,
  userId: string,
  data: { content: string }
): Promise<ApiResponse<UpdateCommentResponse>> {
  try {
    // Yorum mevcut mu ve kullanıcıya ait mi kontrolü
    const existingComment = await findCommentById(commentId);
    if (!existingComment) {
      throw new NotFoundError('Yorum bulunamadı');
    }

    if (existingComment.userId !== userId) {
      throw new BusinessError('Bu yorumu düzenleme yetkiniz yok');
    }

    // Yorumu güncelle
    const result = await updateCommentDB({ id: commentId }, { content: data.content });

    // Başarılı işlem logu
    await logger.info(
      EVENTS.USER.COMMENT_UPDATED,
      'Yorum güncellendi',
      {
        commentId,
        userId,
        oldContent: existingComment.content,
        newContent: data.content,
      },
      userId
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
      'Yorum güncelleme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        commentId,
        userId,
      },
      userId
    );

    throw new BusinessError('Yorum güncelleme başarısız');
  }
}

// Yorum silme
export async function deleteComment(
  commentId: string,
  userId: string
): Promise<ApiResponse<DeleteCommentResponse>> {
  try {
    // Yorum mevcut mu ve kullanıcıya ait mi kontrolü
    const existingComment = await findCommentById(commentId);
    if (!existingComment) {
      throw new NotFoundError('Yorum bulunamadı');
    }

    if (existingComment.userId !== userId) {
      throw new BusinessError('Bu yorumu silme yetkiniz yok');
    }

    // Yorumu sil
    await deleteCommentDB({ id: commentId });

    // Başarılı işlem logu
    await logger.info(
      EVENTS.USER.COMMENT_DELETED,
      'Yorum silindi',
      {
        commentId,
        userId,
        content: existingComment.content,
      },
      userId
    );

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Yorum silme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        commentId,
        userId,
      },
      userId
    );

    throw new BusinessError('Yorum silme başarısız');
  }
}

// Yorum beğenisi toggle
export async function toggleCommentLike(
  userId: string,
  data: ToggleCommentLikeRequest
): Promise<ApiResponse<ToggleCommentLikeResponse>> {
  try {
    // Yorum mevcut mu kontrolü
    const existingComment = await findCommentById(data.commentId);
    if (!existingComment) {
      throw new NotFoundError('Yorum bulunamadı');
    }

    // Mevcut beğeni kontrolü
    const existingLike = await findCommentLikeByUserAndComment(userId, data.commentId);

    let result;
    if (existingLike) {
      // Beğeniyi kaldır
      await deleteCommentLikeDB({ id: existingLike.id });
      result = { action: 'removed' as const, like: existingLike };
    } else {
      // Beğeni ekle
      const newLike = await createCommentLikeDB({
        user: { connect: { id: userId } },
        comment: { connect: { id: data.commentId } },
      });
      result = { action: 'added' as const, like: newLike };
    }

    // Başarılı işlem logu
    await logger.info(
      EVENTS.USER.COMMENT_LIKE_TOGGLED,
      `Yorum ${result.action === 'added' ? 'beğenildi' : 'beğeni kaldırıldı'}`,
      {
        userId,
        commentId: data.commentId,
        action: result.action,
      },
      userId
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
      'Yorum beğenisi toggle sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        userId,
        commentId: data.commentId,
      },
      userId
    );

    throw new BusinessError('Yorum beğenisi işlemi başarısız');
  }
} 