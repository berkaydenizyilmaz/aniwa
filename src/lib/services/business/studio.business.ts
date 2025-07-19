// Studio iş mantığı katmanı

import { 
  BusinessError, 
  ConflictError, 
  NotFoundError
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
export async function createStudio(data: CreateStudioRequest): Promise<ApiResponse<CreateStudioResponse>> {
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
      EVENTS.MASTER_DATA.STUDIO_CREATED,
      'Studio başarıyla oluşturuldu',
      { studioId: result.id, name: result.name, slug: result.slug }
    );

    return {
      success: true,
      data: result
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Studio oluşturma sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', name: data.name }
    );
    
    throw new BusinessError('Studio oluşturma başarısız');
  }
}

// Studio getirme (ID ile)
export async function getStudioById(id: string): Promise<ApiResponse<GetStudioResponse>> {
  try {
    const studio = await findStudioById(id);
    if (!studio) {
      throw new NotFoundError('Studio bulunamadı');
    }

    return {
      success: true,
      data: studio
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Studio getirme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', studioId: id }
    );
    
    throw new BusinessError('Studio getirme başarısız');
  }
}

// Tüm studio'ları getirme (filtrelemeli)
export async function getAllStudios(filters?: GetStudiosRequest): Promise<ApiResponse<GetStudiosResponse>> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    // Studio'ları getir
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
    if (error instanceof BusinessError) {
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Studio listeleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', filters }
    );
    
    throw new BusinessError('Studio listeleme başarısız');
  }
}

// Studio güncelleme
export async function updateStudio(
  id: string, 
  data: UpdateStudioRequest
): Promise<ApiResponse<UpdateStudioResponse>> {
  try {
    // Studio mevcut mu kontrolü
    const existingStudio = await findStudioById(id);
    if (!existingStudio) {
      throw new NotFoundError('Studio bulunamadı');
    }

    // Name güncelleniyorsa benzersizlik kontrolü
    if (data.name && data.name !== existingStudio.name) {
      const nameExists = await findStudioByName(data.name);
      if (nameExists) {
        throw new ConflictError('Bu stüdyo adı zaten kullanımda');
      }
    }

    // Slug güncelleme
    const updateData: Prisma.StudioUpdateInput = {};
    if (data.name) {
      updateData.name = data.name;
      updateData.slug = createSlug(data.name);
    }
    if (data.isAnimationStudio !== undefined) updateData.isAnimationStudio = data.isAnimationStudio;

    // Studio güncelle
    const result = await updateStudioDB({ id }, updateData);

    // Başarılı güncelleme logu
    await logger.info(
      EVENTS.MASTER_DATA.STUDIO_UPDATED,
      'Studio başarıyla güncellendi',
      { studioId: result.id, name: result.name, slug: result.slug }
    );

    return {
      success: true,
      data: result
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Studio güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', studioId: id, data }
    );
    
    throw new BusinessError('Studio güncelleme başarısız');
  }
}

// Studio silme
export async function deleteStudio(id: string): Promise<ApiResponse<void>> {
  try {
    // Studio mevcut mu kontrolü
    const existingStudio = await findStudioById(id);
    if (!existingStudio) {
      throw new NotFoundError('Studio bulunamadı');
    }

    // Studio sil
    await deleteStudioDB({ id });

    // Başarılı silme logu
    await logger.info(
      EVENTS.MASTER_DATA.STUDIO_DELETED,
      'Studio başarıyla silindi',
      { studioId: id, name: existingStudio.name }
    );

    return {
      success: true
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Studio silme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', studioId: id }
    );
    
    throw new BusinessError('Studio silme başarısız');
  }
} 