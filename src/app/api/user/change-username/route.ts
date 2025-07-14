import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { changeUsername } from '@/services/business/profile.service'
import { changeUsernameSchema } from '@/schemas/user'
import type { ApiResponse } from '@/types'
import { User } from '@prisma/client'

async function changeUsernameHandler(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ user: User }>>> {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    
    const validation = changeUsernameSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Geçersiz veri formatı.',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { username } = validation.data;
    const result = await changeUsername(session!.user.id, username);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Kullanıcı adı başarıyla güncellendi!',
      data: { user: result.data! },
    });
  } catch (error) {
    console.error('changeUsernameHandler hatası:', error);
    return NextResponse.json(
      { success: false, error: 'Kullanıcı adı güncellenirken beklenmedik bir hata oluştu.' },
      { status: 500 }
    );
  }
}

export const PUT = changeUsernameHandler; 