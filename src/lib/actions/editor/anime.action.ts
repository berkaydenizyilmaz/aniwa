'use server';

import { createAnimeSeriesSchema, updateAnimeSeriesSchema, animeSeriesFiltersSchema, type CreateAnimeSeriesInput, type UpdateAnimeSeriesInput, type AnimeSeriesFilters } from '@/lib/schemas/anime.schema';
import { 
  createAnimeSeriesBusiness, 
  getAllAnimeSeriesBusiness, 
  getAnimeDetailsByIdBusiness,
  updateAnimeSeriesBusiness, 
  deleteAnimeSeriesBusiness 
} from '@/lib/services/business/anime.business';
import { revalidatePath } from 'next/cache';
import { handleServerActionError, type ServerActionResponse } from '@/lib/utils/server-action-error-handler';
import { ROUTES } from '@/lib/constants/routes.constants';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';

// Anime serisi oluşturma
export async function createAnimeSeriesAction(data: CreateAnimeSeriesInput): Promise<ServerActionResponse> {
  try {
    // Zod validation
    const validatedData = createAnimeSeriesSchema.parse(data);

    // Session'dan user bilgisini al
    const session = await getServerSession(authConfig);

    // Business logic'i kullan
    const result = await createAnimeSeriesBusiness(validatedData, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.EDITOR.ANIME);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'createAnimeSeriesAction',
      userId: (await getServerSession(authConfig))?.user.id
    });
  }
}

// Anime serisi listesi getirme
export async function getAnimeSeriesAction(filters?: AnimeSeriesFilters): Promise<ServerActionResponse> {
  try {
    // Zod validation
    const validatedFilters = filters ? animeSeriesFiltersSchema.parse(filters) : undefined;

    // Session'dan user bilgisini al
    const session = await getServerSession(authConfig);

    // Business logic'i kullan
    const result = await getAllAnimeSeriesBusiness(validatedFilters, { id: session!.user.id });

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'getAnimeSeriesAction',
      userId: (await getServerSession(authConfig))?.user.id
    });
  }
}

// Tek anime serisi getirme
export async function getAnimeSeriesByIdAction(id: string): Promise<ServerActionResponse> {
  try {
    // Session'dan user bilgisini al
    const session = await getServerSession(authConfig);

    // Business logic'i kullan
    const result = await getAnimeDetailsByIdBusiness(id, { id: session!.user.id });

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'getAnimeSeriesByIdAction',
      userId: (await getServerSession(authConfig))?.user.id
    });
  }
}

// Anime serisi güncelleme
export async function updateAnimeSeriesAction(id: string, data: UpdateAnimeSeriesInput): Promise<ServerActionResponse> {
  try {
    // Zod validation
    const validatedData = updateAnimeSeriesSchema.parse(data);

    // Session'dan user bilgisini al
    const session = await getServerSession(authConfig);

    // Business logic'i kullan
    const result = await updateAnimeSeriesBusiness(id, validatedData, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.EDITOR.ANIME);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'updateAnimeSeriesAction',
      userId: (await getServerSession(authConfig))?.user.id
    });
  }
}

// Anime serisi silme
export async function deleteAnimeSeriesAction(id: string): Promise<ServerActionResponse> {
  try {
    // Session'dan user bilgisini al
    const session = await getServerSession(authConfig);

    // Business logic'i kullan
    const result = await deleteAnimeSeriesBusiness(id, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.EDITOR.ANIME);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'deleteAnimeSeriesAction',
      userId: (await getServerSession(authConfig))?.user.id
    });
  }
} 