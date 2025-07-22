'use server';

import { createTagSchema, type CreateTagInput } from '@/lib/schemas/tag.schema';
import { updateTagSchema, type UpdateTagInput } from '@/lib/schemas/tag.schema';
import { createTag as createTagBusiness, updateTag as updateTagBusiness, deleteTag as deleteTagBusiness } from '@/lib/services/business/tag.business';
import { revalidatePath } from 'next/cache';
import { handleServerActionError, type ServerActionResponse } from '@/lib/utils/server-action-error-handler';
import { ROUTES } from '@/lib/constants/routes.constants';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';

export async function createTag(data: CreateTagInput): Promise<ServerActionResponse> {
  try {
    // Zod validation
    const validatedData = createTagSchema.parse(data);

    // Session'dan admin bilgisi al
    const session = await getServerSession(authConfig);
    if (!session?.user) {
      throw new Error('Oturum bulunamadı');
    }

    // Business logic'i kullan
    const result = await createTagBusiness(validatedData, {
      id: session.user.id,
      username: session.user.username
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

export async function updateTag(id: string, data: UpdateTagInput): Promise<ServerActionResponse> {
  try {
    // Zod validation
    const validatedData = updateTagSchema.parse(data);

    // Session'dan admin bilgisi al
    const session = await getServerSession(authConfig);
    if (!session?.user) {
      throw new Error('Oturum bulunamadı');
    }

    // Business logic'i kullan
    const result = await updateTagBusiness(id, validatedData, {
      id: session.user.id,
      username: session.user.username
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

export async function deleteTag(id: string): Promise<ServerActionResponse> {
  try {
    // Session'dan admin bilgisi al
    const session = await getServerSession(authConfig);
    if (!session?.user) {
      throw new Error('Oturum bulunamadı');
    }

    // Business logic'i kullan
    const result = await deleteTagBusiness(id, {
      id: session.user.id,
      username: session.user.username
    });

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.ADMIN.TAGS);

    return {
      success: true,
      data: result
    };

  } catch (error) {
    return handleServerActionError(error);
  }
}