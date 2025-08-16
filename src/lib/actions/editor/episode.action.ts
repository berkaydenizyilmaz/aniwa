// Episode Server Actions

'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authConfig } from '@/lib/services/auth/auth.config';
import { 
  createEpisodeBusiness, 
  getEpisodeBusiness, 
  getEpisodeListBusiness, 
  updateEpisodeBusiness, 
  deleteEpisodeBusiness 
} from '@/lib/services/business/editor/episode.business';
import { 
  createEpisodeSchema, 
  updateEpisodeSchema,
  type CreateEpisodeInput,
  type UpdateEpisodeInput
} from '@/lib/schemas/anime.schema';
import { handleServerActionError, type ServerActionResponse } from '@/lib/utils/server-action-error-handler';
import { ROUTES } from '@/lib/constants/routes.constants';

// Episode oluşturma
export async function createEpisodeAction(
  data: CreateEpisodeInput
): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Zod validation
    const validatedData = createEpisodeSchema.parse(data);

    // Business logic'i kullan
    const result = await createEpisodeBusiness(validatedData, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.EDITOR.EPISODES);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'createEpisodeAction',
      userId: session?.user.id
    });
  }
}

// Episode getirme
export async function getEpisodeAction(
  id: string
): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Business logic'i kullan
    const result = await getEpisodeBusiness(id, session!.user.id);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'getEpisodeAction',
      userId: session?.user.id
    });
  }
}

// Episode listesi getirme
export async function getEpisodeListAction(
  mediaPartId: string,
  page: number = 1,
  limit: number = 10
): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Business logic'i kullan
    const result = await getEpisodeListBusiness(mediaPartId, page, limit, session!.user.id);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'getEpisodeListAction',
      userId: session?.user.id
    });
  }
}

// Episode güncelleme
export async function updateEpisodeAction(
  id: string,
  data: UpdateEpisodeInput
): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Zod validation
    const validatedData = updateEpisodeSchema.parse(data);

    // Business logic'i kullan
    const result = await updateEpisodeBusiness(id, validatedData, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.EDITOR.EPISODES);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'updateEpisodeAction',
      userId: session?.user.id
    });
  }
}

// Episode silme
export async function deleteEpisodeAction(
  id: string
): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Business logic'i kullan
    const result = await deleteEpisodeBusiness(id, session!.user.id);
    
    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.EDITOR.EPISODES);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'deleteEpisodeAction',
      userId: session?.user.id
    });
  }
} 