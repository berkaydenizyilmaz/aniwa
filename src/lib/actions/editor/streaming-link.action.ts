'use server';

import { 
  createStreamingLinkSchema, 
  updateStreamingLinkSchema,
  type CreateStreamingLinkInput,
  type UpdateStreamingLinkInput
} from '@/lib/schemas/anime.schema';
import { 
  createStreamingLinkBusiness, 
  getStreamingLinkBusiness,
  getStreamingLinksByEpisodeBusiness,
  getStreamingPlatformsBusiness,
  updateStreamingLinkBusiness, 
  deleteStreamingLinkBusiness
} from '@/lib/services/business/editor/streaming-link.business';
import { revalidatePath } from 'next/cache';
import { handleServerActionError, type ServerActionResponse } from '@/lib/utils/server-action-error-handler';
import { ROUTES } from '@/lib/constants/routes.constants';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';

// Streaming Link oluşturma
export async function createStreamingLinkAction(
  data: CreateStreamingLinkInput
): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {    
    // Zod validation
    const validatedData = createStreamingLinkSchema.parse(data);

    // Business logic'i kullan
    const result = await createStreamingLinkBusiness(validatedData, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.EDITOR.ANIME);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'createStreamingLinkAction',
      userId: session?.user.id
    });
  }
}

// Streaming Link getirme
export async function getStreamingLinkAction(id: string): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Business logic'i kullan
    const result = await getStreamingLinkBusiness(id, session!.user.id);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'getStreamingLinkAction',
      userId: session?.user.id
    });
  }
}

// Episode için streaming link'leri getirme
export async function getStreamingLinksByEpisodeAction(
  episodeId: string,
  page: number = 1,
  limit: number = 50
): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Business logic'i kullan
    const result = await getStreamingLinksByEpisodeBusiness(episodeId, page, limit, session!.user.id);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'getStreamingLinksByEpisodeAction',
      userId: session?.user.id
    });
  }
}

// Streaming Platform'ları getirme
export async function getStreamingPlatformsAction(): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Business logic'i kullan
    const result = await getStreamingPlatformsBusiness(session!.user.id);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'getStreamingPlatformsAction',
      userId: session?.user.id
    });
  }
}

// Streaming Link güncelleme
export async function updateStreamingLinkAction(
  id: string, 
  data: UpdateStreamingLinkInput
): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {    
    // Zod validation
    const validatedData = updateStreamingLinkSchema.parse(data);

    // Business logic'i kullan
    const result = await updateStreamingLinkBusiness(id, validatedData, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.EDITOR.ANIME);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'updateStreamingLinkAction',
      userId: session?.user.id
    });
  }
}

// Streaming Link silme
export async function deleteStreamingLinkAction(id: string): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Business logic'i kullan
    const result = await deleteStreamingLinkBusiness(id, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.EDITOR.ANIME);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'deleteStreamingLinkAction',
      userId: session?.user.id
    });
  }
} 