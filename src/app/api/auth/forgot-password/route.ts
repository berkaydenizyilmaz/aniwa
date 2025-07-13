import { NextRequest, NextResponse } from 'next/server'
import { createPasswordResetToken } from '@/services/business/auth.service'
import { AUTH_RATE_LIMIT_TYPES } from '@/constants'
import { forgotPasswordSchema } from '@/schemas/auth'
import { withAuthRateLimit } from '@/lib/rate-limit/middleware'
import type { ApiResponse } from '@/types'

// Şifre sıfırlama token'ı oluşturur ve email gönderir
async function forgotPasswordHandler(
  request: NextRequest
): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json()
    
    // 1. Zod ile email formatının validasyonu
    const validation = forgotPasswordSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false, 
          error: 'Geçersiz email formatı.',
          details: validation.error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    const { email } = validation.data
    
    // 2. Base URL'i oluştur
    const baseUrl = request.headers.get('origin') || process.env.NEXTAUTH_URL || 'http://localhost:3001'
    
    // 3. Şifre sıfırlama token'ı oluştur ve email gönder
    await createPasswordResetToken(email, baseUrl)

    // 4. Güvenlik için her zaman başarılı yanıt döndür
    // Hata olsa bile, kullanıcının bir hesabının olup olmadığını belli etmemek için
    return NextResponse.json({
      success: true,
      message: 'Şifre sıfırlama bağlantısı gönderildi'
    })
    
  } catch (error) {
    console.error('forgotPasswordHandler hatası:', error)
    
    return NextResponse.json(
      { success: false, error: 'Şifre sıfırlama işlemi sırasında beklenmedik bir hata oluştu.' },
      { status: 500 }
    )
  }
}

export const POST = withAuthRateLimit(AUTH_RATE_LIMIT_TYPES.PASSWORD_RESET, forgotPasswordHandler) 