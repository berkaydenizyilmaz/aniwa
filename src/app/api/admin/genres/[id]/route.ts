import { NextRequest, NextResponse } from 'next/server';
import { updateGenreSchema } from '@/lib/schemas/genre.schema';
import { getGenreById, updateGenre, deleteGenre } from '@/lib/services/business/genre.business';
import { handleApiError } from '@/lib/utils/api-error-handler';

// Tek genre detayı (GET)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Business logic
    const result = await getGenreById(id);

    // Başarılı yanıt
    return NextResponse.json(result);

  } catch (error) {
    return handleApiError(error);
  }
}

// Genre güncelle (PUT)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Input validasyonu
    const validatedData = updateGenreSchema.parse(body);
    
    // Business logic
    const result = await updateGenre(id, validatedData);
    
    // Başarılı yanıt
    return NextResponse.json(result);
    
  } catch (error) {
    return handleApiError(error);
  }
}

// Genre sil (DELETE)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Business logic
    const result = await deleteGenre(id);
    
    // Başarılı yanıt
    return NextResponse.json(result);
    
  } catch (error) {
    return handleApiError(error);
  }
} 