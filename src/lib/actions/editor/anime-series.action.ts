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
  deleteAnimeSeriesBusiness,
  getAnimeSeriesRelationsBusiness,  
  getAnimeSeriesWithRelationsBusiness
} from '@/lib/services/business/editor/anime-series.business';
import { revalidatePath } from 'next/cache';
import { handleServerActionError, type ServerActionResponse } from '@/lib/utils/server-action-error-handler';
import { ROUTES_DOMAIN } from '@/lib/constants';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/services/auth/auth.config';

// Anime serisi oluşturma
export async function createAnimeSeriesAction(
  data: CreateAnimeSeriesInput
): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {    
    // Zod validation
    const validatedData = createAnimeSeriesSchema.parse(data);

    // Business logic'i kullan
    const result = await createAnimeSeriesBusiness(validatedData, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES_DOMAIN.PAGES.EDITOR.ANIME);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
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
    handleServerActionError(error, {
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
    handleServerActionError(error, {
      actionName: 'getAnimeSeriesAction',
      userId: session?.user.id
    });
  }
}

// Anime serisi güncelleme
export async function updateAnimeSeriesAction(
  id: string, 
  data: UpdateAnimeSeriesInput
): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);

  try {
    // Zod validation
    const validatedData = updateAnimeSeriesSchema.parse(data);

    // Business logic'i kullan
    const result = await updateAnimeSeriesBusiness(id, validatedData, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES_DOMAIN.PAGES.EDITOR.ANIME);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
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
    revalidatePath(ROUTES_DOMAIN.PAGES.EDITOR.ANIME);

    return {
      success: true,
      data: null
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'deleteAnimeSeriesAction',
      userId: session?.user.id
    });
  }
}

// Anime serisi ilişkilerini getirme (genres, studios, tags)
export async function getAnimeSeriesRelationsAction(): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Business logic'i kullan
    const result = await getAnimeSeriesRelationsBusiness(session!.user.id);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'getAnimeSeriesRelationsAction',
      userId: session?.user.id
    });
  }
}

// Anime serisi getirme (ID ile) - İlişkilerle birlikte
export async function getAnimeSeriesWithRelationsAction(id: string): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Business logic'i kullan
    const result = await getAnimeSeriesWithRelationsBusiness(id, session!.user.id);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'getAnimeSeriesWithRelationsAction',
      userId: session?.user.id
    });
  }
} 