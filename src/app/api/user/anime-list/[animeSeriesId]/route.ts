import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { toggleAnimeInListBusiness } from '@/lib/services/business/userAnimeList.business';
import { handleApiError } from '@/lib/utils/api-error-handler';
import { addAnimeToListSchema } from '@/lib/schemas/userAnimeList.schema';

// Anime listeye ekle/çıkar (POST) - Toggle
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ animeSeriesId: string }> }
) {
  try {
    const { animeSeriesId } = await params;

    // Session'dan kullanıcı bilgisi al
    const session = await getServerSession(authConfig);

    // Request body'yi al ve validasyon yap
    const body = await request.json();
    const validatedData = addAnimeToListSchema.parse(body);

    // Business logic - Toggle
    const result = await toggleAnimeInListBusiness(session!.user.id, { 
      ...validatedData,
      animeSeriesId
    });
    
    // Başarılı yanıt
    return NextResponse.json(result);
    
  } catch (error) {
    return handleApiError(error);
  }
}