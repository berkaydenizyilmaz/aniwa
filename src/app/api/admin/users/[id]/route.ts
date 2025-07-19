import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { updateUserSchema } from '@/lib/schemas/user.schema';
import { getUserById, updateUser, deleteUser } from '@/lib/services/business/user.business';
import { handleApiError } from '@/lib/utils/api-error-handler';

// Tek kullanıcı detayı (GET)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Business logic
    const result = await getUserById(id);

    // Başarılı yanıt
    return NextResponse.json(result);

  } catch (error) {
    return handleApiError(error);
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
    const result = await updateUser(id, validatedData, {
      id: session!.user.id,
      username: session!.user.username
    });
    
    // Başarılı yanıt
    return NextResponse.json(result);
    
  } catch (error) {
    return handleApiError(error);
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
    const result = await deleteUser(id, {
      id: session!.user.id,
      username: session!.user.username
    });
    
    // Başarılı yanıt
    return NextResponse.json(result);
    
  } catch (error) {
    return handleApiError(error);
  }
} 