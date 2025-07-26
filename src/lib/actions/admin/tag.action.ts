'use server';

import { createTagSchema, updateTagSchema, tagFiltersSchema, type CreateTagInput, type UpdateTagInput, type TagFilters } from '@/lib/schemas/tag.schema';
import { 
  createTagBusiness, 
  getTagsBusiness, 
  getTagBusiness,
  updateTagBusiness, 
  deleteTagBusiness 
} from '@/lib/services/business/tag.business';
import { revalidatePath } from 'next/cache';
import { handleServerActionError, type ServerActionResponse } from '@/lib/utils/server-action-error-handler';
import { ROUTES } from '@/lib/constants/routes.constants';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';

// Tag oluşturma
export async function createTagAction(data: CreateTagInput): Promise<ServerActionResponse> {
  try {
    // Zod validation
    const validatedData = createTagSchema.parse(data);

    // Session'dan user bilgisini al
    const session = await getServerSession(authConfig);

    // Business logic'i kullan
    const result = await createTagBusiness(validatedData, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.ADMIN.TAGS);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error);
  }
}

// Tag listesi getirme
export async function getTagsAction(filters?: TagFilters): Promise<ServerActionResponse> {
  try {
    // Zod validation
    const validatedFilters = filters ? tagFiltersSchema.parse(filters) : undefined;

    // Session'dan user bilgisini al
    const session = await getServerSession(authConfig);

    // Business logic'i kullan
    const result = await getTagsBusiness({
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

// Tek tag getirme
export async function getTagAction(id: string): Promise<ServerActionResponse> {
  try {
    // Session'dan user bilgisini al
    const session = await getServerSession(authConfig);

    // Business logic'i kullan
    const result = await getTagBusiness(id, {
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

// Tag güncelleme
export async function updateTagAction(id: string, data: UpdateTagInput): Promise<ServerActionResponse> {
  try {
    // Zod validation
    const validatedData = updateTagSchema.parse(data);

    // Session'dan user bilgisini al
    const session = await getServerSession(authConfig);

    // Business logic'i kullan
    const result = await updateTagBusiness(id, validatedData, {
      id: session!.user.id,
      username: session!.user.username
    });

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.ADMIN.TAGS);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error);
  }
}

// Tag silme
export async function deleteTagAction(id: string): Promise<ServerActionResponse> {
  try {
    // Session'dan user bilgisini al
    const session = await getServerSession(authConfig);

    // Business logic'i kullan
    const result = await deleteTagBusiness(id, {
      id: session!.user.id,
      username: session!.user.username
    });

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.ADMIN.TAGS);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error);
  }
} 