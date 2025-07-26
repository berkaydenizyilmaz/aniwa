import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { createGenreSchema, genreFiltersSchema } from '@/lib/schemas/genre.schema';
import { createGenreBusiness, getGenresBusiness } from '@/lib/services/business/genre.business';
import { handleApiError } from '@/lib/utils/api-error-handler';

// Tüm genre'leri listele (GET)
export async function GET(request: NextRequest) {
  try {
    // Session'dan admin bilgisi al
    const session = await getServerSession(authConfig);

    // Query parametrelerini al
    const { searchParams } = new URL(request.url);
    const filters = {
      search: searchParams.get('search') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '50'),
    };

    // Input validasyonu
    const validatedFilters = genreFiltersSchema.parse(filters);

    // Business logic
    const result = await getGenresBusiness(session!.user.id, validatedFilters);

    // Başarılı yanıt
    return NextResponse.json(result);

  } catch (error) {
    return handleApiError(error);
  }
}

// Yeni genre oluştur (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Input validasyonu
    const validatedData = createGenreSchema.parse(body);
    
    // Session'dan admin bilgisi al
    const session = await getServerSession(authConfig);

    // Business logic
    const result = await createGenreBusiness(validatedData, session!.user.id);
    
    // Başarılı yanıt
    return NextResponse.json(result, { status: 201 });
    
  } catch (error) {
    return handleApiError(error);
  }
} 