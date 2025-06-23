// Aniwa Projesi - Forgot Password API Route
// Bu dosya şifre sıfırlama token'ı oluşturur ve email gönderir

import { NextRequest, NextResponse } from 'next/server'
import { createPasswordResetToken } from '@/services/auth/email-verification.service'
import { logInfo, logError } from '@/lib/logger'
import { LOG_EVENTS } from '@/lib/constants/logging'
import { forgotPasswordSchema } from '@/lib/schemas/auth.schemas'
import { withAuthRateLimit } from '@/lib/rate-limit/middleware'
import { HTTP_STATUS } from '@/lib/constants/app'
import { AUTH_RATE_LIMIT_TYPES } from '@/lib/constants/rate-limits'

export async function POST(request: NextRequest) {
  // Rate limiting kontrolü
  const rateLimitResponse = await withAuthRateLimit(request, AUTH_RATE_LIMIT_TYPES.PASSWORD_RESET)
  if (rateLimitResponse) {
    return rateLimitResponse
  }
  
  try {
    const body = await request.json()
    
    // Input validation
    const validation = forgotPasswordSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: validation.error.errors[0]?.message || 'Geçersiz veri'
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      )
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

      // Güvenlik için her zaman başarılı yanıt döndür
      return NextResponse.json({
        success: true,
        message: 'Şifre sıfırlama bağlantısı gönderildi'
      })
    } else {
      // Hata durumunda bile güvenlik için genel mesaj döndür
      return NextResponse.json({
        success: true,
        message: 'Şifre sıfırlama bağlantısı gönderildi'
      })
    }
  } catch (error) {
    logError(LOG_EVENTS.AUTH_PASSWORD_RESET_FAILED, 'Şifre sıfırlama API hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    })

    return NextResponse.json(
      { success: false, error: 'Sunucu hatası' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    )
  }
} 