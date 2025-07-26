// User iş mantığı katmanı

import { 
  BusinessError, 
  NotFoundError,
  ConflictError
} from '@/lib/errors';
import { 
  findUserById, 
  findUserByUsername,
  findUserByEmail,
  updateUser as updateUserDB,
  deleteUser as deleteUserDB,
  countUsers,
  findAllUsers
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
  adminUser: { id: string; username: string },
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
      findAllUsers(where, skip, limit, { createdAt: 'desc' }),
      countUsers(where)
    ]);

    const totalPages = Math.ceil(total / limit);

    // Başarılı listeleme logu
    await logger.info(
      EVENTS.ADMIN.USERS_RETRIEVED,
      'Kullanıcılar listelendi',
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
        users,
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
      'Kullanıcı listeleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', filters },
      adminUser.id
    );
    
    throw new BusinessError('Kullanıcı listeleme başarısız');
  }
}

// Tek kullanıcı getirme (admin)
export async function getUserBusiness(
  id: string,
  adminUser: { id: string; username: string }
): Promise<ApiResponse<GetUserResponse>> {
  try {
    const user = await findUserById(id);
    if (!user) {
      throw new NotFoundError('Kullanıcı bulunamadı');
    }

    // Başarılı getirme logu
    await logger.info(
      EVENTS.ADMIN.USER_RETRIEVED,
      'Kullanıcı getirildi',
      { 
        userId: user.id,
        username: user.username,
        adminUsername: adminUser.username
      },
      adminUser.id
    );

    return {
      success: true,
      data: user
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Kullanıcı getirme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId: id },
      adminUser.id
    );
    
    throw new BusinessError('Kullanıcı getirme başarısız');
  }
}

// Kullanıcı güncelleme (admin)
export async function updateUserBusiness(
  id: string, 
  data: UpdateUserRequest,
  adminUser: { id: string; username: string }
): Promise<ApiResponse<UpdateUserResponse>> {
  try {
    // Kullanıcı mevcut mu kontrolü
    const existingUser = await findUserById(id);
    if (!existingUser) {
      throw new NotFoundError('Kullanıcı bulunamadı');
    }

    // Username güncelleniyorsa benzersizlik kontrolü
    if (data.username && data.username !== existingUser.username) {
      const usernameExists = await findUserByUsername(data.username);
      if (usernameExists) {
        throw new ConflictError('Bu kullanıcı adı zaten kullanımda');
      }
    }

    // Email güncelleniyorsa benzersizlik kontrolü
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await findUserByEmail(data.email);
      if (emailExists) {
        throw new ConflictError('Bu e-posta adresi zaten kullanımda');
      }
    }

    // Güncelleme verilerini hazırla
    const updateData: Prisma.UserUpdateInput = {};
    if (data.username) {
      updateData.username = data.username;
      updateData.slug = createSlug(data.username);
    }
    if (data.email) updateData.email = data.email;
    if (data.roles) updateData.roles = data.roles as UserRole[];
    if (data.isBanned !== undefined) updateData.isBanned = data.isBanned;

    // Kullanıcı güncelle
    const result = await updateUserDB({ id }, updateData);

    // Başarılı güncelleme logu
    await logger.info(
      EVENTS.ADMIN.USER_UPDATED,
      'Admin kullanıcı güncellemesi yapıldı',
      { 
        userId: result.id, 
        username: result.username, 
        updatedFields: Object.keys(updateData),
        adminId: adminUser.id,
        adminUsername: adminUser.username
      }
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
      'Kullanıcı güncelleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId: id, data }
    );
    
    throw new BusinessError('Kullanıcı güncelleme başarısız');
  }
}

// Kullanıcı banlama (admin)
export async function banUserBusiness(
  id: string,
  adminUser: { id: string; username: string }
): Promise<ApiResponse<UpdateUserResponse>> {
  try {
    // Kullanıcı mevcut mu kontrolü
    const existingUser = await findUserById(id);
    if (!existingUser) {
      throw new NotFoundError('Kullanıcı bulunamadı');
    }

    if (existingUser.isBanned) {
      throw new BusinessError('Kullanıcı zaten yasaklı');
    }

    // Kullanıcıyı banla
    const result = await updateUserDB({ id }, { isBanned: true });

    // Başarılı banlama logu
    await logger.info(
      EVENTS.ADMIN.USER_BANNED,
      'Kullanıcı yasaklandı',
      { 
        userId: result.id, 
        username: result.username,
        adminId: adminUser.id,
        adminUsername: adminUser.username
      }
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
      'Kullanıcı banlama sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId: id }
    );
    
    throw new BusinessError('Kullanıcı banlama başarısız');
  }
}

// Kullanıcı ban kaldırma (admin)
export async function unbanUserBusiness(
  id: string,
  adminUser: { id: string; username: string }
): Promise<ApiResponse<UpdateUserResponse>> {
  try {
    // Kullanıcı mevcut mu kontrolü
    const existingUser = await findUserById(id);
    if (!existingUser) {
      throw new NotFoundError('Kullanıcı bulunamadı');
    }

    if (!existingUser.isBanned) {
      throw new BusinessError('Kullanıcı zaten yasaklı değil');
    }

    // Kullanıcının banını kaldır
    const result = await updateUserDB({ id }, { isBanned: false });

    // Başarılı ban kaldırma logu
    await logger.info(
      EVENTS.ADMIN.USER_UNBANNED,
      'Kullanıcı yasağı kaldırıldı',
      { 
        userId: result.id, 
        username: result.username,
        adminId: adminUser.id,
        adminUsername: adminUser.username
      }
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
      'Kullanıcı ban kaldırma sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId: id }
    );
    
    throw new BusinessError('Kullanıcı ban kaldırma başarısız');
  }
}

// Kullanıcı silme (admin)
export async function deleteUserBusiness(
  id: string,
  adminUser: { id: string; username: string }
): Promise<ApiResponse<void>> {
  try {
    // Kullanıcı mevcut mu kontrolü
    const existingUser = await findUserById(id);
    if (!existingUser) {
      throw new NotFoundError('Kullanıcı bulunamadı');
    }

    // Kullanıcıyı sil
    await deleteUserDB({ id });

    // Başarılı silme logu
    await logger.info(
      EVENTS.ADMIN.USER_DELETED,
      'Kullanıcı silindi',
      { 
        userId: id, 
        username: existingUser.username,
        adminId: adminUser.id,
        adminUsername: adminUser.username
      }
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
      'Kullanıcı silme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', userId: id }
    );
    
    throw new BusinessError('Kullanıcı silme başarısız');
  }
} 