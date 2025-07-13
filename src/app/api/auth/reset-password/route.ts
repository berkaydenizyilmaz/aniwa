import { NextRequest, NextResponse } from 'next/server'
import { verifyPasswordResetToken, resetPasswordWithToken } from '@/services/business/auth.service'
import { AUTH_RATE_LIMIT_TYPES } from '@/constants'
import { resetPasswordSchema } from '@/schemas/auth'
import { withAuthRateLimit } from '@/lib/rate-limit/middleware'
import type { ApiResponse } from '@/types'

// Token doğrulama endpoint'i (GET)
async function getHandler(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ message: string, email?: string }>>> {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    // 1. Temel parametre kontrolü
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token parametresi gerekli.' }, 
        { status: 400 }
      )
    }

    // 2. Token'ı doğrula
    const result = await verifyPasswordResetToken(token)

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: { 
          message: 'Token geçerli',
          email: result.data?.email 
        }
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('getHandler hatası:', error)
    
    return NextResponse.json(
      { success: false, error: 'Token doğrulama sırasında beklenmedik bir hata oluştu.' },
      { status: 500 }
    )
  }
}

// Şifre sıfırlama endpoint'i (POST)
async function postHandler(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ message: string }>>> {
  try {
    const body = await request.json()
    
    // 1. Zod ile veri formatının validasyonu
    const validation = resetPasswordSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Geçersiz veri formatı.',
          details: validation.error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    const { token, password } = validation.data
    
    // 2. Şifre sıfırlama işlemini gerçekleştir
    const result = await resetPasswordWithToken(token, password)

    if (result.success) {
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
    console.error('postHandler hatası:', error)
    
    return NextResponse.json(
      { success: false, error: 'Şifre sıfırlama sırasında beklenmedik bir hata oluştu.' },
      { status: 500 }
    )
  }
}

export const GET = withAuthRateLimit(AUTH_RATE_LIMIT_TYPES.PASSWORD_RESET, getHandler)
export const POST = withAuthRateLimit(AUTH_RATE_LIMIT_TYPES.PASSWORD_RESET, postHandler)