import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { updateStreamingLinksSchema } from '@/lib/schemas/streaming.schema';
import { updateEpisodeStreamingLinks } from '@/lib/services/business/streaming.business';
import { handleApiError } from '@/lib/utils/api-error-handler';

// Bölüm streaming linklerini güncelle (PUT) - Editör erişimi
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ episodeId: string }> }
) {
  try {
    const { episodeId } = await params;
    const body = await request.json();
    
    // Input validasyonu
    const validatedData = updateStreamingLinksSchema.parse(body);
    
    // Session'dan kullanıcı bilgisi al
    const session = await getServerSession(authConfig);
    
    // Business logic
    const result = await updateEpisodeStreamingLinks(episodeId, validatedData, session!.user.id);
    
    // Başarılı yanıt
    return NextResponse.json(result);
    
  } catch (error) {
    return handleApiError(error);
  }
} 