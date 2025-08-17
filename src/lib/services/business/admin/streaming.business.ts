// Streaming iş mantığı katmanı

import { BusinessError, NotFoundError, ConflictError, DatabaseError } from '@/lib/errors';
import {
  createStreamingPlatformDB,
  findStreamingPlatformByIdDB,
  findStreamingPlatformByNameDB,
  findAllStreamingPlatformsDB,
  countStreamingPlatformsDB,
  updateStreamingPlatformDB,
  deleteStreamingPlatformDB,
} from '@/lib/services/db/streamingPlatform.db';
import { Prisma } from '@prisma/client';
import { logger } from '@/lib/utils/logger';
import { EVENTS_DOMAIN } from '@/lib/constants';
import { ApiResponse } from '@/lib/types/api';
import {
  CreateStreamingPlatformRequest,
  UpdateStreamingPlatformRequest,
  GetStreamingPlatformsRequest,
  CreateStreamingPlatformResponse,
  GetStreamingPlatformResponse,
  GetStreamingPlatformsResponse,
  UpdateStreamingPlatformResponse,
} from '@/lib/types/api/streamingPlatform.api';

// Streaming platform oluşturma
export async function createStreamingPlatformBusiness(
  data: CreateStreamingPlatformRequest,
  userId: string
): Promise<ApiResponse<CreateStreamingPlatformResponse>> {
  try {
    // Name benzersizlik kontrolü
    const existingPlatform = await findStreamingPlatformByNameDB(data.name);
    if (existingPlatform) {
      throw new ConflictError('Bu platform adı zaten kullanımda');
    }

    // Platform oluştur
    const result = await createStreamingPlatformDB({
      name: data.name,
      baseUrl: data.baseUrl,
    });

    // Başarılı oluşturma logu
    await logger.info(
      EVENTS_DOMAIN.ADMIN.STREAMING_PLATFORM_CREATED,
      'Streaming platform başarıyla oluşturuldu',
      {
        platformId: result.id,
        name: result.name
      },
      userId
    );

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS_DOMAIN.SYSTEM.BUSINESS_ERROR,
      'Streaming platform oluşturma sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        name: data.name
      },
      userId
    );

    throw new BusinessError('Streaming platform oluşturma başarısız');
  }
}

// Streaming platform detayı getirme
export async function getStreamingPlatformBusiness(
  id: string,
  userId: string
): Promise<ApiResponse<GetStreamingPlatformResponse>> {
  try {
    const streamingPlatform = await findStreamingPlatformByIdDB(id);

    if (!streamingPlatform) {
      throw new NotFoundError('Streaming platform bulunamadı');
    }



    return {
      success: true,
      data: streamingPlatform,
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS_DOMAIN.SYSTEM.BUSINESS_ERROR,
      'Streaming platform getirme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        platformId: id
      },
      userId
    );

    throw new BusinessError('Streaming platform getirme başarısız');
  }
}

// Tüm streaming platformları getirme
export async function getStreamingPlatformsBusiness(
  userId: string,
  filters?: GetStreamingPlatformsRequest
): Promise<ApiResponse<GetStreamingPlatformsResponse>> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    // Platformları getir
    const [platforms, total] = await Promise.all([
      findAllStreamingPlatformsDB({}, skip, limit, { createdAt: 'desc' }),
      countStreamingPlatformsDB({}),
    ]);

    const totalPages = Math.ceil(total / limit);



    return {
      success: true,
      data: {
        data: platforms,
        total,
        page,
        limit,
        totalPages,
      },
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS_DOMAIN.SYSTEM.BUSINESS_ERROR,
      'Streaming platform listeleme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        filters
      },
      userId
    );

    throw new BusinessError('Streaming platform listeleme başarısız');
  }
}

// Streaming platform güncelleme
export async function updateStreamingPlatformBusiness(
  id: string,
  data: UpdateStreamingPlatformRequest,
  userId: string
): Promise<ApiResponse<UpdateStreamingPlatformResponse>> {
  try {
    // Platform mevcut mu kontrolü
    const existingPlatform = await findStreamingPlatformByIdDB(id);
    if (!existingPlatform) {
      throw new NotFoundError('Streaming platform bulunamadı');
    }

    // Name güncelleniyorsa benzersizlik kontrolü
    if (data.name && data.name !== existingPlatform.name) {
      const nameExists = await findStreamingPlatformByNameDB(data.name);
      if (nameExists) {
        throw new ConflictError('Bu platform adı zaten kullanımda');
      }
    }

    // Güncelleme verilerini hazırla
    const updateData: Prisma.StreamingPlatformUpdateInput = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.baseUrl !== undefined) updateData.baseUrl = data.baseUrl;

    // Platform güncelle
    const updatedPlatform = await updateStreamingPlatformDB({ id }, updateData);

    // Başarılı güncelleme logu
    await logger.info(
      EVENTS_DOMAIN.ADMIN.STREAMING_PLATFORM_UPDATED,
      'Streaming platform başarıyla güncellendi',
      {
        platformId: updatedPlatform.id,
        name: updatedPlatform.name,
        oldName: existingPlatform.name
      },
      userId
    );

    return {
      success: true,
      data: updatedPlatform,
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS_DOMAIN.SYSTEM.BUSINESS_ERROR,
      'Streaming platform güncelleme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        platformId: id,
        data
      },
      userId
    );

    throw new BusinessError('Streaming platform güncelleme başarısız');
  }
}

// Streaming platform silme
export async function deleteStreamingPlatformBusiness(
  id: string,
  userId: string
): Promise<ApiResponse<{ message: string }>> {
  try {
    // Platform mevcut mu kontrolü
    const existingPlatform = await findStreamingPlatformByIdDB(id);
    if (!existingPlatform) {
      throw new NotFoundError('Streaming platform bulunamadı');
    }

    // Platform sil
    await deleteStreamingPlatformDB({ id });

    // Başarılı silme logu
    await logger.info(
      EVENTS_DOMAIN.ADMIN.STREAMING_PLATFORM_DELETED,
      'Streaming platform başarıyla silindi',
      {
        platformId: id,
        name: existingPlatform.name
      },
      userId
    );

    return {
      success: true,
      data: { message: 'Streaming platform başarıyla silindi' },
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS_DOMAIN.SYSTEM.BUSINESS_ERROR,
      'Streaming platform silme sırasında beklenmedik hata',
      {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        platformId: id
      },
      userId
    );

    throw new BusinessError('Streaming platform silme başarısız');
  }
} 