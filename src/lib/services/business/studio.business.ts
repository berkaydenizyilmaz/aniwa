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
export async function createStudioBusiness(
  data: CreateStudioRequest,
  adminUser: { id: string; username: string }
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
        isAnimationStudio: result.isAnimationStudio,
        adminUsername: adminUser.username
      },
      adminUser.id
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
      'Stüdyo oluşturma sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', name: data.name },
      adminUser.id
    );
    
    throw new BusinessError('Stüdyo oluşturma başarısız');
  }
}

// Stüdyo getirme (ID ile)
export async function getStudioBusiness(
  id: string,
  adminUser: { id: string; username: string }
): Promise<ApiResponse<GetStudioResponse>> {
  try {
    const studio = await findStudioById(id);
    if (!studio) {
      throw new NotFoundError('Stüdyo bulunamadı');
    }

    // Başarılı getirme logu
    await logger.info(
      EVENTS.ADMIN.STUDIO_RETRIEVED,
      'Stüdyo başarıyla getirildi',
      { 
        studioId: studio.id, 
        name: studio.name, 
        slug: studio.slug,
        isAnimationStudio: studio.isAnimationStudio,
        adminUsername: adminUser.username
      },
      adminUser.id
    );

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
      'Stüdyo getirme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', studioId: id },
      adminUser.id
    );
    
    throw new BusinessError('Stüdyo getirme başarısız');
  }
}

// Tüm stüdyoları getirme (filtrelemeli)
export async function getStudiosBusiness(
  adminUser: { id: string; username: string },
  filters?: GetStudiosRequest
): Promise<ApiResponse<GetStudiosResponse>> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    // Stüdyoları getir
    const studios = await findAllStudios();
    
    // Filtreleme (basit implementasyon)
    let filteredStudios = studios;
    if (filters?.search) {
      filteredStudios = filteredStudios.filter(studio => 
        studio.name.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (filters?.isAnimationStudio !== undefined) {
      filteredStudios = filteredStudios.filter(studio => 
        studio.isAnimationStudio === filters.isAnimationStudio
      );
    }

    // Sayfalama
    const total = filteredStudios.length;
    const paginatedStudios = filteredStudios.slice(skip, skip + limit);
    const totalPages = Math.ceil(total / limit);

    // Başarılı listeleme logu
    await logger.info(
      EVENTS.ADMIN.STUDIOS_RETRIEVED,
      'Stüdyolar listelendi',
      { 
        adminUsername: adminUser.username,
        filters,
        total
      },
      adminUser.id
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
    if (error instanceof BusinessError) {
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Stüdyo listeleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', filters },
      adminUser.id
    );
    
    throw new BusinessError('Stüdyo listeleme başarısız');
  }
}

// Stüdyo güncelleme
export async function updateStudioBusiness(
  id: string, 
  data: UpdateStudioRequest,
  adminUser: { id: string; username: string }
): Promise<ApiResponse<UpdateStudioResponse>> {
  try {
    // Stüdyo mevcut mu kontrolü
    const existingStudio = await findStudioById(id);
    if (!existingStudio) {
      throw new NotFoundError('Stüdyo bulunamadı');
    }

    // Slug benzersizlik kontrolü (eğer isim değiştiyse)
    if (data.name && data.name !== existingStudio.name) {
      const slug = createSlug(data.name);
      const existingSlug = await findStudioBySlug(slug);
      if (existingSlug && existingSlug.id !== id) {
        throw new ConflictError('Bu stüdyo adı zaten kullanımda');
      }
    }

    // Güncelleme verilerini hazırla
    const updateData: Prisma.StudioUpdateInput = {};
    if (data.name) {
      updateData.name = data.name;
      updateData.slug = createSlug(data.name);
    }
    if (data.isAnimationStudio !== undefined) {
      updateData.isAnimationStudio = data.isAnimationStudio;
    }

    // Stüdyoyu güncelle
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
        adminUsername: adminUser.username
      },
      adminUser.id
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
      'Stüdyo güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', studioId: id, data },
      adminUser.id
    );
    
    throw new BusinessError('Stüdyo güncelleme başarısız');
  }
}

// Stüdyo silme
export async function deleteStudioBusiness(
  id: string,
  adminUser: { id: string; username: string }
): Promise<ApiResponse<void>> {
  try {
    // Stüdyo mevcut mu kontrolü
    const existingStudio = await findStudioById(id);
    if (!existingStudio) {
      throw new NotFoundError('Stüdyo bulunamadı');
    }

    // Stüdyoyu sil
    await deleteStudioDB({ id });

    // Başarılı silme logu
    await logger.info(
      EVENTS.ADMIN.STUDIO_DELETED,
      'Stüdyo başarıyla silindi',
      { 
        studioId: existingStudio.id, 
        name: existingStudio.name, 
        slug: existingStudio.slug,
        isAnimationStudio: existingStudio.isAnimationStudio,
        adminUsername: adminUser.username
      },
      adminUser.id
    );

    return { success: true };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Stüdyo silme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', studioId: id },
      adminUser.id
    );
    
    throw new BusinessError('Stüdyo silme başarısız');
  }
} 