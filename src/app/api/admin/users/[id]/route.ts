import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/services/auth/auth.config';
import { updateUserSchema } from '@/lib/schemas/user.schema';
import { getUserBusiness, updateUserBusiness, deleteUserBusiness } from '@/lib/services/business/admin/user.business';
import { handleApiError } from '@/lib/utils/api-error-handler';

// Tek kullanıcı detayı (GET)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Session'dan admin bilgisi al
    const session = await getServerSession(authConfig);

    // Business logic
    const result = await getUserBusiness(id, session!.user.id);

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

// Kullanıcı güncelle (PUT)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Input validasyonu
    const validatedData = updateUserSchema.parse(body);
    
    // Session'dan admin bilgisi al
    const session = await getServerSession(authConfig);
    
    // Business logic
    const result = await updateUserBusiness(id, validatedData, session!.user.id);
    
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

// Kullanıcı sil (DELETE)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Session'dan admin bilgisi al
    const session = await getServerSession(authConfig);

    // Business logic
    const result = await deleteUserBusiness(id, session!.user.id);
    
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