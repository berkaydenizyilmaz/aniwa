'use server';

import { createGenreSchema, updateGenreSchema, genreFiltersSchema, type CreateGenreInput, type UpdateGenreInput, type GenreFilters } from '@/lib/schemas/genre.schema';
import { 
  createGenreBusiness, 
  getGenresBusiness, 
  getGenreBusiness,
  updateGenreBusiness, 
  deleteGenreBusiness 
} from '@/lib/services/business/genre.business';
import { revalidatePath } from 'next/cache';
import { handleServerActionError, type ServerActionResponse } from '@/lib/utils/server-action-error-handler';
import { ROUTES } from '@/lib/constants/routes.constants';
import { auth } from '@/lib/auth/auth';

// Genre oluşturma
export async function createGenreAction(data: CreateGenreInput): Promise<ServerActionResponse> {
  try {
    // Zod validation
    const validatedData = createGenreSchema.parse(data);

    // Session'dan user bilgisini al
    const session = await auth();

    // Business logic'i kullan
    const result = await createGenreBusiness(validatedData, {
      id: session!.user.id,
      username: session!.user.username
    });

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.ADMIN.GENRES);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error);
  }
}

// Genre listesi getirme
export async function getGenresAction(filters?: GenreFilters): Promise<ServerActionResponse> {
  try {
    // Zod validation
    const validatedFilters = filters ? genreFiltersSchema.parse(filters) : undefined;

    // Session'dan user bilgisini al
    const session = await auth();

    // Business logic'i kullan
    const result = await getGenresBusiness({
      id: session!.user.id,
      username: session!.user.username
    }, validatedFilters);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error);
  }
}

// Tek genre getirme
export async function getGenreAction(id: string): Promise<ServerActionResponse> {
  try {
    // Session'dan user bilgisini al
    const session = await auth();

    // Business logic'i kullan
    const result = await getGenreBusiness(id, {
      id: session!.user.id,
      username: session!.user.username
    });

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error);
  }
}

// Genre güncelleme
export async function updateGenreAction(id: string, data: UpdateGenreInput): Promise<ServerActionResponse> {
  try {
    // Zod validation
    const validatedData = updateGenreSchema.parse(data);

    // Session'dan user bilgisini al
    const session = await auth();

    // Business logic'i kullan
    const result = await updateGenreBusiness(id, validatedData, {
      id: session!.user.id,
      username: session!.user.username
    });

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.ADMIN.GENRES);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error);
  }
}

// Genre silme
export async function deleteGenreAction(id: string): Promise<ServerActionResponse> {
  try {
    // Session'dan user bilgisini al
    const session = await auth();

    // Business logic'i kullan
    await deleteGenreBusiness(id, {
      id: session!.user.id,
      username: session!.user.username
    });

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.ADMIN.GENRES);

    return {
      success: true,
      data: null
    };

  } catch (error) {
    return handleServerActionError(error);
  }
} 