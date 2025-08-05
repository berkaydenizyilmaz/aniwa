'use server';

import { createGenreSchema, updateGenreSchema, genreFiltersSchema, type CreateGenreInput, type UpdateGenreInput, type GenreFilters } from '@/lib/schemas/genre.schema';
import { 
  createGenreBusiness, 
  getGenresBusiness, 
  getGenreBusiness,
  updateGenreBusiness, 
  deleteGenreBusiness 
} from '@/lib/services/business/admin/genre.business';
import { revalidatePath } from 'next/cache';
import { handleServerActionError, type ServerActionResponse } from '@/lib/utils/server-action-error-handler';
import { ROUTES } from '@/lib/constants/routes.constants';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';

// Genre oluşturma
export async function createGenreAction(data: CreateGenreInput): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Zod validation
    const validatedData = createGenreSchema.parse(data);

    // Business logic'i kullan
    const result = await createGenreBusiness(validatedData, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.ADMIN.GENRES);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'createGenreAction',
      userId: session?.user.id
    });
  }
}

// Genre listesi getirme
export async function getGenresAction(filters?: GenreFilters): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Zod validation
    const validatedFilters = filters ? genreFiltersSchema.parse(filters) : undefined;

    // Business logic'i kullan
    const result = await getGenresBusiness(session!.user.id, validatedFilters);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'getGenresAction',
      userId: session?.user.id
    });
  }
}

// Tek genre getirme
export async function getGenreAction(id: string): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Business logic'i kullan
    const result = await getGenreBusiness(id, session!.user.id);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'getGenreAction',
      userId: session?.user.id
    });
  }
}

// Genre güncelleme
export async function updateGenreAction(id: string, data: UpdateGenreInput): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Zod validation
    const validatedData = updateGenreSchema.parse(data);

    // Business logic'i kullan
    const result = await updateGenreBusiness(id, validatedData, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.ADMIN.GENRES);

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'updateGenreAction',
      userId: session?.user.id
    });
  }
}

// Genre silme
export async function deleteGenreAction(id: string): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);

  try {
    // Business logic'i kullan
    await deleteGenreBusiness(id, session!.user.id);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.ADMIN.GENRES);

    return {
      success: true,
      data: null
    };

  } catch (error) {
    handleServerActionError(error, {
      actionName: 'deleteGenreAction',
      userId: session?.user.id
    });
  }
} 