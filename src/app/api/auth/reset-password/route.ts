// Aniwa Projesi - Reset Password API Route
// Bu dosya şifre sıfırlama token'ını kullanarak şifre değiştirir

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyPasswordResetToken, resetPasswordWithToken } from '@/services/auth/email-verification.service'
import { logInfo, logError } from '@/lib/logger'
import { LOG_EVENTS } from '@/lib/constants/logging'

// Request body validation
const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token gerekli'),
  password: z.string()
    .min(8, 'Şifre en az 8 karakter olmalı')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Şifre en az bir küçük harf, bir büyük harf ve bir rakam içermeli')
})

// Token doğrulama endpoint'i (GET)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token parametresi gerekli' },
        { status: 400 }
      )
    }

    // Token'ı doğrula (şifre değiştirmeden)
    const result = await verifyPasswordResetToken(token)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Token geçerli',
        data: { email: result.data?.email }
      })
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

// Şifre sıfırlama endpoint'i (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Input validation
    const validation = resetPasswordSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: validation.error.errors[0]?.message || 'Geçersiz veri'
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
        message: result.message || 'Şifreniz başarıyla güncellendi'
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