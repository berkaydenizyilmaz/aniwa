'use server';

import { createTagSchema, updateTagSchema, tagFiltersSchema, type CreateTagInput, type UpdateTagInput, type TagFilters } from '@/lib/schemas/tag.schema';
import { 
  createTagBusiness, 
  getTagsBusiness, 
  getTagBusiness,
  updateTagBusiness, 
  deleteTagBusiness 
} from '@/lib/services/business/admin/tag.business';
import { revalidatePath } from 'next/cache';
import { handleServerActionError, type ServerActionResponse } from '@/lib/utils/server-action-error-handler';
import { ROUTES } from '@/lib/constants/routes.constants';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';

// Tag oluşturma
export async function createTagAction(data: CreateTagInput): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Zod validation
    const validatedData = createTagSchema.parse(data);

    // Business logic'i kullan
    const result = await createTagBusiness(validatedData, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.ADMIN.TAGS);

    return {
      success: true,
      data: result.data
    };
  
  } catch (error) {
    handleServerActionError(error, {
      actionName: 'createTagAction',
      userId: session?.user.id
    });
  }
}

// Tag listesi getirme
export async function getTagsAction(filters?: TagFilters): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Zod validation
    const validatedFilters = filters ? tagFiltersSchema.parse(filters) : undefined;

    // Business logic'i kullan
    const result = await getTagsBusiness(session!.user.id, validatedFilters);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'getTagsAction',
      userId: session?.user.id
    });
  }
}

// Tek tag getirme
export async function getTagAction(id: string): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Business logic'i kullan
    const result = await getTagBusiness(id, session!.user.id);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'getTagAction',
      userId: session?.user.id
    });
  }
}

// Tag güncelleme
export async function updateTagAction(id: string, data: UpdateTagInput): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Zod validation
    const validatedData = updateTagSchema.parse(data);

    // Business logic'i kullan
    const result = await updateTagBusiness(id, validatedData, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.ADMIN.TAGS);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'updateTagAction',
      userId: session?.user.id
    });
  }
}

// Tag silme
export async function deleteTagAction(id: string): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Business logic'i kullan
    const result = await deleteTagBusiness(id, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.ADMIN.TAGS);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'deleteTagAction',
      userId: session?.user.id
    });
  }
} 