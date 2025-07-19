import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { createTagSchema, tagFiltersSchema } from '@/lib/schemas/tag.schema';
import { createTag, getAllTags } from '@/lib/services/business/tag.business';
import { handleApiError } from '@/lib/utils/api-error-handler';

// Tüm tag'leri listele (GET)
export async function GET(request: NextRequest) {
  try {
    // Query parametrelerini al
    const { searchParams } = new URL(request.url);
    const filters = {
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      isAdult: searchParams.get('isAdult') ? searchParams.get('isAdult') === 'true' : undefined,
      isSpoiler: searchParams.get('isSpoiler') ? searchParams.get('isSpoiler') === 'true' : undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '50'),
    };

    // Input validasyonu
    const validatedFilters = tagFiltersSchema.parse(filters);

    // Business logic
    const result = await getAllTags(validatedFilters);

    // Başarılı yanıt
    return NextResponse.json(result);

  } catch (error) {
    return handleApiError(error);
  }
}

// Yeni tag oluştur (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Input validasyonu
    const validatedData = createTagSchema.parse(body);
    
    // Session'dan admin bilgisi al
    const session = await getServerSession(authConfig);
    
    // Business logic
    const result = await createTag(validatedData, {
      id: session!.user.id,
      username: session!.user.username
    });
    
    // Başarılı yanıt
    return NextResponse.json(result, { status: 201 });
    
  } catch (error) {
    return handleApiError(error);
  }
} 