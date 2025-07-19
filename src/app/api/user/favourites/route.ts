import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { getUserFavouriteAnimes } from '@/lib/services/business/favouriteAnime.business';
import { handleApiError } from '@/lib/utils/api-error-handler';
import { favouriteAnimeFiltersSchema } from '@/lib/schemas/favouriteAnime.schema';

// Kullanıcının favori animelerini getir (GET)
export async function GET(request: NextRequest) {
  try {
    // Session'dan kullanıcı bilgisi al
    const session = await getServerSession(authConfig);

    // Query parametrelerini al
    const { searchParams } = new URL(request.url);
    const filters = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '50'),
    };

    // Input validasyonu
    const validatedFilters = favouriteAnimeFiltersSchema.parse(filters);

    // Business logic
    const result = await getUserFavouriteAnimes(session!.user.id, validatedFilters);

    // Başarılı yanıt
    return NextResponse.json(result);

  } catch (error) {
    return handleApiError(error);
  }
} 