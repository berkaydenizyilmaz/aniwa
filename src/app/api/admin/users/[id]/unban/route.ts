import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { unbanUserBusiness } from '@/lib/services/business/user.business';
import { handleApiError } from '@/lib/utils/api-error-handler';

// Kullanıcı ban kaldır (POST)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Session'dan admin bilgisi al
    const session = await getServerSession(authConfig);

    // Business logic
    const result = await unbanUserBusiness(id, {
      id: session!.user.id,
      username: session!.user.username
    });
    
    // Başarılı yanıt
    return NextResponse.json(result);
    
  } catch (error) {
    return handleApiError(error);
  }
} 