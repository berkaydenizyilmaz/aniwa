// Streaming Link business logic

import { 
  createStreamingLinkDB, 
  findStreamingLinkByIdDB, 
  findStreamingLinksByEpisodeIdDB, 
  updateStreamingLinkDB, 
  deleteStreamingLinkDB,
  countStreamingLinksDB
} from '@/lib/services/db/streamingLink.db';
import { findEpisodeByIdDB } from '@/lib/services/db/episode.db';
import { findStreamingPlatformByIdDB, findAllStreamingPlatformsDB } from '@/lib/services/db/streamingPlatform.db';
import { 
  CreateStreamingLinkRequest, 
  UpdateStreamingLinkRequest,
  GetStreamingLinksResponse,
  GetStreamingLinkResponse,
  CreateStreamingLinkResponse,
  UpdateStreamingLinkResponse,
  GetStreamingPlatformsResponse
} from '@/lib/types/api/anime.api';
import { ApiResponse } from '@/lib/types/api/index';
import { BusinessError, NotFoundError } from '@/lib/errors';
import { logger } from '@/lib/utils/logger';
import { EVENTS } from '@/lib/constants/events.constants';
import { StreamingLink } from '@prisma/client';

// Streaming Link oluşturma
export async function createStreamingLinkBusiness(
  data: CreateStreamingLinkRequest,
  userId: string
): Promise<ApiResponse<CreateStreamingLinkResponse>> {
  try {
    // Episode'ın var olduğunu kontrol et
    const episode = await findEpisodeByIdDB(data.episodeId);
    if (!episode) {
      throw new NotFoundError('Episode bulunamadı');
    }

    // Platform'un var olduğunu kontrol et
    const platform = await findStreamingPlatformByIdDB(data.platformId);
    if (!platform) {
      throw new NotFoundError('Streaming platform bulunamadı');
    }

    const result = await createStreamingLinkDB({
      platform: { connect: { id: data.platformId } },
      episode: { connect: { id: data.episodeId } },
      url: data.url,
    });

    // Başarılı oluşturma logu
    await logger.info(
      EVENTS.EDITOR.STREAMING_LINK_CREATED,
      'Streaming link başarıyla oluşturuldu',
      { 
        streamingLinkId: result.id,
        episodeId: result.episodeId,
        platformId: result.platformId,
        url: result.url
      },
      userId
    );

    return { success: true, data: result };
  } catch (error) {
    if (!(error instanceof BusinessError)) {
      throw error;
    }
    
    await logger.error(
      EVENTS.EDITOR.STREAMING_LINK_CREATE_FAILED,
      'Streaming link oluşturma hatası',
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        episodeId: data.episodeId,
        platformId: data.platformId,
        url: data.url
      },
      userId
    );
    throw new BusinessError('Streaming link oluşturma başarısız');
  }
}

// Streaming Link getirme
export async function getStreamingLinkBusiness(
  id: string,
  userId: string
): Promise<ApiResponse<GetStreamingLinkResponse>> {
  try {
    const streamingLink = await findStreamingLinkByIdDB(id, {
      platform: true,
      episode: true
    });
    if (!streamingLink) {
      throw new NotFoundError('Streaming link bulunamadı');
    }

    await logger.info(
      EVENTS.EDITOR.STREAMING_LINK_RETRIEVED,
      'Streaming link başarıyla getirildi',
      { 
        streamingLinkId: streamingLink.id,
        episodeId: streamingLink.episodeId
      },
      userId
    );

    return { success: true, data: streamingLink };
  } catch (error) {
    if (!(error instanceof BusinessError)) {
      throw error;
    }
    
    await logger.error(
      EVENTS.EDITOR.STREAMING_LINK_RETRIEVE_FAILED,
      'Streaming link getirme hatası',
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        streamingLinkId: id
      },
      userId
    );
    throw new BusinessError('Streaming link getirme hatası');
  }
}

// Episode için streaming link'leri getirme
export async function getStreamingLinksByEpisodeBusiness(
  episodeId: string,
  page: number = 1,
  limit: number = 50,
  userId: string
): Promise<ApiResponse<GetStreamingLinksResponse>> {
  try {
    // Episode'ın var olduğunu kontrol et
    const episode = await findEpisodeByIdDB(episodeId);
    if (!episode) {
      throw new NotFoundError('Episode bulunamadı');
    }
    
    const [streamingLinks, total] = await Promise.all([
      findStreamingLinksByEpisodeIdDB(episodeId, { createdAt: 'desc' }, { platform: true }),
      countStreamingLinksDB({ episodeId }),
    ]);

    // Tip güvenliği için platform ilişkisini kontrol et
    const streamingLinksWithPlatform = streamingLinks as Array<StreamingLink & { platform: { name: string; id: string; createdAt: Date; updatedAt: Date; baseUrl: string; } }>;

    const totalPages = Math.ceil(total / limit);

    await logger.info(
      EVENTS.EDITOR.STREAMING_LINKS_RETRIEVED,
      'Episode streaming link\'leri başarıyla getirildi',
      { 
        episodeId,
        count: streamingLinks.length,
        total,
        page,
        limit
      },
      userId
    );

    return {
      success: true,
      data: {
        streamingLinks: streamingLinksWithPlatform,
        total,
        page,
        limit,
        totalPages,
      },
    };
  } catch (error) {
    if (!(error instanceof BusinessError)) {
      throw error;
    }
    
    await logger.error(
      EVENTS.EDITOR.STREAMING_LINKS_RETRIEVE_FAILED,
      'Episode streaming link\'leri getirme hatası',
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        episodeId,
        page,
        limit
      },
      userId
    );
    throw new BusinessError('Episode streaming link\'leri getirme hatası');
  }
}

// Streaming Platform'ları getirme
export async function getStreamingPlatformsBusiness(
  userId: string
): Promise<ApiResponse<GetStreamingPlatformsResponse>> {
  try {
    const platforms = await findAllStreamingPlatformsDB();
    
    await logger.info(
      EVENTS.EDITOR.STREAMING_PLATFORMS_RETRIEVED,
      'Streaming platform\'ları başarıyla getirildi',
      { 
        count: platforms.length
      },
      userId
    );

    return {
      success: true,
      data: {
        platforms,
      },
    };
  } catch (error) {
    if (!(error instanceof BusinessError)) {
      throw error;
    }
    
    await logger.error(
      EVENTS.EDITOR.STREAMING_PLATFORMS_RETRIEVE_FAILED,
      'Streaming platform\'ları getirme hatası',
      { 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      userId
    );
    throw new BusinessError('Streaming platform\'ları getirme hatası');
  }
}

// Streaming Link güncelleme
export async function updateStreamingLinkBusiness(
  id: string,
  data: UpdateStreamingLinkRequest,
  userId: string
): Promise<ApiResponse<UpdateStreamingLinkResponse>> {
  try {
    const existingLink = await findStreamingLinkByIdDB(id);
    if (!existingLink) {
      throw new NotFoundError('Streaming link bulunamadı');
    }

    // Platform değişiyorsa var olduğunu kontrol et
    if (data.platformId && data.platformId !== existingLink.platformId) {
      const platform = await findStreamingPlatformByIdDB(data.platformId);
      if (!platform) {
        throw new NotFoundError('Streaming platform bulunamadı');
      }
    }

    const result = await updateStreamingLinkDB(
      { id },
      {
        ...(data.platformId && { platform: { connect: { id: data.platformId } } }),
        ...(data.url && { url: data.url }),
      }
    );

    await logger.info(
      EVENTS.EDITOR.STREAMING_LINK_UPDATED,
      'Streaming link başarıyla güncellendi',
      { 
        streamingLinkId: result.id,
        episodeId: result.episodeId,
        platformId: result.platformId,
        url: result.url
      },
      userId
    );

    return { success: true, data: result };
  } catch (error) {
    if (!(error instanceof BusinessError)) {
      throw error;
    }
    
    await logger.error(
      EVENTS.EDITOR.STREAMING_LINK_UPDATE_FAILED,
      'Streaming link güncelleme hatası',
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        streamingLinkId: id
      },
      userId
    );
    throw new BusinessError('Streaming link güncelleme hatası');
  }
}

// Streaming Link silme
export async function deleteStreamingLinkBusiness(
  id: string,
  userId: string
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const existingLink = await findStreamingLinkByIdDB(id);
    if (!existingLink) {
      throw new NotFoundError('Streaming link bulunamadı');
    }

    await deleteStreamingLinkDB({ id });

    await logger.info(
      EVENTS.EDITOR.STREAMING_LINK_DELETED,
      'Streaming link başarıyla silindi',
      { 
        streamingLinkId: id,
        episodeId: existingLink.episodeId,
        platformId: existingLink.platformId
      },
      userId
    );

    return { success: true, data: { success: true } };
  } catch (error) {
    if (!(error instanceof BusinessError)) {
      throw error;
    }
    
    await logger.error(
      EVENTS.EDITOR.STREAMING_LINK_DELETE_FAILED,
      'Streaming link silme hatası',
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        streamingLinkId: id
      },
      userId
    );
    throw new BusinessError('Streaming link silme hatası');
  }
} 