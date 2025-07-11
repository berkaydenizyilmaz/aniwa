// Aniwa Projesi - Reset Password API Route
// Bu dosya şifre sıfırlama token'ını kullanarak şifre değiştirir

import { NextRequest, NextResponse } from 'next/server'
import { verifyPasswordResetToken, resetPasswordWithToken } from '@/services/business/auth.service'
import { logInfo, logError } from '@/services/business/logger.service'
import { LOG_EVENTS } from '@/constants/logging'
import { withAuthRateLimit } from '@/lib/rate-limit/middleware'
import { AUTH_RATE_LIMIT_TYPES } from '@/constants/rate-limits'
import { ApiResponse } from '@/types/api'
import { z } from 'zod'

// Reset password schema
const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token gerekli'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı')
})

// Token doğrulama endpoint'i (GET)
async function getHandler(request: NextRequest): Promise<NextResponse<ApiResponse<{ message: string, email?: string }>>> {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ 
        success: false, error: 'Token parametresi gerekli' 
      }, { status: 400 })
    }

    // Token'ı doğrula (şifre değiştirmeden)
    const result = await verifyPasswordResetToken(token)

    if (result.success) {
      const payload: ApiResponse<{ message: string, email?: string }> = {
        success: true,
        data: { 
          message: 'Token geçerli',
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
    logError(LOG_EVENTS.AUTH_PASSWORD_RESET_FAILED, 'Şifre sıfırlama token doğrulama hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    })

    return NextResponse.json(
      { success: false, error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}

// Rate limiting ile sarılmış exports
export const GET = withAuthRateLimit(AUTH_RATE_LIMIT_TYPES.PASSWORD_RESET, getHandler)
export const POST = withAuthRateLimit(AUTH_RATE_LIMIT_TYPES.PASSWORD_RESET, postHandler)

// Şifre sıfırlama endpoint'i (POST)
async function postHandler(request: NextRequest): Promise<NextResponse<ApiResponse<{ message: string }>>> {
  try {
    const body = await request.json()
    
    // Input validation
    const validation = resetPasswordSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Geçersiz veri'
        },
        { status: 400 }
      )
    }

    const { token, password } = validation.data
    
    // Şifre sıfırlama işlemini gerçekleştir
    const result = await resetPasswordWithToken(token, password)

    if (result.success) {
      logInfo(LOG_EVENTS.AUTH_PASSWORD_RESET_SUCCESS, 'Şifre başarıyla sıfırlandı')

      return NextResponse.json({
        success: true,
        data: { message: 'Şifreniz başarıyla güncellendi' }
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }
  } catch (error) {
    logError(LOG_EVENTS.AUTH_PASSWORD_RESET_FAILED, 'Şifre sıfırlama API hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    })

    return NextResponse.json(
      { success: false, error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
} 