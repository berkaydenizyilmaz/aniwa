import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/services/auth/auth.config';
import { updateStreamingPlatformSchema } from '@/lib/schemas/streamingPlatform.schema';
import { getStreamingPlatformBusiness, updateStreamingPlatformBusiness, deleteStreamingPlatformBusiness } from '@/lib/services/business/admin/streaming.business';
import { handleApiError } from '@/lib/utils/api-error-handler';

// Tek streaming platform detayı (GET)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authConfig);

    // Business logic
    const result = await getStreamingPlatformBusiness(id, session!.user.id);

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
    const result = await updateStreamingPlatformBusiness(id, validatedData, session!.user.id);
    
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
    const result = await deleteStreamingPlatformBusiness(id, session!.user.id);
    
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