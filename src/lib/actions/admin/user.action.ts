'use server';

import { updateUserSchema, userFiltersSchema, type UpdateUserInput, type UserFilters } from '@/lib/schemas/user.schema';
import { 
  getUsersBusiness, 
  getUserBusiness,
  updateUserBusiness, 
  banUserBusiness,
  unbanUserBusiness,
  deleteUserBusiness 
} from '@/lib/services/business/admin/user.business';
import { revalidatePath } from 'next/cache';
import { handleServerActionError, type ServerActionResponse } from '@/lib/utils/server-action-error-handler';
import { ROUTES } from '@/lib/constants/routes.constants';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';

// Kullanıcı listesi getirme
export async function getUsersAction(filters?: UserFilters): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Zod validation
    const validatedFilters = filters ? userFiltersSchema.parse(filters) : undefined;

    // Business logic'i kullan
    const result = await getUsersBusiness(session!.user.id, validatedFilters);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'getUsersAction',
      userId: session?.user.id
    });
  }
}

// Tek kullanıcı getirme
export async function getUserAction(id: string): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Business logic'i kullan
    const result = await getUserBusiness(id, session!.user.id);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'getUserAction',
      userId: session?.user.id
    });
  }
}

// Kullanıcı güncelleme
export async function updateUserAction(id: string, data: UpdateUserInput): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Zod validation
    const validatedData = updateUserSchema.parse(data);

    // Business logic'i kullan
    const result = await updateUserBusiness(id, validatedData, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.ADMIN.USERS);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'updateUserAction',
      userId: session?.user.id
    });
  }
}

// Kullanıcı banlama
export async function banUserAction(id: string): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Business logic'i kullan
    const result = await banUserBusiness(id, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.ADMIN.USERS);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'banUserAction',
      userId: session?.user.id
    });
  }
}

// Kullanıcı ban kaldırma
export async function unbanUserAction(id: string): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Business logic'i kullan
    const result = await unbanUserBusiness(id, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.ADMIN.USERS);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'unbanUserAction',
      userId: session?.user.id
    });
  }
}

// Kullanıcı silme
export async function deleteUserAction(id: string): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Business logic'i kullan
    await deleteUserBusiness(id, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.ADMIN.USERS);

    return {
      success: true,
      data: null
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'deleteUserAction',
      userId: session?.user.id
    });
  }
} 