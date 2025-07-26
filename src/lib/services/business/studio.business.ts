// Studio iş mantığı katmanı

import { 
  BusinessError, 
  ConflictError, 
  NotFoundError,
  DatabaseError
} from '@/lib/errors';
import { 
  createStudio as createStudioDB, 
  findStudioById, 
  findStudioByName, 
  findStudioBySlug, 
  findAllStudios, 
  updateStudio as updateStudioDB, 
  deleteStudio as deleteStudioDB
} from '@/lib/services/db/studio.db';
import { Prisma } from '@prisma/client';
import { createSlug } from '@/lib/utils/slug.utils';
import { logger } from '@/lib/utils/logger';
import { EVENTS } from '@/lib/constants/events.constants';
import { ApiResponse } from '@/lib/types/api';
import { 
  CreateStudioResponse, 
  GetStudioResponse, 
  GetStudiosResponse, 
  UpdateStudioResponse,
  CreateStudioRequest,
  UpdateStudioRequest,
  GetStudiosRequest
} from '@/lib/types/api/studio.api';

// Studio oluşturma
export async function createStudioBusiness(
  data: CreateStudioRequest,
  userId: string
): Promise<ApiResponse<CreateStudioResponse>> {
  try {
    // Name benzersizlik kontrolü
    const existingStudio = await findStudioByName(data.name);
    if (existingStudio) {
      throw new ConflictError('Bu stüdyo adı zaten kullanımda');
    }

    // Slug oluştur ve benzersizlik kontrolü
    const slug = createSlug(data.name);
    const existingSlug = await findStudioBySlug(slug);
    if (existingSlug) {
      throw new ConflictError('Bu stüdyo adı zaten kullanımda');
    }

    // Studio oluştur
    const result = await createStudioDB({
      name: data.name,
      slug,
      isAnimationStudio: data.isAnimationStudio,
    });

    // Başarılı oluşturma logu
    await logger.info(
      EVENTS.ADMIN.STUDIO_CREATED,
      'Stüdyo başarıyla oluşturuldu',
      { 
        studioId: result.id, 
        name: result.name, 
        slug: result.slug,
        isAnimationStudio: result.isAnimationStudio
      },
      userId
    );

    return {
      success: true,
      data: result
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Stüdyo oluşturma sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', name: data.name },
      userId
    );
    
    throw new BusinessError('Stüdyo oluşturma başarısız');
  }
}

// Stüdyo getirme (ID ile)
export async function getStudioBusiness(
  id: string,
  userId: string
): Promise<ApiResponse<GetStudioResponse>> {
  try {
    const studio = await findStudioById(id);
    if (!studio) {
      throw new NotFoundError('Stüdyo bulunamadı');
    }

    // Başarılı getirme logu
    await logger.info(
      EVENTS.ADMIN.STUDIO_RETRIEVED,
      'Stüdyo detayı görüntülendi',
      { 
        studioId: studio.id, 
        name: studio.name
      },
      userId
    );

    return {
      success: true,
      data: studio
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Stüdyo getirme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', studioId: id },
      userId
    );
    
    throw new BusinessError('Stüdyo getirme başarısız');
  }
}

// Tüm stüdyoları getirme (filtrelemeli)
export async function getStudiosBusiness(
  userId: string,
  filters?: GetStudiosRequest
): Promise<ApiResponse<GetStudiosResponse>> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    // Stüdyoları getir
    let studios = await findAllStudios();
    
    // Filtreleme
    if (filters?.search) {
      studios = studios.filter(studio => 
        studio.name.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (filters?.isAnimationStudio !== undefined) {
      studios = studios.filter(studio => studio.isAnimationStudio === filters.isAnimationStudio);
    }
    
    const total = studios.length;
    const paginatedStudios = studios.slice(skip, skip + limit);
    const totalPages = Math.ceil(total / limit);

    // Başarılı listeleme logu
    await logger.info(
      EVENTS.ADMIN.STUDIOS_RETRIEVED,
      'Stüdyo listesi görüntülendi',
      { 
        total,
        page,
        limit,
        totalPages
      },
      userId
    );

    return {
      success: true,
      data: {
        studios: paginatedStudios,
        total,
        page,
        limit,
        totalPages
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
      'Stüdyo listeleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', filters },
      userId
    );
    
    throw new BusinessError('Stüdyo listeleme başarısız');
  }
}

// Stüdyo güncelleme
export async function updateStudioBusiness(
  id: string, 
  data: UpdateStudioRequest,
  userId: string
): Promise<ApiResponse<UpdateStudioResponse>> {
  try {
    // Stüdyo mevcut mu kontrolü
    const existingStudio = await findStudioById(id);
    if (!existingStudio) {
      throw new NotFoundError('Stüdyo bulunamadı');
    }

    // Name güncelleniyorsa benzersizlik kontrolü
    if (data.name && data.name !== existingStudio.name) {
      const nameExists = await findStudioByName(data.name);
      if (nameExists) {
        throw new ConflictError('Bu stüdyo adı zaten kullanımda');
      }
    }

    // Slug güncelleme ve benzersizlik kontrolü
    const updateData: Prisma.StudioUpdateInput = {};
    if (data.name) {
      const newSlug = createSlug(data.name);
      // Slug değişiyorsa benzersizlik kontrolü
      if (newSlug !== existingStudio.slug) {
        const slugExists = await findStudioBySlug(newSlug);
        if (slugExists) {
          throw new ConflictError('Bu stüdyo adı zaten kullanımda');
        }
      }
      updateData.name = data.name;
      updateData.slug = newSlug;
    }
    if (data.isAnimationStudio !== undefined) updateData.isAnimationStudio = data.isAnimationStudio;

    // Stüdyo güncelle
    const result = await updateStudioDB({ id }, updateData);

    // Başarılı güncelleme logu
    await logger.info(
      EVENTS.ADMIN.STUDIO_UPDATED,
      'Stüdyo başarıyla güncellendi',
      { 
        studioId: result.id, 
        name: result.name, 
        slug: result.slug,
        isAnimationStudio: result.isAnimationStudio,
        oldName: existingStudio.name,
        oldSlug: existingStudio.slug
      },
      userId
    );

    return {
      success: true,
      data: result
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Stüdyo güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', studioId: id, data },
      userId
    );
    
    throw new BusinessError('Stüdyo güncelleme başarısız');
  }
}

// Stüdyo silme
export async function deleteStudioBusiness(
  id: string,
  userId: string
): Promise<ApiResponse<void>> {
  try {
    // Stüdyo mevcut mu kontrolü
    const existingStudio = await findStudioById(id);
    if (!existingStudio) {
      throw new NotFoundError('Stüdyo bulunamadı');
    }

    // Stüdyo sil
    await deleteStudioDB({ id });

    // Başarılı silme logu
    await logger.info(
      EVENTS.ADMIN.STUDIO_DELETED,
      'Stüdyo başarıyla silindi',
      { 
        studioId: id, 
        name: existingStudio.name
      },
      userId
    );

    return {
      success: true
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Stüdyo silme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', studioId: id },
      userId
    );
    
    throw new BusinessError('Stüdyo silme başarısız');
  }
} 