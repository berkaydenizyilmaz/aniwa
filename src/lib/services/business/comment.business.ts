// Comment ve CommentLike iş mantığı katmanı

import { BusinessError, NotFoundError } from '@/lib/errors';
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
  data: CreateCommentRequest,
  user: { id: string; username: string }
): Promise<ApiResponse<CreateCommentResponse>> {
  try {
    // Yetişkin içerik kontrolü (ileride user settings'den kontrol edilecek)
    // Şimdilik basit kontrol
    if (data.content.length < 1) {
      throw new BusinessError('Yorum içeriği boş olamaz');
    }

    // Transaction ile güvenli işlem
    const result = await prisma.$transaction(async (tx) => {
      return await createCommentDB({
        user: { connect: { id: userId } },
        content: data.content,
        ...(data.animeSeriesId && { animeSeries: { connect: { id: data.animeSeriesId } } }),
        ...(data.animeMediaPartId && { animeMediaPart: { connect: { id: data.animeMediaPartId } } }),
      }, tx);
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
      'Yorum oluşturma sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        userId,
        username: user.username,
        animeSeriesId: data.animeSeriesId,
        animeMediaPartId: data.animeMediaPartId,
      }
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
    if (error instanceof BusinessError) {
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
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

// Anime serisinin yorumlarını getirme
export async function getAnimeSeriesComments(
  animeSeriesId: string,
  filters?: GetAnimeCommentsRequest
): Promise<ApiResponse<GetAnimeCommentsResponse>> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    // Anime serisinin yorumlarını getir
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
    if (error instanceof BusinessError) {
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
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

// Anime medya parçasının yorumlarını getirme
export async function getAnimeMediaPartComments(
  animeMediaPartId: string,
  filters?: GetAnimeCommentsRequest
): Promise<ApiResponse<GetAnimeCommentsResponse>> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    // Anime medya parçasının yorumlarını getir
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
    if (error instanceof BusinessError) {
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
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
  data: { content: string },
  user: { id: string; username: string }
): Promise<ApiResponse<UpdateCommentResponse>> {
  try {
    // Yorum mevcut mu ve kullanıcıya ait mi kontrolü
    const existingComment = await findCommentById(commentId);
    if (!existingComment) {
      throw new NotFoundError('Yorum bulunamadı');
    }
    if (existingComment.userId !== userId) {
      throw new NotFoundError('Yorum bulunamadı');
    }

    // İçerik kontrolü
    if (data.content.length < 1) {
      throw new BusinessError('Yorum içeriği boş olamaz');
    }

    // Transaction ile güvenli işlem
    const result = await prisma.$transaction(async (tx) => {
      return await updateCommentDB(
        { id: commentId },
        { content: data.content },
        tx
      );
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
      'Yorum güncelleme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        commentId,
        userId,
        username: user.username,
      }
    );

    throw new BusinessError('Yorum güncelleme başarısız');
  }
}

// Yorum silme
export async function deleteComment(
  commentId: string,
  userId: string,
  user: { id: string; username: string }
): Promise<ApiResponse<DeleteCommentResponse>> {
  try {
    // Yorum mevcut mu ve kullanıcıya ait mi kontrolü
    const existingComment = await findCommentById(commentId);
    if (!existingComment) {
      throw new NotFoundError('Yorum bulunamadı');
    }
    if (existingComment.userId !== userId) {
      throw new NotFoundError('Yorum bulunamadı');
    }

    // Transaction ile güvenli işlem
    await prisma.$transaction(async (tx) => {
      await deleteCommentDB({ id: commentId }, tx);
    });

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Yorum silme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        commentId,
        userId,
        username: user.username,
      }
    );

    throw new BusinessError('Yorum silme başarısız');
  }
}

// Yorum beğenme/beğenmeme (toggle)
export async function toggleCommentLike(
  userId: string,
  data: ToggleCommentLikeRequest,
  user: { id: string; username: string }
): Promise<ApiResponse<ToggleCommentLikeResponse>> {
  try {
    // Yorum mevcut mu kontrolü
    const existingComment = await findCommentById(data.commentId);
    if (!existingComment) {
      throw new NotFoundError('Yorum bulunamadı');
    }

    // Mevcut beğeni durumunu kontrol et
    const existingLike = await findCommentLikeByUserAndComment(userId, data.commentId);

    // Transaction ile güvenli işlem
    const result = await prisma.$transaction(async (tx) => {
      if (existingLike) {
        // Beğeni varsa çıkar
        const deletedLike = await deleteCommentLikeDB(
          { userId_commentId: { userId, commentId: data.commentId } },
          tx
        );

        // Yorum beğeni sayısını güncelle
        await updateCommentDB(
          { id: data.commentId },
          { likeCount: { decrement: 1 } },
          tx
        );

        return { action: 'removed' as const, like: deletedLike };
      } else {
        // Beğeni yoksa ekle
        const newLike = await createCommentLikeDB({
          user: { connect: { id: userId } },
          comment: { connect: { id: data.commentId } },
        }, tx);

        // Yorum beğeni sayısını güncelle
        await updateCommentDB(
          { id: data.commentId },
          { likeCount: { increment: 1 } },
          tx
        );

        return { action: 'added' as const, like: newLike };
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
      'Yorum beğenisi toggle sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        userId,
        commentId: data.commentId,
        username: user.username,
      }
    );

    throw new BusinessError('Yorum beğenisi işlemi başarısız');
  }
} 