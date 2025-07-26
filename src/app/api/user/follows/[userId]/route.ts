import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { toggleUserFollowBusiness, checkFollowStatusBusiness } from '@/lib/services/business/userFollow.business';
import { handleApiError } from '@/lib/utils/api-error-handler';

// Kullanıcı takip etme/çıkarma (POST) - Toggle
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: followingId } = await params;
    
    // Session'dan kullanıcı bilgisi al
    const session = await getServerSession(authConfig);

    // Business logic
    const result = await toggleUserFollowBusiness(session!.user.id, { followingId });
    
    // Başarılı yanıt
    return NextResponse.json(result);
    
  } catch (error) {
    return handleApiError(error, {
      endpoint: request.url,
      method: 'POST',
      userId: (await getServerSession(authConfig))?.user.id
    });
  }
}

// Takip durumunu kontrol et (GET)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: followingId } = await params;
    
    // Session'dan kullanıcı bilgisi al
    const session = await getServerSession(authConfig);

    // Business logic
    const result = await checkFollowStatusBusiness(session!.user.id, followingId);
    
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