// User iş mantığı katmanı

import { 
  BusinessError, 
  NotFoundError,
  ConflictError,
  DatabaseError
} from '@/lib/errors';
import { 
  findUserByIdDB, 
  findUserByUsernameDB,
  findUserByEmailDB,
  updateUserDB,
  deleteUserDB,
  countUsersDB,
  findAllUsersDB
} from '@/lib/services/db/user.db';
import { Prisma, UserRole } from '@prisma/client';
import { createSlug } from '@/lib/utils/slug.utils';
import { logger } from '@/lib/utils/logger';
import { EVENTS } from '@/lib/constants/events.constants';
import { ApiResponse } from '@/lib/types/api';
import { 
  GetUsersResponse, 
  GetUserResponse, 
  UpdateUserResponse,
  GetUsersRequest,
  UpdateUserRequest
} from '@/lib/types/api/user.api';

// Tüm kullanıcıları getirme (admin - filtrelemeli)
export async function getUsersBusiness(
  userId: string,
  filters?: GetUsersRequest
): Promise<ApiResponse<GetUsersResponse>> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    // Filtreleme koşulları
    const where: Prisma.UserWhereInput = {};
    
    if (filters?.search) {
      where.OR = [
        { username: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    if (filters?.role) {
      where.roles = { has: filters.role as UserRole };
    }

    if (filters?.isBanned !== undefined) {
      where.isBanned = filters.isBanned;
    }

    // Kullanıcıları getir
    const [users, total] = await Promise.all([
      findAllUsersDB(where, skip, limit, { createdAt: 'desc' }),
      countUsersDB(where)
    ]);

    const totalPages = Math.ceil(total / limit);

    // Başarılı listeleme logu
    await logger.info(
      EVENTS.ADMIN.USERS_RETRIEVED,
      'Kullanıcı listesi görüntülendi',
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
        users,
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
      'Kullanıcı listeleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', filters },
      userId
    );
    
    throw new BusinessError('Kullanıcı listeleme başarısız');
  }
}

// Kullanıcı getirme (ID ile)
export async function getUserBusiness(
  id: string,
  userId: string
): Promise<ApiResponse<GetUserResponse>> {
  try {
    const user = await findUserByIdDB(id);
    if (!user) {
      throw new NotFoundError('Kullanıcı bulunamadı');
    }

    // Başarılı getirme logu
    await logger.info(
      EVENTS.ADMIN.USER_RETRIEVED,
      'Kullanıcı detayı görüntülendi',
      { 
        userId: user.id, 
        username: user.username
      },
      userId
    );

    return {
      success: true,
      data: user
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Kullanıcı getirme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId: id },
      userId
    );
    
    throw new BusinessError('Kullanıcı getirme başarısız');
  }
}

// Kullanıcı güncelleme
export async function updateUserBusiness(
  id: string, 
  data: UpdateUserRequest,
  userId: string
): Promise<ApiResponse<UpdateUserResponse>> {
  try {
    // Kullanıcı mevcut mu kontrolü
    const existingUser = await findUserByIdDB(id);
    if (!existingUser) {
      throw new NotFoundError('Kullanıcı bulunamadı');
    }

    // Username güncelleniyorsa benzersizlik kontrolü
    if (data.username && data.username !== existingUser.username) {
      const usernameExists = await findUserByUsernameDB(data.username);
      if (usernameExists) {
        throw new ConflictError('Bu kullanıcı adı zaten kullanımda');
      }
    }

    // Email güncelleniyorsa benzersizlik kontrolü
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await findUserByEmailDB(data.email);
      if (emailExists) {
        throw new ConflictError('Bu e-posta adresi zaten kullanımda');
      }
    }

    // Slug güncelleme
    const updateData: Prisma.UserUpdateInput = {};
    if (data.username) {
      updateData.username = data.username;
      updateData.slug = createSlug(data.username);
    }
    if (data.email !== undefined) updateData.email = data.email;
    if (data.roles !== undefined) updateData.roles = data.roles;
    if (data.isBanned !== undefined) updateData.isBanned = data.isBanned;

    // Kullanıcı güncelle
    const result = await updateUserDB({ id }, updateData);

    // Başarılı güncelleme logu
    await logger.info(
      EVENTS.ADMIN.USER_UPDATED,
      'Kullanıcı başarıyla güncellendi',
      { 
        userId: result.id, 
        username: result.username,
        oldUsername: existingUser.username
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
      'Kullanıcı güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId: id, data },
      userId
    );
    
    throw new BusinessError('Kullanıcı güncelleme başarısız');
  }
}

// Kullanıcı yasaklama
export async function banUserBusiness(
  id: string,
  userId: string
): Promise<ApiResponse<UpdateUserResponse>> {
  try {
    // Kullanıcı mevcut mu kontrolü
    const existingUser = await findUserByIdDB(id);
    if (!existingUser) {
      throw new NotFoundError('Kullanıcı bulunamadı');
    }

    if (existingUser.isBanned) {
      throw new ConflictError('Kullanıcı zaten yasaklı');
    }

    // Kullanıcıyı yasakla
    const result = await updateUserDB({ id }, { isBanned: true });

    // Başarılı yasaklama logu
    await logger.info(
      EVENTS.ADMIN.USER_BANNED,
      'Kullanıcı başarıyla yasaklandı',
      { 
        userId: result.id, 
        username: result.username
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
      'Kullanıcı yasaklama sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId: id },
      userId
    );
    
    throw new BusinessError('Kullanıcı yasaklama başarısız');
  }
}

// Kullanıcı yasağını kaldırma
export async function unbanUserBusiness(
  id: string,
  userId: string
): Promise<ApiResponse<UpdateUserResponse>> {
  try {
    // Kullanıcı mevcut mu kontrolü
    const existingUser = await findUserByIdDB(id);
    if (!existingUser) {
      throw new NotFoundError('Kullanıcı bulunamadı');
    }

    if (!existingUser.isBanned) {
      throw new ConflictError('Kullanıcı zaten yasaklı değil');
    }

    // Kullanıcı yasağını kaldır
    const result = await updateUserDB({ id }, { isBanned: false });

    // Başarılı yasak kaldırma logu
    await logger.info(
      EVENTS.ADMIN.USER_UNBANNED,
      'Kullanıcı yasağı başarıyla kaldırıldı',
      { 
        userId: result.id, 
        username: result.username
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
      'Kullanıcı yasak kaldırma sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId: id },
      userId
    );
    
    throw new BusinessError('Kullanıcı yasak kaldırma başarısız');
  }
}

// Kullanıcı silme
export async function deleteUserBusiness(
  id: string,
  userId: string
): Promise<ApiResponse<void>> {
  try {
    // Kullanıcı mevcut mu kontrolü
    const existingUser = await findUserByIdDB(id);
    if (!existingUser) {
      throw new NotFoundError('Kullanıcı bulunamadı');
    }

    // Admin kendini silmeye çalışıyor mu kontrolü
    if (id === userId) {
      throw new ConflictError('Kendinizi silemezsiniz');
    }

    // Kullanıcı sil
    await deleteUserDB({ id });

    // Başarılı silme logu
    await logger.info(
      EVENTS.ADMIN.USER_DELETED,
      'Kullanıcı başarıyla silindi',
      { 
        userId: id, 
        username: existingUser.username
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
      'Kullanıcı silme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId: id },
      userId
    );
    
    throw new BusinessError('Kullanıcı silme başarısız');
  }
} 