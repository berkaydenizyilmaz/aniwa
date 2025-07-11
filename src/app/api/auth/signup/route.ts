// Aniwa Projesi - Signup API Route
// Bu endpoint yeni kullanıcı kaydı işlemlerini yönetir

import { NextRequest, NextResponse } from 'next/server'
import { registerUser } from '@/services/business/auth.service'
import { withAuthRateLimit } from '@/lib/rate-limit/middleware'
import { AUTH_RATE_LIMIT_TYPES } from '@/constants/rate-limits'
import { signupSchema } from '@/lib/schemas/auth.schemas'
import { logError, logInfo } from '@/services/business/logger.service'
import { LOG_EVENTS } from '@/constants/logging'

async function signupHandler(request: NextRequest) {
  try {
    const body = await request.json()
    
    // API layer validation - HTTP format kontrolü
    const validationResult = signupSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Geçersiz veri formatı',
          details: validationResult.error.errors
        },
        { status: 400 }
      )
    }

    // Business service call - User creation (email verification kaldırıldı)
    const result = await registerUser(validationResult.data)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    // Başarı loglaması
    logInfo(LOG_EVENTS.AUTH_SIGNUP_SUCCESS, 'Kullanıcı kaydı API başarılı', {
      userId: result.data?.id,
      email: validationResult.data.email
    })

    return NextResponse.json({
      success: true,
      message: 'Kullanıcı kaydı başarılı!',
      data: {
        user: {
          id: result.data?.id,
          email: result.data?.email,
          username: result.data?.username
        }
      }
    })

  } catch (error) {
    logError(LOG_EVENTS.API_ERROR, 'Signup API hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    })

    return NextResponse.json(
      { success: false, error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}

// Rate limiting ile sarılmış export
export const POST = withAuthRateLimit(AUTH_RATE_LIMIT_TYPES.SIGNUP, signupHandler) 