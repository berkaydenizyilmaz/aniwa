import { NextRequest, NextResponse } from 'next/server';
import { userFiltersSchema } from '@/lib/schemas/user.schema';
import { getUsersBusiness } from '@/lib/services/business/admin/user.business';
import { handleApiError } from '@/lib/utils/api-error-handler';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';

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

    // Session'dan admin bilgisi al
    const session = await getServerSession(authConfig);

    // Business logic
    const result = await getUsersBusiness(session!.user.id, validatedFilters);

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