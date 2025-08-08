// Episode business logic

import { 
  createEpisodeDB, 
  findEpisodeByIdDB, 
  findEpisodesByMediaPartIdDB, 
  updateEpisodeDB, 
  deleteEpisodeDB,
  findEpisodeByNumberDB,
  countEpisodesDB
} from '@/lib/services/db/episode.db';
import { findAnimeMediaPartByIdDB } from '@/lib/services/db/mediaPart.db';
import { deleteImagesByEntity, uploadImage } from '@/lib/services/image/upload.service';
import { IMAGE_TYPES } from '@/lib/constants/image.constants';
import { 
  CreateEpisodeRequest, 
  UpdateEpisodeRequest,
  GetEpisodeListResponse,
  GetEpisodeResponse,
  CreateEpisodeResponse,
  UpdateEpisodeResponse
} from '@/lib/types/api/anime.api';
import { ApiResponse } from '@/lib/types/api/index';
import { BusinessError, DatabaseError, NotFoundError } from '@/lib/errors';
import { logger } from '@/lib/utils/logger';
import { EVENTS } from '@/lib/constants/events.constants';

// Episode oluşturma
export async function createEpisodeBusiness(
  data: CreateEpisodeRequest & { thumbnailImageFile?: File },
  userId: string
): Promise<ApiResponse<CreateEpisodeResponse>> {
  try {
    // Media part'ın var olduğunu kontrol et
    const mediaPart = await findAnimeMediaPartByIdDB(data.mediaPartId);
    if (!mediaPart) {
      throw new NotFoundError('Media part bulunamadı');
    }

    // Episode numarasının benzersiz olduğunu kontrol et
    const existingEpisode = await findEpisodeByNumberDB(data.mediaPartId, data.episodeNumber);
    if (existingEpisode) {
      throw new BusinessError('Bu episode numarası zaten kullanılıyor');
    }

    // Episode numarası sıralama kontrolü
    const allEpisodes = await findEpisodesByMediaPartIdDB(data.mediaPartId, { episodeNumber: 'asc' });
    const maxEpisodeNumber = allEpisodes.length > 0 ? Math.max(...allEpisodes.map(ep => ep.episodeNumber)) : 0;
    
    if (data.episodeNumber > maxEpisodeNumber + 1) {
      throw new BusinessError(`Episode numarası ${maxEpisodeNumber + 1}'den büyük olamaz`);
    }

    const { thumbnailImageFile, ...formData } = data;
    let thumbnailImageUrl;
    
    if (thumbnailImageFile) {
      const thumbnailResult = await uploadImage(thumbnailImageFile, IMAGE_TYPES.EPISODE_THUMBNAIL, `${data.mediaPartId}_ep${data.episodeNumber}`);
      thumbnailImageUrl = thumbnailResult.secureUrl;
    }

    const result = await createEpisodeDB({
      mediaPart: { connect: { id: formData.mediaPartId } },
      episodeNumber: formData.episodeNumber,
      title: formData.title,
      description: formData.description,
      thumbnailImage: thumbnailImageUrl,
      airDate: formData.airDate,
      duration: formData.duration,
      isFiller: formData.isFiller,
      fillerNotes: formData.fillerNotes,
    });

    // Başarılı oluşturma logu
    await logger.info(
      EVENTS.EDITOR.EPISODE_CREATED,
      'Episode başarıyla oluşturuldu',
      { 
        episodeId: result.id,
        mediaPartId: result.mediaPartId,
        episodeNumber: result.episodeNumber,
        hasThumbnail: !!thumbnailImageUrl
      },
      userId
    );

    return { success: true, data: result };
  } catch (error) {
    // BusinessError'ları direkt re-throw et
    if (error instanceof BusinessError || error instanceof DatabaseError) {
      throw error;
    }
    
    await logger.error(
      EVENTS.EDITOR.EPISODE_CREATE_FAILED,
      'Episode oluşturma hatası',
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        mediaPartId: data.mediaPartId,
        episodeNumber: data.episodeNumber
      },
      userId
    );
    throw new BusinessError('Episode oluşturma başarısız');
  }
}

// Episode getirme
export async function getEpisodeBusiness(
  id: string,
  userId: string
): Promise<ApiResponse<GetEpisodeResponse>> {
  try {
    const episode = await findEpisodeByIdDB(id);
    if (!episode) {
      throw new NotFoundError('Episode bulunamadı');
    }

    await logger.info(
      EVENTS.EDITOR.EPISODE_RETRIEVED,
      'Episode başarıyla getirildi',
      { 
        episodeId: episode.id,
        mediaPartId: episode.mediaPartId
      },
      userId
    );

    return { success: true, data: episode };
  } catch (error) {
    // BusinessError'ları direkt re-throw et
    if (error instanceof BusinessError || error instanceof DatabaseError) {
      throw error;
    }
    
    await logger.error(
      EVENTS.EDITOR.EPISODE_RETRIEVE_FAILED,
      'Episode getirme hatası',
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        episodeId: id
      },
      userId
    );
    throw new BusinessError('Episode getirme başarısız');
  }
}

// Episode listesi getirme
export async function getEpisodeListBusiness(
  mediaPartId: string,
  page: number = 1,
  limit: number = 10,
  userId: string
): Promise<ApiResponse<GetEpisodeListResponse>> {
  try {
    // Media part'ın var olduğunu kontrol et
    const mediaPart = await findAnimeMediaPartByIdDB(mediaPartId);
    if (!mediaPart) {
      throw new NotFoundError('Media part bulunamadı');
    }
    
    const [episodes, total] = await Promise.all([
      findEpisodesByMediaPartIdDB(mediaPartId, { episodeNumber: 'asc' }),
      countEpisodesDB({ mediaPartId }),
    ]);

    const totalPages = Math.ceil(total / limit);

    await logger.info(
      EVENTS.EDITOR.EPISODE_LIST_RETRIEVED,
      'Episode listesi başarıyla getirildi',
      { 
        mediaPartId,
        count: episodes.length,
        total,
        page,
        limit
      },
      userId
    );

    return {
      success: true,
      data: {
        episodes,
        total,
        page,
        limit,
        totalPages,
      },
    };
  } catch (error) {
    // BusinessError'ları direkt re-throw et
    if (error instanceof BusinessError || error instanceof DatabaseError) {
      throw error;
    }
    
    await logger.error(
      EVENTS.EDITOR.EPISODE_LIST_RETRIEVE_FAILED,
      'Episode listesi getirme hatası',
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        mediaPartId,
        page,
        limit
      },
      userId
    );
    throw new BusinessError('Episode listesi getirme başarısız');
  }
}

// Episode güncelleme
export async function updateEpisodeBusiness(
  id: string,
  data: UpdateEpisodeRequest & { thumbnailImageFile?: File },
  userId: string
): Promise<ApiResponse<UpdateEpisodeResponse>> {
  try {
    const existingEpisode = await findEpisodeByIdDB(id);
    if (!existingEpisode) {
      throw new NotFoundError('Episode bulunamadı');
    }

    // Episode numarası değişiyorsa benzersizlik kontrolü yap
    if (data.episodeNumber && data.episodeNumber !== existingEpisode.episodeNumber) {
      const existingEpisodeWithNumber = await findEpisodeByNumberDB(
        existingEpisode.mediaPartId,
        data.episodeNumber
      );
      if (existingEpisodeWithNumber) {
        throw new BusinessError('Bu episode numarası zaten kullanılıyor');
      }

      // Episode numarası sıralama kontrolü (kendisi hariç)
      const allEpisodes = await findEpisodesByMediaPartIdDB(existingEpisode.mediaPartId, { episodeNumber: 'asc' });
      const otherEpisodes = allEpisodes.filter(ep => ep.id !== id);
      const maxEpisodeNumber = otherEpisodes.length > 0 ? Math.max(...otherEpisodes.map(ep => ep.episodeNumber)) : 0;
      
      if (data.episodeNumber > maxEpisodeNumber + 1) {
        throw new BusinessError(`Episode numarası ${maxEpisodeNumber + 1}'den büyük olamaz`);
      }
    }

    const { thumbnailImageFile, ...formData } = data;
    let uploadResult;
    
    if (thumbnailImageFile) {
      uploadResult = await uploadImage(thumbnailImageFile, IMAGE_TYPES.EPISODE_THUMBNAIL, existingEpisode.mediaPartId);
    }

    const result = await updateEpisodeDB(
      { id },
      {
        ...(formData.episodeNumber && { episodeNumber: formData.episodeNumber }),
        ...(formData.title && { title: formData.title }),
        ...(formData.description !== undefined && { description: formData.description }),
        ...(uploadResult?.thumbnailImage && { thumbnailImage: uploadResult.thumbnailImage.secureUrl }),
        ...(formData.airDate && { airDate: formData.airDate }),
        ...(formData.duration && { duration: formData.duration }),
        ...(formData.isFiller !== undefined && { isFiller: formData.isFiller }),
        ...(formData.fillerNotes !== undefined && { fillerNotes: formData.fillerNotes }),
      }
    );

    await logger.info(
      EVENTS.EDITOR.EPISODE_UPDATED,
      'Episode başarıyla güncellendi',
      { 
        episodeId: result.id,
        mediaPartId: result.mediaPartId,
        episodeNumber: result.episodeNumber,
        hasThumbnail: !!uploadResult?.thumbnailImage
      },
      userId
    );

    return { success: true, data: result };
  } catch (error) {
    // BusinessError'ları direkt re-throw et
    if (error instanceof BusinessError || error instanceof DatabaseError) {
      throw error;
    }
    
    await logger.error(
      EVENTS.EDITOR.EPISODE_UPDATE_FAILED,
      'Episode güncelleme hatası',
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        episodeId: id
      },
      userId
    );
    throw new BusinessError('Episode güncelleme başarısız');
  }
}

// Episode silme
export async function deleteEpisodeBusiness(
  id: string,
  userId: string
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const existingEpisode = await findEpisodeByIdDB(id);
    if (!existingEpisode) {
      throw new NotFoundError('Episode bulunamadı');
    }

    await deleteEpisodeDB({ id });

    // Cloudinary'den thumbnail sil
    await deleteImagesByEntity(id, 'episode');

    await logger.info(
      EVENTS.EDITOR.EPISODE_DELETED,
      'Episode başarıyla silindi',
      { 
        episodeId: id,
        mediaPartId: existingEpisode.mediaPartId,
        episodeNumber: existingEpisode.episodeNumber
      },
      userId
    );

    return { success: true, data: { success: true } };
  } catch (error) {
    // BusinessError'ları direkt re-throw et
    if (error instanceof BusinessError || error instanceof DatabaseError) {
      throw error;
    }
    
    await logger.error(
      EVENTS.EDITOR.EPISODE_DELETE_FAILED,
      'Episode silme hatası',
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        episodeId: id
      },
      userId
    );
    throw new BusinessError('Episode silme başarısız');
  }
} 