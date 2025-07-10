// Aniwa Projesi - Signup API Route
// Bu endpoint yeni kullanıcı kaydı işlemlerini yönetir

import { NextRequest, NextResponse } from 'next/server'
import { signupSchema } from '@/lib/schemas/auth.schemas'
import { registerUser } from '@/services/business/auth.service'
import { logError, logInfo } from '@/lib/logger'
import { LOG_EVENTS } from '@/constants/logging'
import { withAuthRateLimit } from '@/lib/rate-limit/middleware'
import { AUTH_RATE_LIMIT_TYPES } from '@/constants/rate-limits'

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

    // Business service call - User creation + Email verification
    const baseUrl = request.headers.get('origin') || process.env.NEXTAUTH_URL || 'http://localhost:3001'
    const result = await registerUser(validationResult.data, baseUrl)
    
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
      message: 'Kullanıcı kaydı başarılı! Lütfen email adresinizi doğrulayın.',
      data: {
        user: {
          id: result.data?.id,
          email: result.data?.email,
          username: result.data?.username
        }
      }
    })

  } catch (error) {
    // Hata loglaması
    logError(LOG_EVENTS.API_ERROR, 'Signup API hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    })

    return NextResponse.json(
      { success: false, error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}

// Rate limiting ile export
export const POST = withAuthRateLimit(AUTH_RATE_LIMIT_TYPES.SIGNUP, signupHandler) 