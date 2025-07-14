import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { findUserById } from '@/services/db/user.db'
import { updateUserPassword } from '@/services/business/auth.service'
import { setInitialPasswordSchema } from '@/schemas/auth'
import type { ApiResponse } from '@/types'

// İlk şifre belirleme endpoint'i (POST)
async function setInitialPasswordHandler(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ message: string }>>> {
  try {
    // 1. Authentication kontrolü (middleware tarafından yapılıyor)
    const session = await getServerSession(authOptions)
    const body = await request.json()
    
    // 2. Zod ile veri formatının validasyonu
    const validation = setInitialPasswordSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Geçersiz veri formatı.',
          details: validation.error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    const { newPassword } = validation.data
    
    // 3. Kullanıcının şu anda şifresi olmadığını kontrol et (Google OAuth kullanıcısı)
    const user = await findUserById(session!.user.id)
    if (user?.passwordHash) {
      return NextResponse.json(
        { success: false, error: 'Zaten bir şifreniz bulunmaktadır.' },
        { status: 400 }
      )
    }
    
    // 4. Şifreyi güncelle (business service kullanarak)
    const result = await updateUserPassword({
      userId: session!.user.id,
      newPassword
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    // 5. Başarılı yanıt gönder
    return NextResponse.json({
      success: true,
      data: { message: 'Şifreniz başarıyla belirlendi!' }
    })

  } catch (error) {
    console.error('setInitialPasswordHandler hatası:', error)

    return NextResponse.json(
      { success: false, error: 'Şifre belirlenirken beklenmedik bir hata oluştu.' },
      { status: 500 }
    )
  }
}

export const POST = setInitialPasswordHandler 