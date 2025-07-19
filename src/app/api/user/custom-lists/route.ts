import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { getUserCustomLists, createCustomList } from '@/lib/services/business/customList.business';
import { handleApiError } from '@/lib/utils/api-error-handler';
import { createCustomListSchema, customListFiltersSchema } from '@/lib/schemas/customList.schema';

// Kullanıcının özel listelerini getir (GET)
export async function GET(request: NextRequest) {
  try {
    // Session'dan kullanıcı bilgisi al
    const session = await getServerSession(authConfig);

    // Query parametrelerini al
    const { searchParams } = new URL(request.url);
    const filters = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '50'),
    };

    // Input validasyonu
    const validatedFilters = customListFiltersSchema.parse(filters);

    // Business logic
    const result = await getUserCustomLists(session!.user.id, validatedFilters);

    // Başarılı yanıt
    return NextResponse.json(result);

  } catch (error) {
    return handleApiError(error);
  }
}

// Yeni özel liste oluştur (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Input validasyonu
    const validatedData = createCustomListSchema.parse(body);
    
    // Session'dan kullanıcı bilgisi al
    const session = await getServerSession(authConfig);

    // Business logic
    const result = await createCustomList(session!.user.id, validatedData, {
      id: session!.user.id,
      username: session!.user.username
    });
    
    // Başarılı yanıt
    return NextResponse.json(result, { status: 201 });
    
  } catch (error) {
    return handleApiError(error);
  }
} 