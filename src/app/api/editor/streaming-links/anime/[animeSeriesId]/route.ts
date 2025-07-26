import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { updateStreamingLinksSchema } from '@/lib/schemas/streamingLink.schema';
import { updateAnimeStreamingLinksBusiness } from '@/lib/services/business/streamingLink.business';
import { handleApiError } from '@/lib/utils/api-error-handler';

// Anime serisi streaming linklerini güncelle (PUT) - Editör erişimi
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ animeSeriesId: string }> }
) {
  try {
    const { animeSeriesId } = await params;
    const body = await request.json();
    
    // Input validasyonu
    const validatedData = updateStreamingLinksSchema.parse(body);
    
    // Session'dan kullanıcı bilgisi al
    const session = await getServerSession(authConfig);
    
    // Business logic
    const result = await updateAnimeStreamingLinksBusiness(animeSeriesId, validatedData, session!.user.id);
    
    // Başarılı yanıt
    return NextResponse.json(result);
    
  } catch (error) {
    return handleApiError(error, {
      endpoint: request.url,
      method: 'PUT',
      userId: (await getServerSession(authConfig))?.user.id
    });
  }
} 