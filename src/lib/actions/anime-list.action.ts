// Anime listeleme server actions

'use server';

import { revalidatePath } from 'next/cache';
import { getAnimeListBusiness, getAnimeFilterOptionsBusiness } from '@/lib/services/business/anime-list.business';
import { handleServerActionError } from '@/lib/utils/server-action-error-handler';
import { AnimeListFilters } from '@/lib/schemas/anime-list.schema';
import { ApiResponse } from '@/lib/types/api';
import { AnimeListResponse, AnimeFilterOptionsResponse } from '@/lib/types/api/anime-list.api';
import { ROUTES_DOMAIN } from '@/lib/constants';

// Anime listesi getirme action'ı
export async function getAnimeListAction(
  filters: AnimeListFilters
): Promise<ApiResponse<AnimeListResponse['data']>> {
  try {
    const result = await getAnimeListBusiness(filters);
    
    // Cache'i temizle (gerekirse)
    revalidatePath(ROUTES_DOMAIN.PAGES.ANIME);
    
    return result;
  } catch (error) {
    return handleServerActionError(
      error,
      { actionName: 'getAnimeList' }
    );
  }
}

// Filtre seçeneklerini getirme action'ı
export async function getAnimeFilterOptionsAction(): Promise<ApiResponse<AnimeFilterOptionsResponse['data']>> {
  try {
    const result = await getAnimeFilterOptionsBusiness();
    
    return result;
  } catch (error) {
    return handleServerActionError(
      error,
      { actionName: 'getAnimeFilterOptions' }
    );
  }
}
