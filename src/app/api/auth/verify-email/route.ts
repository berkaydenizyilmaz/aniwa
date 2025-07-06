// Aniwa Projesi - Email Verification API Route
// Bu dosya email doğrulama token'ını kontrol eder

import { NextRequest, NextResponse } from 'next/server'
import { verifyEmailToken } from '@/services/auth/email-verification.service'
import { logInfo, logError } from '@/lib/logger'
import { LOG_EVENTS } from '@/constants/logging'
import { withAuthRateLimit } from '@/lib/rate-limit/middleware'
import { AUTH_RATE_LIMIT_TYPES } from '@/constants/rate-limits'
import { ApiResponse } from '@/types/api'

async function verifyEmailHandler(request: NextRequest): Promise<NextResponse<ApiResponse<{ message: string, email?: string }>>> {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { success: false, error: { message: 'Token parametresi gerekli' } },
        { status: 400 }
      )
    }

    // Token'ı doğrula
    const result = await verifyEmailToken(token)

    if (result.success) {
      logInfo(LOG_EVENTS.AUTH_EMAIL_VERIFICATION_SUCCESS, 'Email başarıyla doğrulandı', {
        email: result.data?.email
      })

      const payload: ApiResponse<{ message: string, email?: string }> = {
        success: true,
        data: {
          message: 'Email adresiniz başarıyla doğrulandı',
          email: result.data?.email
        }
      }
      return NextResponse.json(payload)

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
      { success: false, error: { message: 'Sunucu hatası' } },
      { status: 500 }
    )
  }
}

// Rate limiting ile sarılmış export
export const GET = withAuthRateLimit(AUTH_RATE_LIMIT_TYPES.EMAIL_VERIFICATION, verifyEmailHandler) 