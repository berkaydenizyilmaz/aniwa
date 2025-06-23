// Aniwa Projesi - Email Verification API Route
// Bu dosya email doğrulama token'ını kontrol eder

import { NextRequest, NextResponse } from 'next/server'
import { verifyEmailToken } from '@/services/auth/email-verification.service'
import { logInfo, logError } from '@/lib/logger'
import { LOG_EVENTS } from '@/lib/constants/logging'
import { withAuthRateLimit } from '@/lib/rate-limit/middleware'

export async function GET(request: NextRequest) {
  // Rate limiting kontrolü
  const rateLimitResponse = await withAuthRateLimit(request, 'EMAIL_VERIFICATION')
  if (rateLimitResponse) {
    return rateLimitResponse
  }
  
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token parametresi gerekli' },
        { status: 400 }
      )
    }

    // Token'ı doğrula
    const result = await verifyEmailToken(token)

    if (result.success) {
      logInfo(LOG_EVENTS.AUTH_EMAIL_VERIFICATION_SUCCESS, 'Email başarıyla doğrulandı', {
        email: result.data?.email
      })

      return NextResponse.json({
        success: true,
        message: 'Email adresiniz başarıyla doğrulandı',
        data: result.data
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }
  } catch (error) {
    logError(LOG_EVENTS.AUTH_EMAIL_VERIFICATION_FAILED, 'Email doğrulama API hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    })

    return NextResponse.json(
      { success: false, error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
} 