import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { createAnimeSeriesSchema } from '@/lib/schemas/anime.schema';
import { createAnimeSeriesBusiness } from '@/lib/services/business/anime.business';
import { handleApiError } from '@/lib/utils/api-error-handler';

// POST: Anime serisi oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Input validasyonu
    const validatedData = createAnimeSeriesSchema.parse(body);
    
    // Session'dan admin bilgisi al
    const session = await getServerSession(authConfig);

    // Business logic
    const result = await createAnimeSeriesBusiness(validatedData, session!.user.id);
    
    // Başarılı yanıt
    return NextResponse.json(result, { status: 201 });
    
  } catch (error) {
    return handleApiError(error);
  }
} 