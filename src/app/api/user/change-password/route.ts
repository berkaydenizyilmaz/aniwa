import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { updateUserPassword } from '@/services/business/auth.service'
import { sendPasswordChangeNotificationEmail } from '@/services/api/email.service'
import { changePasswordSchema } from '@/schemas/auth'
import type { ApiResponse } from '@/types'

// Şifre değiştirme endpoint'i (POST)
async function changePasswordHandler(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ message: string }>>> {
  try {
    // 1. Authentication kontrolü (middleware tarafından yapılıyor)
    const session = await getServerSession(authOptions)
    const body = await request.json()
    
    // 2. Zod ile veri formatının validasyonu
    const validation = changePasswordSchema.safeParse(body)
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
    
    // 3. Şifre güncelleme işlemini gerçekleştir
    const result = await updateUserPassword({ 
      userId: session!.user.id, 
      newPassword 
    })

    if (result.success) {
      // 4. Başarılı olursa bildirim emaili gönder
      await sendPasswordChangeNotificationEmail({
        to: session!.user.email!,
        username: session!.user.username!
      })

      return NextResponse.json({
        success: true,
        data: { message: 'Şifre başarıyla güncellendi' }
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('changePasswordHandler hatası:', error)
    
    return NextResponse.json(
      { success: false, error: 'Şifre değiştirme sırasında beklenmedik bir hata oluştu.' },
      { status: 500 }
    )
  }
}

export const POST = changePasswordHandler 