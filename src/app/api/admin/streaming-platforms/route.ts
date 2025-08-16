import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/services/auth/auth.config';
import { createStreamingPlatformSchema, streamingPlatformFiltersSchema } from '@/lib/schemas/streamingPlatform.schema';
import { createStreamingPlatformBusiness, getStreamingPlatformsBusiness } from '@/lib/services/business/admin/streaming.business';
import { handleApiError } from '@/lib/utils/api-error-handler';

// Tüm streaming platformları listele (GET)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);

    // Query parametrelerini al
    const { searchParams } = new URL(request.url);
    const filters = {
      search: searchParams.get('search') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '50'),
    };

    // Input validasyonu
    const validatedFilters = streamingPlatformFiltersSchema.parse(filters);

    // Business logic
    const result = await getStreamingPlatformsBusiness(session!.user.id, validatedFilters);

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

// Yeni streaming platform oluştur (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Input validasyonu
    const validatedData = createStreamingPlatformSchema.parse(body);
    
    // Session'dan admin bilgisi al
    const session = await getServerSession(authConfig);

    // Business logic
    const result = await createStreamingPlatformBusiness(validatedData, session!.user.id);
    
    // Başarılı yanıt
    return NextResponse.json(result, { status: 201 });
    
  } catch (error) {
    return handleApiError(error, {
      endpoint: request.url,
      method: 'POST',
      userId: (await getServerSession(authConfig))?.user.id
    });
  }
} 