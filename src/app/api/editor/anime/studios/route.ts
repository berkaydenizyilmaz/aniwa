import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { getStudiosBusiness } from '@/lib/services/business/studio.business';
import { handleApiError } from '@/lib/utils/api-error-handler';

// Tüm studio'ları getir (anime form için)
export async function GET(request: NextRequest) {
  try {
    // Session'dan editor bilgisi al
    const session = await getServerSession(authConfig);

    // Business logic - tüm studio'ları getir
    const result = await getStudiosBusiness(session!.user.id);

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