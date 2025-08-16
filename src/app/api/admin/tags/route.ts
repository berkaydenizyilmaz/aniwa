import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/services/auth/auth.config';
import { createTagSchema, tagFiltersSchema } from '@/lib/schemas/tag.schema';
import { createTagBusiness, getTagsBusiness } from '@/lib/services/business/admin/tag.business';
import { handleApiError } from '@/lib/utils/api-error-handler';

// Tüm tag'leri listele (GET)
export async function GET(request: NextRequest) {
  try {
    // Session'dan admin bilgisi al
    const session = await getServerSession(authConfig);

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
    const result = await getTagsBusiness(session!.user.id, validatedFilters);

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

// Yeni tag oluştur (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Input validasyonu
    const validatedData = createTagSchema.parse(body);
    
    // Session'dan admin bilgisi al
    const session = await getServerSession(authConfig);
    
    // Business logic
    const result = await createTagBusiness(validatedData, session!.user.id);
    
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