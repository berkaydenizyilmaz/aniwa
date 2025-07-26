'use server';

import { updateUserSchema, userFiltersSchema, type UpdateUserInput, type UserFilters } from '@/lib/schemas/user.schema';
import { 
  getUsersBusiness, 
  getUserBusiness,
  updateUserBusiness, 
  banUserBusiness,
  unbanUserBusiness,
  deleteUserBusiness 
} from '@/lib/services/business/user.business';
import { revalidatePath } from 'next/cache';
import { handleServerActionError, type ServerActionResponse } from '@/lib/utils/server-action-error-handler';
import { ROUTES } from '@/lib/constants/routes.constants';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';

// Kullanıcı listesi getirme
export async function getUsersAction(filters?: UserFilters): Promise<ServerActionResponse> {
  try {
    // Zod validation
    const validatedFilters = filters ? userFiltersSchema.parse(filters) : undefined;

    // Session'dan user bilgisini al
    const session = await getServerSession(authConfig);

    // Business logic'i kullan
    const result = await getUsersBusiness({
      id: session!.user.id,
      username: session!.user.username
    }, validatedFilters);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error);
  }
}

// Tek kullanıcı getirme
export async function getUserAction(id: string): Promise<ServerActionResponse> {
  try {
    // Session'dan user bilgisini al
    const session = await getServerSession(authConfig);

    // Business logic'i kullan
    const result = await getUserBusiness(id, {
      id: session!.user.id,
      username: session!.user.username
    });

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error);
  }
}

// Kullanıcı güncelleme
export async function updateUserAction(id: string, data: UpdateUserInput): Promise<ServerActionResponse> {
  try {
    // Zod validation
    const validatedData = updateUserSchema.parse(data);

    // Session'dan user bilgisini al
    const session = await getServerSession(authConfig);

    // Business logic'i kullan
    const result = await updateUserBusiness(id, validatedData, {
      id: session!.user.id,
      username: session!.user.username
    });

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.ADMIN.USERS);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error);
  }
}

// Kullanıcı banlama
export async function banUserAction(id: string): Promise<ServerActionResponse> {
  try {
    // Session'dan user bilgisini al
    const session = await getServerSession(authConfig);

    // Business logic'i kullan
    const result = await banUserBusiness(id, {
      id: session!.user.id,
      username: session!.user.username
    });

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.ADMIN.USERS);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error);
  }
}

// Kullanıcı ban kaldırma
export async function unbanUserAction(id: string): Promise<ServerActionResponse> {
  try {
    // Session'dan user bilgisini al
    const session = await getServerSession(authConfig);

    // Business logic'i kullan
    const result = await unbanUserBusiness(id, {
      id: session!.user.id,
      username: session!.user.username
    });

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.ADMIN.USERS);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error);
  }
}

// Kullanıcı silme
export async function deleteUserAction(id: string): Promise<ServerActionResponse> {
  try {
    // Session'dan user bilgisini al
    const session = await getServerSession(authConfig);

    // Business logic'i kullan
    await deleteUserBusiness(id, {
      id: session!.user.id,
      username: session!.user.username
    });

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.ADMIN.USERS);

    return {
      success: true,
      data: null
    };

  } catch (error) {
    return handleServerActionError(error);
  }
} 