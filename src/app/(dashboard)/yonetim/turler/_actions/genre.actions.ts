'use server';

import { createGenreSchema, type CreateGenreInput } from '@/lib/schemas/genre.schema';
import { updateGenreSchema, type UpdateGenreInput } from '@/lib/schemas/genre.schema';
import { createGenreBusiness, updateGenreBusiness, deleteGenreBusiness, getGenresBusiness } from '@/lib/services/business/genre.business';
import { revalidatePath } from 'next/cache';
import { handleServerActionError, type ServerActionResponse } from '@/lib/utils/server-action-error-handler';
import { ROUTES } from '@/lib/constants/routes.constants';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';

export async function getGenres(): Promise<ServerActionResponse> {
  try {
    // Session'dan admin bilgisi al
    const session = await getServerSession(authConfig);
    if (!session?.user) {
      throw new Error('Oturum bulunamadı');
    }

    // Business logic'i kullan
    const result = await getGenresBusiness();

    return {
      success: true,
      data: result.data
    };

  } catch (error) {
    return handleServerActionError(error);
  }
}

export async function createGenre(data: CreateGenreInput): Promise<ServerActionResponse> {
  try {
    // Zod validation
    const validatedData = createGenreSchema.parse(data);

    // Session'dan admin bilgisi al
    const session = await getServerSession(authConfig);
    if (!session?.user) {
      throw new Error('Oturum bulunamadı');
    }

    // Business logic'i kullan
    const result = await createGenreBusiness(validatedData, {
      id: session.user.id,
      username: session.user.username
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

export async function updateGenre(id: string, data: UpdateGenreInput): Promise<ServerActionResponse> {
  try {
    // Zod validation
    const validatedData = updateGenreSchema.parse(data);

    // Session'dan admin bilgisi al
    const session = await getServerSession(authConfig);
    if (!session?.user) {
      throw new Error('Oturum bulunamadı');
    }

    // Business logic'i kullan
    const result = await updateGenreBusiness(id, validatedData, {
      id: session.user.id,
      username: session.user.username
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

export async function deleteGenre(id: string): Promise<ServerActionResponse> {
  try {
    // Session'dan admin bilgisi al
    const session = await getServerSession(authConfig);
    if (!session?.user) {
      throw new Error('Oturum bulunamadı');
    }

    // Business logic'i kullan
    const result = await deleteGenreBusiness(id, {
      id: session.user.id,
      username: session.user.username
    });

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.ADMIN.GENRES);

    return {
      success: true,
      data: result
    };

  } catch (error) {
    return handleServerActionError(error);
  }
} 