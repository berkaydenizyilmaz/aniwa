import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { getTagsBusiness } from '@/lib/services/business/tag.business';
import { handleApiError } from '@/lib/utils/api-error-handler';

// Tüm tag'leri getir (anime form için)
export async function GET(request: NextRequest) {
  try {
    // Session'dan editor bilgisi al
    const session = await getServerSession(authConfig);

    // Business logic - tüm tag'leri getir
    const result = await getTagsBusiness(session!.user.id);

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