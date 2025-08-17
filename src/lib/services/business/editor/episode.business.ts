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
import { 
  uploadImageBusiness, 
  deleteImageBusiness, 
  createImageUploadContext
} from '@/lib/services/business/shared/image.business';

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
    
    // Önce episode'u oluştur
    const result = await createEpisodeDB({
      mediaPart: { connect: { id: formData.mediaPartId } },
      episodeNumber: formData.episodeNumber,
      title: formData.title,
      description: formData.description,
      thumbnailImage: null,
      airDate: formData.airDate,
      duration: formData.duration,
      isFiller: formData.isFiller,
      fillerNotes: formData.fillerNotes,
    });

    // Image yükleme (episode ID'si ile)
    let thumbnailImageUrl;

    if (thumbnailImageFile) {
      const thumbnailUpload = await uploadImageBusiness(
        createImageUploadContext('episode-thumbnail', result.id, userId),
        thumbnailImageFile,
        userId
      );
      if (thumbnailUpload.success && thumbnailUpload.data) {
        thumbnailImageUrl = thumbnailUpload.data.secureUrl;
        
        // Episode'u thumbnail ile güncelle
        await updateEpisodeDB(
          { id: result.id },
          { thumbnailImage: thumbnailImageUrl }
        );
      }
    }

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
    
    // Image yükleme
    let thumbnailImageUrl = existingEpisode.thumbnailImage;

    if (thumbnailImageFile) {
      const thumbnailUpload = await uploadImageBusiness(
        createImageUploadContext('episode-thumbnail', id, userId),
        thumbnailImageFile,
        userId,
        {
          deleteOld: true,
          oldImageUrl: existingEpisode.thumbnailImage
        }
      );
      if (thumbnailUpload.success && thumbnailUpload.data) {
        thumbnailImageUrl = thumbnailUpload.data.secureUrl;
      }
    }

    const result = await updateEpisodeDB(
      { id },
      {
        ...(formData.episodeNumber && { episodeNumber: formData.episodeNumber }),
        ...(formData.title && { title: formData.title }),
        ...(formData.description !== undefined && { description: formData.description }),
        ...(thumbnailImageUrl && { thumbnailImage: thumbnailImageUrl }),
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

    // Önce görseli sil (varsa)
    if (existingEpisode.thumbnailImage) {
      try {
        await deleteImageBusiness(
          createImageUploadContext('episode-thumbnail', id, userId),
          userId,
          existingEpisode.thumbnailImage
        );
      } catch (imageError) {
        // Image silme hatası episode silmeyi engellemesin, sadece logla
        await logger.warn(
          EVENTS.SYSTEM.IMAGE_DELETE_FAILED,
          'Episode silme sırasında thumbnail silinemedi',
          { 
            episodeId: id,
            thumbnailImage: existingEpisode.thumbnailImage,
            error: imageError instanceof Error ? imageError.message : 'Bilinmeyen hata'
          },
          userId
        );
      }
    }

    // Episode'u sil
    await deleteEpisodeDB({ id });

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