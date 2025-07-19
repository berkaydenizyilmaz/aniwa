import { NextRequest, NextResponse } from 'next/server';
import { userFiltersSchema } from '@/lib/schemas/user.schema';
import { getAllUsers } from '@/lib/services/business/user.business';
import { handleApiError } from '@/lib/utils/api-error-handler';

// Tüm kullanıcıları listele (GET)
export async function GET(request: NextRequest) {
  try {
    // Query parametrelerini al
    const { searchParams } = new URL(request.url);
    const filters = {
      search: searchParams.get('search') || undefined,
      role: searchParams.get('role') || undefined,
      isBanned: searchParams.get('isBanned') ? 
        searchParams.get('isBanned') === 'true' : undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '50'),
    };

    // Input validasyonu
    const validatedFilters = userFiltersSchema.parse(filters);

    // Business logic
    const result = await getAllUsers(validatedFilters);

    // Başarılı yanıt
    return NextResponse.json(result);

  } catch (error) {
    return handleApiError(error);
  }
} 