'use server';

import { 
  createAnimeSeriesSchema, 
  updateAnimeSeriesSchema, 
  animeFiltersSchema, 
  type CreateAnimeSeriesInput, 
  type UpdateAnimeSeriesInput, 
  type AnimeFilters 
} from '@/lib/schemas/anime.schema';
import { 
  createAnimeSeriesBusiness, 
  getAnimeSeriesListBusiness, 
  getAnimeSeriesBusiness,
  updateAnimeSeriesBusiness, 
  deleteAnimeSeriesBusiness 
} from '@/lib/services/business/editor/anime-series.business';
import { revalidatePath } from 'next/cache';
import { handleServerActionError, type ServerActionResponse } from '@/lib/utils/server-action-error-handler';
import { ROUTES } from '@/lib/constants/routes.constants';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';

// Anime serisi oluşturma
export async function createAnimeSeriesAction(
  data: CreateAnimeSeriesInput,
  coverImage?: Buffer,
  bannerImage?: Buffer
): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Zod validation
    const validatedData = createAnimeSeriesSchema.parse(data);

    // Business logic'i kullan
    const result = await createAnimeSeriesBusiness(validatedData, session!.user.id, coverImage, bannerImage);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.EDITOR.ANIME);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'createAnimeSeriesAction',
      userId: session?.user.id
    });
  }
}

// Anime serileri listesi getirme
export async function getAnimeSeriesListAction(filters?: AnimeFilters): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Zod validation
    const validatedFilters = filters ? animeFiltersSchema.parse(filters) : undefined;

    // Business logic'i kullan
    const result = await getAnimeSeriesListBusiness(session!.user.id, validatedFilters);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'getAnimeSeriesListAction',
      userId: session?.user.id
    });
  }
}

// Tek anime serisi getirme
export async function getAnimeSeriesAction(id: string): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Business logic'i kullan
    const result = await getAnimeSeriesBusiness(id, session!.user.id);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'getAnimeSeriesAction',
      userId: session?.user.id
    });
  }
}

// Anime serisi güncelleme
export async function updateAnimeSeriesAction(
  id: string, 
  data: UpdateAnimeSeriesInput,
  coverImage?: Buffer,
  bannerImage?: Buffer
): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Zod validation
    const validatedData = updateAnimeSeriesSchema.parse(data);

    // Business logic'i kullan
    const result = await updateAnimeSeriesBusiness(id, validatedData, session!.user.id, coverImage, bannerImage);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.EDITOR.ANIME);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'updateAnimeSeriesAction',
      userId: session?.user.id
    });
  }
}

// Anime serisi silme
export async function deleteAnimeSeriesAction(id: string): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Business logic'i kullan
    await deleteAnimeSeriesBusiness(id, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.EDITOR.ANIME);

    return {
      success: true,
      data: null
    };

  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'deleteAnimeSeriesAction',
      userId: session?.user.id
    });
  }
} 