import { NextRequest, NextResponse } from 'next/server';
import { createStudioSchema, studioFiltersSchema } from '@/lib/schemas/studio.schema';
import { createStudio, getAllStudios } from '@/lib/services/business/studio.business';
import { handleApiError } from '@/lib/utils/api-error-handler';

// Tüm studio'ları listele (GET)
export async function GET(request: NextRequest) {
  try {
    // Query parametrelerini al
    const { searchParams } = new URL(request.url);
    const filters = {
      search: searchParams.get('search') || undefined,
      isAnimationStudio: searchParams.get('isAnimationStudio') ? searchParams.get('isAnimationStudio') === 'true' : undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '50'),
    };

    // Input validasyonu
    const validatedFilters = studioFiltersSchema.parse(filters);

    // Business logic
    const result = await getAllStudios(validatedFilters);

    // Başarılı yanıt
    return NextResponse.json(result);

  } catch (error) {
    return handleApiError(error);
  }
}

// Yeni studio oluştur (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Input validasyonu
    const validatedData = createStudioSchema.parse(body);
    
    // Business logic
    const result = await createStudio(validatedData);
    
    // Başarılı yanıt
    return NextResponse.json(result, { status: 201 });
    
  } catch (error) {
    return handleApiError(error);
  }
} 