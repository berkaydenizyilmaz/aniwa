'use server';

import { animeListFiltersSchema, animeRelationsSchema, type AnimeListFiltersInput, type AnimeRelationsInput } from '@/lib/schemas/anime-list.schema';
import { 
  getAnimesWithFiltersBusiness, 
  getAnimeRelationsBusiness 
} from '@/lib/services/business/anime/anime-list.business';
import { revalidatePath } from 'next/cache';
import { handleServerActionError, type ServerActionResponse } from '@/lib/utils/server-action-error-handler';
import { ROUTES_DOMAIN } from '@/lib/constants';

// Anime listeleme
export async function getAnimes(filters: AnimeListFiltersInput): Promise<ServerActionResponse> {
  try {
    // Zod validation
    const validatedData = animeListFiltersSchema.parse(filters);

    // Business logic'i kullan
    const result = await getAnimesWithFiltersBusiness(validatedData);

    // Cache'i temizle
    revalidatePath(ROUTES_DOMAIN.PAGES.ANIME);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'getAnimes'
    });
  }
}

// Anime ilişkili verilerini getir
export async function getAnimeRelations(data: AnimeRelationsInput): Promise<ServerActionResponse> {
  try {
    // Zod validation
    const validatedData = animeRelationsSchema.parse(data);

    // Business logic'i kullan
    const result = await getAnimeRelationsBusiness(validatedData);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'getAnimeRelations'
    });
  }
}
