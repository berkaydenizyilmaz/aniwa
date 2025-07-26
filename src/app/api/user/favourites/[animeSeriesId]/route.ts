import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { toggleFavouriteAnimeBusiness } from '@/lib/services/business/favouriteAnime.business';
import { handleApiError } from '@/lib/utils/api-error-handler';

// Favori anime ekle/çıkar (POST) - Toggle
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ animeSeriesId: string }> }
) {
  try {
    const { animeSeriesId } = await params;

    // Session'dan kullanıcı bilgisi al
    const session = await getServerSession(authConfig);

    // Business logic
    const result = await toggleFavouriteAnimeBusiness(session!.user.id, { animeSeriesId }, {
      id: session!.user.id,
      username: session!.user.username
    });
    
    // Başarılı yanıt
    return NextResponse.json(result);
    
  } catch (error) {
    return handleApiError(error);
  }
} 