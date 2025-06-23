// Aniwa Projesi - Signup API Route
// Bu endpoint yeni kullanıcı kaydı işlemlerini yönetir

import { NextRequest, NextResponse } from 'next/server'
import { signupSchema } from '@/lib/schemas/auth.schemas'
import { createUser } from '@/services/auth/auth.service'
import { createEmailVerificationToken } from '@/services/auth/email-verification.service'
import { logError, logInfo } from '@/lib/logger'
import { LOG_EVENTS } from '@/lib/constants/logging'
import { withAuthRateLimit } from '@/lib/rate-limit/middleware'
import { HTTP_STATUS } from '@/lib/constants/app'
import { AUTH_RATE_LIMIT_TYPES } from '@/lib/constants/rate-limits'

async function signupHandler(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Request validation
    const validationResult = signupSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: validationResult.error.errors[0].message 
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      )
    }

    const { email, password, username } = validationResult.data

    // Kullanıcı oluştur
    const result = await createUser({
      email,
      password,
      username,
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: HTTP_STATUS.BAD_REQUEST }
      )
    }

    // Email doğrulama token'ı oluştur ve email gönder
    const baseUrl = request.headers.get('origin') || process.env.NEXTAUTH_URL || 'http://localhost:3001'
    const verificationResult = await createEmailVerificationToken(email, username, baseUrl)

    if (!verificationResult.success) {
      logError(LOG_EVENTS.AUTH_EMAIL_VERIFICATION_FAILED, 'Email doğrulama gönderim hatası', {
        email,
        username,
        error: verificationResult.error
      })
      
      // Kullanıcı oluşturuldu ama email gönderilemedi
      return NextResponse.json({
        success: true,
        message: 'Hesabınız oluşturuldu ancak doğrulama emaili gönderilemedi. Lütfen tekrar deneyin.',
        data: result.data,
        warning: 'Email doğrulama gönderim hatası'
      })
    }

    logInfo(LOG_EVENTS.AUTH_SIGNUP_SUCCESS, 'Kullanıcı kaydı ve email doğrulama tamamlandı', {
      email,
      username
    })

    return NextResponse.json({
      success: true,
      message: 'Hesabınız başarıyla oluşturuldu. Email adresinize gönderilen doğrulama bağlantısını kontrol edin.',
      data: result.data
    })

  } catch (error) {
    logError(LOG_EVENTS.AUTH_SIGNUP_FAILED, 'Signup API hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    })

    return NextResponse.json(
      { success: false, error: 'Sunucu hatası' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    )
  }
}

// Rate limiting ile sarılmış export
export const POST = withAuthRateLimit(AUTH_RATE_LIMIT_TYPES.SIGNUP, signupHandler) 