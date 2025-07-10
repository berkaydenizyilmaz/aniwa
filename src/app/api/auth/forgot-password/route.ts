// Aniwa Projesi - Forgot Password API Route
// Bu dosya şifre sıfırlama token'ı oluşturur ve email gönderir

import { NextRequest, NextResponse } from 'next/server'
import { createPasswordResetToken } from '@/services/auth/email-verification.service'
import { logInfo, logError } from '@/lib/logger'
import { LOG_EVENTS } from '@/constants/logging'
import { forgotPasswordSchema } from '@/lib/schemas/auth.schemas'
import { withAuthRateLimit } from '@/lib/rate-limit/middleware'
import { AUTH_RATE_LIMIT_TYPES } from '@/constants/rate-limits'
import { ApiResponse } from '@/types/api'

async function forgotPasswordHandler(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json()
    
    // Input validation
    const validation = forgotPasswordSchema.safeParse(body)
    if (!validation.success) {
      const errorPayload: ApiResponse = {
        success: false, 
        error: 'Geçersiz veri',
        details: validation.error.errors
      }
      return NextResponse.json(errorPayload, { status: 400 })
    }

    const { email } = validation.data
    
    // Base URL'i oluştur
    const baseUrl = request.headers.get('origin') || process.env.NEXTAUTH_URL || 'http://localhost:3001'
    
    // Şifre sıfırlama token'ı oluştur ve email gönder
    const result = await createPasswordResetToken(email, baseUrl)

    if (result.success) {
      logInfo(LOG_EVENTS.AUTH_PASSWORD_RESET_REQUESTED, 'Şifre sıfırlama talebi', {
        email: email.toLowerCase()
      })
    }

    // Güvenlik için her zaman başarılı yanıt döndür
    // Hata olsa bile, kullanıcının bir hesabının olup olmadığını belli etmemek için
    // bu şekilde davranıyoruz. Asıl hata loglara yazılıyor.
    const successPayload: ApiResponse = {
      success: true,
      message: 'Şifre sıfırlama bağlantısı gönderildi'
    }
    return NextResponse.json(successPayload)
    
  } catch (error) {
    logError(LOG_EVENTS.AUTH_PASSWORD_RESET_FAILED, 'Şifre sıfırlama API hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    })

    const errorPayload: ApiResponse = { 
      success: false, 
      error: 'Sunucu hatası'
    }
    return NextResponse.json(errorPayload, { status: 500 })
  }
}

// Rate limiting ile sarılmış export
export const POST = withAuthRateLimit(AUTH_RATE_LIMIT_TYPES.PASSWORD_RESET, forgotPasswordHandler) 