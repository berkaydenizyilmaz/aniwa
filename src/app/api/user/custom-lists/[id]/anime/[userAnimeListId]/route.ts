import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { toggleAnimeInListBusiness } from '@/lib/services/business/customList.business';
import { handleApiError } from '@/lib/utils/api-error-handler';

// Listeye anime ekle/çıkar (POST) - Toggle
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; userAnimeListId: string }> }
) {
  try {
    const { id: listId, userAnimeListId } = await params;

    // Session'dan kullanıcı bilgisi al
    const session = await getServerSession(authConfig);

    // Business logic
    const result = await toggleAnimeInListBusiness(listId, userAnimeListId, session!.user.id);
    
    // Başarılı yanıt
    return NextResponse.json(result);
    
  } catch (error) {
    return handleApiError(error);
  }
} 