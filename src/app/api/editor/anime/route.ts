import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { createAnimeSeriesSchema, animeSeriesFiltersSchema } from '@/lib/schemas/anime.schema';
import { createAnimeSeriesBusiness, getAllAnimeSeriesBusiness } from '@/lib/services/business/anime.business';
import { handleApiError } from '@/lib/utils/api-error-handler';

// Tüm anime serilerini listele (GET)
export async function GET(request: NextRequest) {
  try {
    // Session'dan editor bilgisi al
    const session = await getServerSession(authConfig);

    // Query parametrelerini al
    const { searchParams } = new URL(request.url);
    const filters = {
      search: searchParams.get('search') || undefined,
      type: searchParams.get('type') || undefined,
      status: searchParams.get('status') || undefined,
      season: searchParams.get('season') || undefined,
      seasonYear: searchParams.get('seasonYear') ? parseInt(searchParams.get('seasonYear')!) : undefined,
      source: searchParams.get('source') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '50'),
    };

    // Input validasyonu
    const validatedFilters = animeSeriesFiltersSchema.parse(filters);

    // Business logic
    const result = await getAllAnimeSeriesBusiness(validatedFilters, {
      id: session!.user.id,
      userSettings: { displayAdultContent: true } // Editor tüm içeriği görebilir
    });

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

// Yeni anime serisi oluştur (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Input validasyonu
    const validatedData = createAnimeSeriesSchema.parse(body);
    
    // Session'dan editor bilgisi al
    const session = await getServerSession(authConfig);

    // Business logic
    const result = await createAnimeSeriesBusiness(validatedData, session!.user.id);
    
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