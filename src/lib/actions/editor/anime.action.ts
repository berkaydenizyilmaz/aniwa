'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { createAnimeSeriesBusiness, getAllAnimeSeriesBusiness, getAnimeSeriesByIdBusiness, updateAnimeSeriesBusiness, deleteAnimeSeriesBusiness } from '@/lib/services/business/anime.business';
import { getGenresBusiness } from '@/lib/services/business/genre.business';
import { getTagsBusiness } from '@/lib/services/business/tag.business';
import { getStudiosBusiness } from '@/lib/services/business/studio.business';
import { createAnimeSeriesSchema, updateAnimeSeriesSchema, type CreateAnimeSeriesInput, type UpdateAnimeSeriesInput, type AnimeSeriesFilters } from '@/lib/schemas/anime.schema';
import { handleServerActionError } from '@/lib/utils/server-action-error-handler';
import { ROUTES } from '@/lib/constants/routes.constants';

// Anime serisi oluştur
export async function createAnimeSeriesAction(data: CreateAnimeSeriesInput) {
  try {
    // Zod validation
    const validatedData = createAnimeSeriesSchema.parse(data);

    // Session kontrolü
    const session = await getServerSession(authConfig);

    // Business logic
    const result = await createAnimeSeriesBusiness(validatedData, session!.user.id);

    // Cache revalidation
    revalidatePath(ROUTES.PAGES.EDITOR.ANIME);

    return result;
  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'createAnimeSeriesAction',
      userId: (await getServerSession(authConfig))?.user.id
    });
  }
}

// Anime serilerini getir (filtreleme ile)
export async function getAnimeSeriesAction(filters: AnimeSeriesFilters) {
  try {
    // Session kontrolü
    const session = await getServerSession(authConfig);

    // Business logic
    const result = await getAllAnimeSeriesBusiness(filters, { 
      id: session!.user.id,
      userSettings: { displayAdultContent: true } // Editor tüm içeriği görebilir
    });

    return result;
  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'getAnimeSeriesAction',
      userId: (await getServerSession(authConfig))?.user.id
    });
  }
}

// Anime serisi detayını getir
export async function getAnimeSeriesByIdAction(id: string) {
  try {
    // Session kontrolü
    const session = await getServerSession(authConfig);

    // Business logic
    const result = await getAnimeSeriesByIdBusiness(id, session!.user.id);

    return result;
  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'getAnimeSeriesByIdAction',
      userId: (await getServerSession(authConfig))?.user.id
    });
  }
}

// Anime serisi güncelle
export async function updateAnimeSeriesAction(id: string, data: UpdateAnimeSeriesInput) {
  try {
    // Zod validation
    const validatedData = updateAnimeSeriesSchema.parse(data);

    // Session kontrolü
    const session = await getServerSession(authConfig);

    // Business logic
    const result = await updateAnimeSeriesBusiness(id, validatedData, session!.user.id);

    // Cache revalidation
    revalidatePath(ROUTES.PAGES.EDITOR.ANIME);

    return result;
  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'updateAnimeSeriesAction',
      userId: (await getServerSession(authConfig))?.user.id
    });
  }
}

// Anime serisi sil
export async function deleteAnimeSeriesAction(id: string) {
  try {
    // Session kontrolü
    const session = await getServerSession(authConfig);

    // Business logic
    await deleteAnimeSeriesBusiness(id, session!.user.id);

    // Cache revalidation
    revalidatePath(ROUTES.PAGES.EDITOR.ANIME);

    return { success: true };
  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'deleteAnimeSeriesAction',
      userId: (await getServerSession(authConfig))?.user.id
    });
  }
}

// Tüm genre'leri getir
export async function getAllGenresAction() {
  try {
    // Session kontrolü
    const session = await getServerSession(authConfig);

    // Business logic
    const result = await getGenresBusiness(session!.user.id);

    return result;
  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'getAllGenresAction',
      userId: (await getServerSession(authConfig))?.user.id
    });
  }
}

// Tüm tag'leri getir
export async function getAllTagsAction() {
  try {
    // Session kontrolü
    const session = await getServerSession(authConfig);

    // Business logic
    const result = await getTagsBusiness(session!.user.id);

    return result;
  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'getAllTagsAction',
      userId: (await getServerSession(authConfig))?.user.id
    });
  }
}

// Tüm studio'ları getir
export async function getAllStudiosAction() {
  try {
    // Session kontrolü
    const session = await getServerSession(authConfig);
    
    // Business logic
    const result = await getStudiosBusiness(session!.user.id);

    return result;
  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'getAllStudiosAction',
      userId: (await getServerSession(authConfig))?.user.id
    });
  }
} 