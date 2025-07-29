'use server';

import { 
  createAnimeMediaPartSchema, 
  updateAnimeMediaPartSchema, 
  type CreateAnimeMediaPartInput, 
  type UpdateAnimeMediaPartInput
} from '@/lib/schemas/anime.schema';
import { 
  createAnimeMediaPartBusiness, 
  getAnimeMediaPartBusiness,
  updateAnimeMediaPartBusiness, 
  deleteAnimeMediaPartBusiness 
} from '@/lib/services/business/editor/anime-media-part.business';
import { revalidatePath } from 'next/cache';
import { handleServerActionError, type ServerActionResponse } from '@/lib/utils/server-action-error-handler';
import { ROUTES } from '@/lib/constants/routes.constants';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';

// Anime media part oluşturma
export async function createAnimeMediaPartAction(
  data: CreateAnimeMediaPartInput,
  coverImage?: Buffer,
  bannerImage?: Buffer
): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Zod validation
    const validatedData = createAnimeMediaPartSchema.parse(data);

    // Business logic'i kullan
    const result = await createAnimeMediaPartBusiness(validatedData, session!.user.id, coverImage, bannerImage);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.EDITOR.ANIME);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'createAnimeMediaPartAction',
      userId: session?.user.id
    });
  }
}

// Tek anime media part getirme
export async function getAnimeMediaPartAction(id: string): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Business logic'i kullan
    const result = await getAnimeMediaPartBusiness(id, session!.user.id);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'getAnimeMediaPartAction',
      userId: session?.user.id
    });
  }
}

// Anime media part güncelleme
export async function updateAnimeMediaPartAction(
  id: string, 
  data: UpdateAnimeMediaPartInput,
  coverImage?: Buffer,
  bannerImage?: Buffer
): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Zod validation
    const validatedData = updateAnimeMediaPartSchema.parse(data);

    // Business logic'i kullan
    const result = await updateAnimeMediaPartBusiness(id, validatedData, session!.user.id, coverImage, bannerImage);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.EDITOR.ANIME);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'updateAnimeMediaPartAction',
      userId: session?.user.id
    });
  }
}

// Anime media part silme
export async function deleteAnimeMediaPartAction(id: string): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Business logic'i kullan
    await deleteAnimeMediaPartBusiness(id, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.EDITOR.ANIME);

    return {
      success: true,
      data: null
    };

  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'deleteAnimeMediaPartAction',
      userId: session?.user.id
    });
  }
} 