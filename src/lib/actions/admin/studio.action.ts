'use server';

import { createStudioSchema, updateStudioSchema, studioFiltersSchema, type CreateStudioInput, type UpdateStudioInput, type StudioFilters } from '@/lib/schemas/studio.schema';
import { 
  createStudioBusiness, 
  getStudiosBusiness, 
  getStudioBusiness,
  updateStudioBusiness, 
  deleteStudioBusiness 
} from '@/lib/services/business/studio.business';
import { revalidatePath } from 'next/cache';
import { handleServerActionError, type ServerActionResponse } from '@/lib/utils/server-action-error-handler';
import { ROUTES } from '@/lib/constants/routes.constants';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';

// Studio oluşturma
export async function createStudioAction(data: CreateStudioInput): Promise<ServerActionResponse> {
  try {
    // Zod validation
    const validatedData = createStudioSchema.parse(data);

    // Session'dan user bilgisini al
    const session = await getServerSession(authConfig);

    // Business logic'i kullan
    const result = await createStudioBusiness(validatedData, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.ADMIN.STUDIOS);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error);
  }
}

// Studio listesi getirme
export async function getStudiosAction(filters?: StudioFilters): Promise<ServerActionResponse> {
  try {
    // Zod validation
    const validatedFilters = filters ? studioFiltersSchema.parse(filters) : undefined;

    // Session'dan user bilgisini al
    const session = await getServerSession(authConfig);

    // Business logic'i kullan
    const result = await getStudiosBusiness(session!.user.id, validatedFilters);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error);
  }
}

// Tek studio getirme
export async function getStudioAction(id: string): Promise<ServerActionResponse> {
  try {
    // Session'dan user bilgisini al
    const session = await getServerSession(authConfig);

    // Business logic'i kullan
    const result = await getStudioBusiness(id, session!.user.id);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error);
  }
}

// Studio güncelleme
export async function updateStudioAction(id: string, data: UpdateStudioInput): Promise<ServerActionResponse> {
  try {
    // Zod validation
    const validatedData = updateStudioSchema.parse(data);

    // Session'dan user bilgisini al
    const session = await getServerSession(authConfig);

    // Business logic'i kullan
    const result = await updateStudioBusiness(id, validatedData, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.ADMIN.STUDIOS);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error);
  }
}

// Studio silme
export async function deleteStudioAction(id: string): Promise<ServerActionResponse> {
  try {
    // Session'dan user bilgisini al
    const session = await getServerSession(authConfig);

    // Business logic'i kullan
    await deleteStudioBusiness(id, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.ADMIN.STUDIOS);

    return {
      success: true,
      data: null
    };

  } catch (error) {
    return handleServerActionError(error);
  }
} 