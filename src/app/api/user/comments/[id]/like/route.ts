import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { toggleCommentLike } from '@/lib/services/business/comment.business';
import { handleApiError } from '@/lib/utils/api-error-handler';

// Yorum beğenme/beğenmeme (POST) - Toggle
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: commentId } = await params;
    
    // Session'dan kullanıcı bilgisi al
    const session = await getServerSession(authConfig);

    // Business logic
    const result = await toggleCommentLike(session!.user.id, { commentId }, {
      id: session!.user.id,
      username: session!.user.username
    });
    
    // Başarılı yanıt
    return NextResponse.json(result);
    
  } catch (error) {
    return handleApiError(error);
  }
} 