'use server';

import { createStudioSchema, updateStudioSchema, studioFiltersSchema, type CreateStudioInput, type UpdateStudioInput, type StudioFilters } from '@/lib/schemas/studio.schema';
import { 
  createStudioBusiness, 
  getStudiosBusiness, 
  getStudioBusiness,
  updateStudioBusiness, 
  deleteStudioBusiness 
} from '@/lib/services/business/admin/studio.business';
import { revalidatePath } from 'next/cache';
import { handleServerActionError, type ServerActionResponse } from '@/lib/utils/server-action-error-handler';
import { ROUTES_DOMAIN } from '@/lib/constants';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/services/auth/auth.config';

// Studio oluşturma
export async function createStudioAction(data: CreateStudioInput): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Zod validation
    const validatedData = createStudioSchema.parse(data);

    // Business logic'i kullan
    const result = await createStudioBusiness(validatedData, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES_DOMAIN.PAGES.ADMIN.STUDIOS);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'createStudioAction',
      userId: session?.user.id
    });
  }
}

// Studio listesi getirme
export async function getStudiosAction(filters?: StudioFilters): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Zod validation
    const validatedFilters = filters ? studioFiltersSchema.parse(filters) : undefined;

    // Business logic'i kullan
    const result = await getStudiosBusiness(session!.user.id, validatedFilters);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'getStudiosAction',
      userId: session?.user.id
    });
  }
}

// Tek studio getirme
export async function getStudioAction(id: string): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Business logic'i kullan
    const result = await getStudioBusiness(id, session!.user.id);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'getStudioAction',
      userId: session?.user.id
    });
  }
}

// Studio güncelleme
export async function updateStudioAction(id: string, data: UpdateStudioInput): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Zod validation
    const validatedData = updateStudioSchema.parse(data);

    // Business logic'i kullan
    const result = await updateStudioBusiness(id, validatedData, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES_DOMAIN.PAGES.ADMIN.STUDIOS);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'updateStudioAction',
      userId: session?.user.id
    });
  }
}

// Studio silme
export async function deleteStudioAction(id: string): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Business logic'i kullan
    await deleteStudioBusiness(id, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES_DOMAIN.PAGES.ADMIN.STUDIOS);

    return {
      success: true,
      data: null
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'deleteStudioAction',
      userId: session?.user.id
    });
  }
} 