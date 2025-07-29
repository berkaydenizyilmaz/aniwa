// Genre iş mantığı katmanı

import { 
  BusinessError, 
  ConflictError, 
  NotFoundError,
  DatabaseError
} from '@/lib/errors';
import { 
  createGenreDB, 
  findGenreByIdDB, 
  findGenreByNameDB, 
  findGenreBySlugDB, 
  findAllGenresDB, 
  updateGenreDB, 
  deleteGenreDB, 
} from '@/lib/services/db/genre.db';
import { Prisma } from '@prisma/client';
import { createSlug } from '@/lib/utils/slug.utils';
import { logger } from '@/lib/utils/logger';
import { EVENTS } from '@/lib/constants/events.constants';
import { ApiResponse } from '@/lib/types/api';
import { 
  CreateGenreResponse, 
  GetGenreResponse, 
  GetGenresResponse, 
  UpdateGenreResponse,
  CreateGenreRequest,
  UpdateGenreRequest,
  GetGenresRequest
} from '@/lib/types/api/genre.api';

// Genre oluşturma
export async function createGenreBusiness(
  data: CreateGenreRequest,
  userId: string
): Promise<ApiResponse<CreateGenreResponse>> {
  try {
    // Name benzersizlik kontrolü
    const existingGenre = await findGenreByNameDB(data.name);
    if (existingGenre) {
      throw new ConflictError('Bu tür adı zaten kullanımda');
    }

    // Slug oluştur ve benzersizlik kontrolü
    const slug = createSlug(data.name);
    const existingSlug = await findGenreBySlugDB(slug);
    if (existingSlug) {
      throw new ConflictError('Bu tür adı zaten kullanımda');
    }

    // Genre oluştur
    const result = await createGenreDB({
      name: data.name,
      slug,
    });

    // Başarılı oluşturma logu
    await logger.info(
      EVENTS.ADMIN.GENRE_CREATED,
      'Genre başarıyla oluşturuldu',
      { 
        genreId: result.id, 
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
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Genre oluşturma sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', name: data.name },
      userId
    );
    
    throw new BusinessError('Genre oluşturma başarısız');
  }
}

// Genre getirme (ID ile)
export async function getGenreBusiness(
  id: string,
  userId: string
): Promise<ApiResponse<GetGenreResponse>> {
  try {
    const genre = await findGenreByIdDB(id);
    if (!genre) {
      throw new NotFoundError('Genre bulunamadı');
    }

    // Başarılı getirme logu
    await logger.info(
      EVENTS.ADMIN.GENRE_RETRIEVED,
      'Genre başarıyla getirildi',
      { 
        genreId: genre.id, 
        name: genre.name, 
        slug: genre.slug
      },
      userId
    );

    return {
      success: true,
      data: genre
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }

    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Genre getirme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', genreId: id },
      userId
    );
    
    throw new BusinessError('Genre getirme başarısız');
  }
}

// Tüm genre'leri getirme (filtrelemeli)
export async function getGenresBusiness(
  userId: string,
  filters?: GetGenresRequest
): Promise<ApiResponse<GetGenresResponse>> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    // Genre'leri getir
    const genres = await findAllGenresDB();
    
    // Filtreleme (basit implementasyon)
    let filteredGenres = genres;
    if (filters?.search) {
      filteredGenres = filteredGenres.filter(genre => 
        genre.name.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    // Sayfalama
    const total = filteredGenres.length;
    const paginatedGenres = filteredGenres.slice(skip, skip + limit);
    const totalPages = Math.ceil(total / limit);

    // Başarılı listeleme logu
    await logger.info(
      EVENTS.ADMIN.GENRES_RETRIEVED,
      'Genre\'ler listelendi',
      { 
        filters,
        total
      },
      userId
    );

    return {
      success: true,
      data: {
        genres: paginatedGenres,
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
      'Genre listeleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', filters },
      userId
    );
    
    throw new BusinessError('Genre listeleme başarısız');
  }
}

// Genre güncelleme
export async function updateGenreBusiness(
  id: string, 
  data: UpdateGenreRequest,
  userId: string
): Promise<ApiResponse<UpdateGenreResponse>> {
  try {
    // Genre mevcut mu kontrolü
    const existingGenre = await findGenreByIdDB(id);
    if (!existingGenre) {
      throw new NotFoundError('Genre bulunamadı');
    }

    // Name güncelleniyorsa benzersizlik kontrolü
    if (data.name && data.name !== existingGenre.name) {
      const nameExists = await findGenreByNameDB(data.name);
      if (nameExists) {
        throw new ConflictError('Bu tür adı zaten kullanımda');
      }
    }

    // Slug güncelleme ve benzersizlik kontrolü
    const updateData: Prisma.GenreUpdateInput = {};
    if (data.name) {
      const newSlug = createSlug(data.name);
      // Slug değişiyorsa benzersizlik kontrolü
      if (newSlug !== existingGenre.slug) {
        const slugExists = await findGenreBySlugDB(newSlug);
        if (slugExists) {
          throw new ConflictError('Bu tür adı zaten kullanımda');
        }
      }
      updateData.name = data.name;
      updateData.slug = newSlug;
    }

    // Genre güncelle
    const result = await updateGenreDB({ id }, updateData);

    // Başarılı güncelleme logu
    await logger.info(
      EVENTS.ADMIN.GENRE_UPDATED,
      'Genre başarıyla güncellendi',
      { 
        genreId: result.id, 
        name: result.name, 
        slug: result.slug,
        oldName: existingGenre.name,
        oldSlug: existingGenre.slug
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
      'Genre güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', genreId: id, data },
      userId
    );
    
    throw new BusinessError('Genre güncelleme başarısız');
  }
}

// Genre silme
export async function deleteGenreBusiness(
  id: string,
  userId: string
): Promise<ApiResponse<void>> {
  try {
    // Genre mevcut mu kontrolü
    const existingGenre = await findGenreByIdDB(id);
    if (!existingGenre) {
      throw new NotFoundError('Genre bulunamadı');
    }

    // Genre sil
    await deleteGenreDB({ id });

    // Başarılı silme logu
    await logger.info(
      EVENTS.ADMIN.GENRE_DELETED,
      'Genre başarıyla silindi',
      { 
        genreId: existingGenre.id, 
        name: existingGenre.name, 
        slug: existingGenre.slug
      },
      userId
    );

    return { success: true };
  } catch (error) {
    if (error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Genre silme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', genreId: id },
      userId
    );
    
    throw new BusinessError('Genre silme başarısız');
  }
} 