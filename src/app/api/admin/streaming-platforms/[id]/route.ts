import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { updateStreamingPlatformSchema } from '@/lib/schemas/streaming.schema';
import { getStreamingPlatformById, updateStreamingPlatform, deleteStreamingPlatform } from '@/lib/services/business/streaming.business';
import { handleApiError } from '@/lib/utils/api-error-handler';

// Tek streaming platform detayı (GET)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Business logic
    const result = await getStreamingPlatformById(id);

    // Başarılı yanıt
    return NextResponse.json(result);

  } catch (error) {
    return handleApiError(error);
  }
}

// Streaming platform güncelle (PUT)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Input validasyonu
    const validatedData = updateStreamingPlatformSchema.parse(body);
    
    // Session'dan admin bilgisi al
    const session = await getServerSession(authConfig);
    
    // Business logic
    const result = await updateStreamingPlatform(id, validatedData, {
      id: session!.user.id,
      username: session!.user.username
    });
    
    // Başarılı yanıt
    return NextResponse.json(result);
    
  } catch (error) {
    return handleApiError(error);
  }
}

// Streaming platform sil (DELETE)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Session'dan admin bilgisi al
    const session = await getServerSession(authConfig);

    // Business logic
    const result = await deleteStreamingPlatform(id, {
      id: session!.user.id,
      username: session!.user.username
    });
    
    // Başarılı yanıt
    return NextResponse.json(result);
    
  } catch (error) {
    return handleApiError(error);
  }
} 