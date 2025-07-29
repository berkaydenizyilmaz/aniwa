'use server';

import { createStreamingPlatformSchema, updateStreamingPlatformSchema, streamingPlatformFiltersSchema, type CreateStreamingPlatformInput, type UpdateStreamingPlatformInput, type StreamingPlatformFilters } from '@/lib/schemas/streamingPlatform.schema';
import { 
  createStreamingPlatformBusiness, 
  getStreamingPlatformsBusiness, 
  getStreamingPlatformBusiness,
  updateStreamingPlatformBusiness, 
  deleteStreamingPlatformBusiness 
} from '@/lib/services/business/admin/streaming.business';
import { revalidatePath } from 'next/cache';
import { handleServerActionError, type ServerActionResponse } from '@/lib/utils/server-action-error-handler';
import { ROUTES } from '@/lib/constants/routes.constants';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';

// Streaming platform oluşturma
export async function createStreamingPlatformAction(data: CreateStreamingPlatformInput): Promise<ServerActionResponse> {
  try {
    // Zod validation
    const validatedData = createStreamingPlatformSchema.parse(data);

    // Session'dan user bilgisini al
    const session = await getServerSession(authConfig);

    // Business logic'i kullan
    const result = await createStreamingPlatformBusiness(validatedData, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.ADMIN.STREAMING_PLATFORMS);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'createStreamingPlatformAction',
      userId: (await getServerSession(authConfig))?.user.id
    });
  }
}

// Streaming platform listesi getirme
export async function getStreamingPlatformsAction(filters?: StreamingPlatformFilters): Promise<ServerActionResponse> {
  try {
    // Zod validation
    const validatedFilters = filters ? streamingPlatformFiltersSchema.parse(filters) : undefined;

    // Session'dan user bilgisini al
    const session = await getServerSession(authConfig);

    // Business logic'i kullan
    const result = await getStreamingPlatformsBusiness(session!.user.id, validatedFilters);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'getStreamingPlatformsAction',
      userId: (await getServerSession(authConfig))?.user.id
    });
  }
}

// Tek streaming platform getirme
export async function getStreamingPlatformAction(id: string): Promise<ServerActionResponse> {
  try {
    // Session'dan user bilgisini al
    const session = await getServerSession(authConfig);

    // Business logic'i kullan
    const result = await getStreamingPlatformBusiness(id, session!.user.id);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'getStreamingPlatformAction',
      userId: (await getServerSession(authConfig))?.user.id
    });
  }
}

// Streaming platform güncelleme
export async function updateStreamingPlatformAction(id: string, data: UpdateStreamingPlatformInput): Promise<ServerActionResponse> {
  try {
    // Zod validation
    const validatedData = updateStreamingPlatformSchema.parse(data);

    // Session'dan user bilgisini al
    const session = await getServerSession(authConfig);

    // Business logic'i kullan
    const result = await updateStreamingPlatformBusiness(id, validatedData, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.ADMIN.STREAMING_PLATFORMS);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'updateStreamingPlatformAction',
      userId: (await getServerSession(authConfig))?.user.id
    });
  }
}

// Streaming platform silme
export async function deleteStreamingPlatformAction(id: string): Promise<ServerActionResponse> {
  try {
    // Session'dan user bilgisini al
    const session = await getServerSession(authConfig);

    // Business logic'i kullan
    const result = await deleteStreamingPlatformBusiness(id, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.ADMIN.STREAMING_PLATFORMS);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'deleteStreamingPlatformAction',
      userId: (await getServerSession(authConfig))?.user.id
    });
  }
} 