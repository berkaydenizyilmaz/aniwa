// Tag iş mantığı katmanı

import { 
  BusinessError, 
  ConflictError, 
  NotFoundError
} from '@/lib/errors';
import { 
  createTag as createTagDB, 
  findTagById, 
  findTagByName, 
  findTagBySlug, 
  findAllTags, 
  updateTag as updateTagDB, 
  deleteTag as deleteTagDB
} from '@/lib/services/db/tag.db';
import { TagUpdateInput } from '@/lib/types/db/tag';
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
export async function createTag(data: CreateTagRequest): Promise<ApiResponse<CreateTagResponse>> {
  try {
    // Name benzersizlik kontrolü
    const existingTag = await findTagByName(data.name);
    if (existingTag) {
      throw new ConflictError('Bu etiket adı zaten kullanımda');
    }

    // Slug oluştur ve benzersizlik kontrolü
    const slug = createSlug(data.name);
    const existingSlug = await findTagBySlug(slug);
    if (existingSlug) {
      throw new ConflictError('Bu etiket adı zaten kullanımda');
    }

    // Tag oluştur
    const result = await createTagDB({
      name: data.name,
      slug,
      description: data.description,
      category: data.category,
      isAdult: data.isAdult,
      isSpoiler: data.isSpoiler,
    });

    // Başarılı oluşturma logu
    await logger.info(
      EVENTS.MASTER_DATA.TAG_CREATED,
      'Tag başarıyla oluşturuldu',
      { tagId: result.id, name: result.name, slug: result.slug }
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
      'Tag oluşturma sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', name: data.name }
    );
    
    throw new BusinessError('Tag oluşturma başarısız');
  }
}

// Tag getirme (ID ile)
export async function getTagById(id: string): Promise<ApiResponse<GetTagResponse>> {
  try {
    const tag = await findTagById(id);
    if (!tag) {
      throw new NotFoundError('Tag bulunamadı');
    }

    return {
      success: true,
      data: tag
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Tag getirme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', tagId: id }
    );
    
    throw new BusinessError('Tag getirme başarısız');
  }
}

// Tüm tag'leri getirme (filtrelemeli)
export async function getAllTags(filters?: GetTagsRequest): Promise<ApiResponse<GetTagsResponse>> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    // Tag'leri getir
    let tags = await findAllTags();
    
    // Filtreleme
    if (filters?.search) {
      tags = tags.filter(tag => 
        tag.name.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (filters?.category) {
      tags = tags.filter(tag => tag.category === filters.category);
    }

    if (filters?.isAdult !== undefined) {
      tags = tags.filter(tag => tag.isAdult === filters.isAdult);
    }

    if (filters?.isSpoiler !== undefined) {
      tags = tags.filter(tag => tag.isSpoiler === filters.isSpoiler);
    }
    
    const total = tags.length;
    const paginatedTags = tags.slice(skip, skip + limit);
    const totalPages = Math.ceil(total / limit);

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
    if (error instanceof BusinessError) {
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Tag listeleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', filters }
    );
    
    throw new BusinessError('Tag listeleme başarısız');
  }
}

// Tag güncelleme
export async function updateTag(
  id: string, 
  data: UpdateTagRequest
): Promise<ApiResponse<UpdateTagResponse>> {
  try {
    // Tag mevcut mu kontrolü
    const existingTag = await findTagById(id);
    if (!existingTag) {
      throw new NotFoundError('Tag bulunamadı');
    }

    // Name güncelleniyorsa benzersizlik kontrolü
    if (data.name && data.name !== existingTag.name) {
      const nameExists = await findTagByName(data.name);
      if (nameExists) {
        throw new ConflictError('Bu etiket adı zaten kullanımda');
      }
    }

    // Slug güncelleme
    const updateData: TagUpdateInput = {};
    if (data.name) {
      updateData.name = data.name;
      updateData.slug = createSlug(data.name);
    }
    if (data.description !== undefined) updateData.description = data.description;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.isAdult !== undefined) updateData.isAdult = data.isAdult;
    if (data.isSpoiler !== undefined) updateData.isSpoiler = data.isSpoiler;

    // Tag güncelle
    const result = await updateTagDB({ id }, updateData);

    // Başarılı güncelleme logu
    await logger.info(
      EVENTS.MASTER_DATA.TAG_UPDATED,
      'Tag başarıyla güncellendi',
      { tagId: result.id, name: result.name, slug: result.slug }
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
      'Tag güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', tagId: id, data }
    );
    
    throw new BusinessError('Tag güncelleme başarısız');
  }
}

// Tag silme
export async function deleteTag(id: string): Promise<ApiResponse<void>> {
  try {
    // Tag mevcut mu kontrolü
    const existingTag = await findTagById(id);
    if (!existingTag) {
      throw new NotFoundError('Tag bulunamadı');
    }

    // Tag sil
    await deleteTagDB({ id });

    // Başarılı silme logu
    await logger.info(
      EVENTS.MASTER_DATA.TAG_DELETED,
      'Tag başarıyla silindi',
      { tagId: id, name: existingTag.name }
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
      'Tag silme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', tagId: id }
    );
    
    throw new BusinessError('Tag silme başarısız');
  }
} 