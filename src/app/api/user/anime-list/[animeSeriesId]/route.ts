import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { addAnimeToList, removeAnimeFromList } from '@/lib/services/business/userAnimeList.business';
import { findUserAnimeListByUserAndAnime } from '@/lib/services/db/userAnimeList.db';
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

    // Business logic - Anime zaten listede mi kontrol et
    const existingList = await findUserAnimeListByUserAndAnime(session!.user.id, animeSeriesId);
    
    let result;
    if (existingList) {
      // Anime listede varsa çıkar
      result = await removeAnimeFromList(session!.user.id, animeSeriesId, {
        id: session!.user.id,
        username: session!.user.username
      });
    } else {
      // Anime listede yoksa ekle
      result = await addAnimeToList(session!.user.id, validatedData, {
        id: session!.user.id,
        username: session!.user.username
      });
    }
    
    // Başarılı yanıt
    return NextResponse.json(result);
    
  } catch (error) {
    return handleApiError(error);
  }
}