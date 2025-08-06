// Tag iş mantığı katmanı

import { 
  BusinessError, 
  ConflictError, 
  NotFoundError,
  DatabaseError
} from '@/lib/errors';
import { 
  createTagDB, 
  findTagByIdDB, 
  findTagByNameDB, 
  findTagBySlugDB, 
  findAllTagsDB, 
  updateTagDB, 
  deleteTagDB
} from '@/lib/services/db/tag.db';
import { Prisma } from '@prisma/client';
import { createSlug } from '@/lib/utils/slug.utils';
import { logger } from '@/lib/utils/logger';
import { EVENTS } from '@/lib/constants/events.constants';
import { ApiResponse } from '@/lib/types/api';
import { 
  CreateTagResponse, 
  GetTagResponse, 
  GetTagsResponse, 
  UpdateTagResponse,
  CreateTagRequest,
  UpdateTagRequest,
  GetTagsRequest
} from '@/lib/types/api/tag.api';

// Tag oluşturma
export async function createTagBusiness(
  data: CreateTagRequest,
  userId: string
): Promise<ApiResponse<CreateTagResponse>> {
  try {
    // Name benzersizlik kontrolü
    const existingTag = await findTagByNameDB(data.name);
    if (existingTag) {
      throw new ConflictError('Bu etiket adı zaten kullanımda');
    }

    // Slug oluştur ve benzersizlik kontrolü
    const slug = createSlug(data.name);
    const existingSlug = await findTagBySlugDB(slug);
    if (existingSlug) {
      throw new ConflictError('Bu etiket adı zaten kullanımda');
    }

    // Tag oluştur
    const result = await createTagDB({
      name: data.name,
      slug,
      description: data.description,
      category: data.category,
      isAdult: data.isAdult ?? false,
      isSpoiler: data.isSpoiler ?? false,
    });

    // Başarılı oluşturma logu
    await logger.info(
      EVENTS.ADMIN.TAG_CREATED,
      'Tag başarıyla oluşturuldu',
      { 
        tagId: result.id, 
        name: result.name, 
        slug: result.slug
      },
      userId
    );

    return {
      success: true,
      data: result
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Tag oluşturma sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', name: data.name },
      userId
    );
    
    throw new BusinessError('Tag oluşturma başarısız');
  }
}

// Tag getirme (ID ile)
export async function getTagBusiness(
  id: string,
  userId: string
): Promise<ApiResponse<GetTagResponse>> {
  try {
    const tag = await findTagByIdDB(id);
    if (!tag) {
      throw new NotFoundError('Tag bulunamadı');
    }

    // Başarılı getirme logu
    await logger.info(
      EVENTS.ADMIN.TAG_RETRIEVED,
      'Tag detayı görüntülendi',
      { 
        tagId: tag.id, 
        name: tag.name
      },
      userId
    );

    return {
      success: true,
      data: tag
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Tag getirme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', tagId: id },
      userId
    );
    
    throw new BusinessError('Tag getirme başarısız');
  }
}

// Tüm tag'leri getirme (filtrelemeli)
export async function getTagsBusiness(
  userId: string,
  filters?: GetTagsRequest
): Promise<ApiResponse<GetTagsResponse>> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    // Tag'leri getir
    let tags = await findAllTagsDB();
    
    // Filtreleme
    if (filters?.search) {
      tags = tags.filter(tag => 
        tag.name.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (filters?.category) {
      tags = tags.filter(tag => tag.category === filters.category);
    }

    // Yetişkin içerik kontrolü - admin için tüm tag'leri göster
    if (filters?.isAdult !== undefined) {
      tags = tags.filter(tag => tag.isAdult === filters.isAdult);
    }

    if (filters?.isSpoiler !== undefined) {
      tags = tags.filter(tag => tag.isSpoiler === filters.isSpoiler);
    }
    
    const total = tags.length;
    const paginatedTags = tags.slice(skip, skip + limit);
    const totalPages = Math.ceil(total / limit);

    // Başarılı listeleme logu
    await logger.info(
      EVENTS.ADMIN.TAGS_RETRIEVED,
      'Tag listesi görüntülendi',
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
        tags: paginatedTags,
        total,
        page,
        limit,
        totalPages
      }
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Tag listeleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', filters },
      userId
    );
    
    throw new BusinessError('Tag listeleme başarısız');
  }
}

// Tag güncelleme
export async function updateTagBusiness(
  id: string, 
  data: UpdateTagRequest,
  userId: string
): Promise<ApiResponse<UpdateTagResponse>> {
  try {
    // Tag mevcut mu kontrolü
    const existingTag = await findTagByIdDB(id);
    if (!existingTag) {
      throw new NotFoundError('Tag bulunamadı');
    }

    // Name güncelleniyorsa benzersizlik kontrolü
    if (data.name && data.name !== existingTag.name) {
      const nameExists = await findTagByNameDB(data.name);
      if (nameExists) {
        throw new ConflictError('Bu etiket adı zaten kullanımda');
      }
    }

    // Slug güncelleme ve benzersizlik kontrolü
    const updateData: Prisma.TagUpdateInput = {};
    if (data.name) {
      const newSlug = createSlug(data.name);
      // Slug değişiyorsa benzersizlik kontrolü
      if (newSlug !== existingTag.slug) {
        const slugExists = await findTagBySlugDB(newSlug);
        if (slugExists) {
          throw new ConflictError('Bu etiket adı zaten kullanımda');
        }
      }
      updateData.name = data.name;
      updateData.slug = newSlug;
    }
    if (data.description !== undefined) updateData.description = data.description;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.isAdult !== undefined) updateData.isAdult = data.isAdult;
    if (data.isSpoiler !== undefined) updateData.isSpoiler = data.isSpoiler;

    // Tag güncelle
    const result = await updateTagDB({ id }, updateData);

    // Başarılı güncelleme logu
    await logger.info(
      EVENTS.ADMIN.TAG_UPDATED,
      'Tag başarıyla güncellendi',
      { 
        tagId: result.id, 
        name: result.name, 
        slug: result.slug,
        oldName: existingTag.name,
        oldSlug: existingTag.slug
      },
      userId
    );

    return {
      success: true,
      data: result
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Tag güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', tagId: id, data },
      userId
    );
    
    throw new BusinessError('Tag güncelleme başarısız');
  }
}

// Tag silme
export async function deleteTagBusiness(
  id: string,
  userId: string
): Promise<ApiResponse<void>> {
  try {
    // Tag mevcut mu kontrolü
    const existingTag = await findTagByIdDB(id);
    if (!existingTag) {
      throw new NotFoundError('Tag bulunamadı');
    }

    // Tag sil
    await deleteTagDB({ id });

    // Başarılı silme logu
    await logger.info(
      EVENTS.ADMIN.TAG_DELETED,
      'Tag başarıyla silindi',
      { 
        tagId: id, 
        name: existingTag.name
      },
      userId
    );

    return {
      success: true
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Tag silme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', tagId: id },
      userId
    );
    
    throw new BusinessError('Tag silme başarısız');
  }
} 