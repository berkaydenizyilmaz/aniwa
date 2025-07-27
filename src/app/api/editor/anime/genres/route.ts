import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { getGenresBusiness } from '@/lib/services/business/genre.business';
import { handleApiError } from '@/lib/utils/api-error-handler';

// Tüm genre'leri getir (anime form için)
export async function GET(request: NextRequest) {
  try {
    // Session'dan editor bilgisi al
    const session = await getServerSession(authConfig);

    // Business logic - tüm genre'leri getir
    const result = await getGenresBusiness(session!.user.id);

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