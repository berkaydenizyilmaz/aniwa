import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { toggleUserAnimeTrackingBusiness, checkTrackingStatusBusiness } from '@/lib/services/business/userAnimeTracking.business';
import { handleApiError } from '@/lib/utils/api-error-handler';

// Anime takip etme/çıkarma (POST) - Toggle
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ animeSeriesId: string }> }
) {
  try {
    const { animeSeriesId } = await params;
    
    // Session'dan kullanıcı bilgisi al
    const session = await getServerSession(authConfig);

    // Business logic
    const result = await toggleUserAnimeTrackingBusiness(session!.user.id, { animeSeriesId });
    
    // Başarılı yanıt
    return NextResponse.json(result);
    
  } catch (error) {
    return handleApiError(error);
  }
}

// Takip durumunu kontrol et (GET)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ animeSeriesId: string }> }
) {
  try {
    const { animeSeriesId } = await params;
    
    // Session'dan kullanıcı bilgisi al
    const session = await getServerSession(authConfig);

    // Business logic
    const result = await checkTrackingStatusBusiness(session!.user.id, animeSeriesId);
    
    // Başarılı yanıt
    return NextResponse.json(result);
    
  } catch (error) {
    return handleApiError(error);
  }
} 