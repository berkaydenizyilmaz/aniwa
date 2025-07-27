import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { updateAnimeSeriesSchema } from '@/lib/schemas/anime.schema';
import { getAnimeSeriesByIdBusiness, updateAnimeSeriesBusiness, deleteAnimeSeriesBusiness } from '@/lib/services/business/anime.business';
import { handleApiError } from '@/lib/utils/api-error-handler';

// Tek anime serisi detayı (GET)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Session'dan editor bilgisi al
    const session = await getServerSession(authConfig);

    // Business logic
    const result = await getAnimeSeriesByIdBusiness(id, session!.user.id);

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

// Anime serisi güncelle (PUT)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Input validasyonu
    const validatedData = updateAnimeSeriesSchema.parse(body);
    
    // Session'dan editor bilgisi al
    const session = await getServerSession(authConfig);
    
    // Business logic
    const result = await updateAnimeSeriesBusiness(id, validatedData, session!.user.id);
    
    // Başarılı yanıt
    return NextResponse.json(result);
    
  } catch (error) {
    return handleApiError(error, {
      endpoint: request.url,
      method: 'PUT',
      userId: (await getServerSession(authConfig))?.user.id
    });
  }
}

// Anime serisi sil (DELETE)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Session'dan editor bilgisi al
    const session = await getServerSession(authConfig);

    // Business logic
    const result = await deleteAnimeSeriesBusiness(id, session!.user.id);
    
    // Başarılı yanıt
    return NextResponse.json(result);
    
  } catch (error) {
    return handleApiError(error, {
      endpoint: request.url,
      method: 'DELETE',
      userId: (await getServerSession(authConfig))?.user.id
    });
  }
} 