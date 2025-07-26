import { NextRequest, NextResponse } from 'next/server';
import { streamingLinkFiltersSchema } from '@/lib/schemas/streamingLink.schema';
import { getAllStreamingLinksBusiness } from '@/lib/services/business/streamingLink.business';
import { handleApiError } from '@/lib/utils/api-error-handler';
import { authConfig } from '@/lib/auth/auth.config';
import { getServerSession } from 'next-auth';

// Tüm streaming linkleri listele (GET) - Editör erişimi
export async function GET(request: NextRequest) {
  try {
    // Query parametrelerini al
    const { searchParams } = new URL(request.url);
    const filters = {
      platformId: searchParams.get('platformId') || undefined,
      animeSeriesId: searchParams.get('animeSeriesId') || undefined,
      animeMediaPartId: searchParams.get('animeMediaPartId') || undefined,
      episodeId: searchParams.get('episodeId') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '50'),
    };

    // Input validasyonu
    const validatedFilters = streamingLinkFiltersSchema.parse(filters);

    // Business logic
    const result = await getAllStreamingLinksBusiness(validatedFilters);

    // Başarılı yanıt
    return NextResponse.json(result);

  } catch (error) {
    return handleApiError(error, {
      endpoint: request.url,
      method: 'GET',
      userId: (await getServerSession(authConfig))?.user.id
    });
  }
} 