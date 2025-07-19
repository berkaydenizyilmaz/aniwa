import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { updateTagSchema } from '@/lib/schemas/tag.schema';
import { getTagById, updateTag, deleteTag } from '@/lib/services/business/tag.business';
import { handleApiError } from '@/lib/utils/api-error-handler';

// Tek tag detayı (GET)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Business logic
    const result = await getTagById(id);

    // Başarılı yanıt
    return NextResponse.json(result);

  } catch (error) {
    return handleApiError(error);
  }
}

// Tag güncelle (PUT)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Input validasyonu
    const validatedData = updateTagSchema.parse(body);
    
    // Session'dan admin bilgisi al
    const session = await getServerSession(authConfig);
    
    // Business logic
    const result = await updateTag(id, validatedData, {
      id: session!.user.id,
      username: session!.user.username
    });
    
    // Başarılı yanıt
    return NextResponse.json(result);
    
  } catch (error) {
    return handleApiError(error);
  }
}

// Tag sil (DELETE)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Session'dan admin bilgisi al
    const session = await getServerSession(authConfig);

    // Business logic
    const result = await deleteTag(id, {
      id: session!.user.id,
      username: session!.user.username
    });
    
    // Başarılı yanıt
    return NextResponse.json(result);
    
  } catch (error) {
    return handleApiError(error);
  }
} 