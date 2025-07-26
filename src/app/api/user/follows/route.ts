import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { getUserFollowersBusiness, getUserFollowingBusiness } from '@/lib/services/business/userFollow.business';
import { handleApiError } from '@/lib/utils/api-error-handler';
import { getUserFollowersSchema, getUserFollowingSchema } from '@/lib/schemas/userFollow.schema';

// Kullanıcının takipçilerini getir (GET)
export async function GET(request: NextRequest) {
  try {
    // Session'dan kullanıcı bilgisi al
    const session = await getServerSession(authConfig);

    // Query parametrelerini al
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'followers' veya 'following'
    const filters = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '50'),
    };

    // Input validasyonu
    const validatedFilters = type === 'following' 
      ? getUserFollowingSchema.parse(filters)
      : getUserFollowersSchema.parse(filters);

    // Business logic
    const result = type === 'following'
      ? await getUserFollowingBusiness(session!.user.id, validatedFilters)
      : await getUserFollowersBusiness(session!.user.id, validatedFilters);

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