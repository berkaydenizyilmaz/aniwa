// Aniwa Projesi - Reset Password API Route
// Bu dosya şifre sıfırlama token'ını kullanarak şifre değiştirir

import { NextRequest, NextResponse } from 'next/server'
import { verifyPasswordResetToken, resetPasswordWithToken } from '@/services/auth/email-verification.service'
import { logInfo, logError } from '@/lib/logger'
import { LOG_EVENTS } from '@/constants/logging'
import { resetPasswordApiSchema } from '@/lib/schemas/auth.schemas'
import { ApiResponse } from '@/types/api'

// Token doğrulama endpoint'i (GET)
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<{ message: string, email?: string }>>> {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ 
        success: false, error: { message: 'Token parametresi gerekli' } 
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
      { success: false, error: { message: 'Sunucu hatası' } },
      { status: 500 }
    )
  }
}

// Şifre sıfırlama endpoint'i (POST)
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<{ message: string }>>> {
  try {
    const body = await request.json()
    
    // Input validation
    const validation = resetPasswordApiSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: { message: validation.error.errors[0]?.message || 'Geçersiz veri' }
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
      { success: false, error: { message: 'Sunucu hatası' } },
      { status: 500 }
    )
  }
} 