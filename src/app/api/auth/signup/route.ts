import { NextRequest, NextResponse } from 'next/server'
import { registerUser } from '@/services/business/auth.service'
import { withAuthRateLimit } from '@/lib/rate-limit/middleware'
import { AUTH_RATE_LIMIT_TYPES } from '@/constants'
import { signupSchema } from '@/schemas/auth'
import type { ApiResponse } from '@/types'

// Yeni kullanıcı kaydı için POST isteğini işler
async function signupHandler(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ user: { id: string, email: string, username: string } }>>> {
  try {
    const body = await request.json()
    
    // 1. Zod ile veri formatının validasyonu
    const validation = signupSchema.safeParse(body)
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

    // 2. Business service ile kullanıcı oluşturma
    const result = await registerUser(validation.data)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    // 3. Kullanıcı verilerinin varlığını kontrol et
    if (!result.data?.id || !result.data?.email || !result.data?.username) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı verileri eksik.' },
        { status: 500 }
      )
    }

    // 4. Başarılı yanıt gönder
    return NextResponse.json({
      success: true,
      message: 'Kullanıcı kaydı başarılı!',
      data: {
        user: {
          id: result.data.id,
          email: result.data.email,
          username: result.data.username
        }
      }
    })

  } catch (error) {
    console.error('signupHandler hatası:', error)
    
    return NextResponse.json(
      { success: false, error: 'Kullanıcı kaydı sırasında beklenmedik bir hata oluştu.' },
      { status: 500 }
    )
  }
}

export const POST = withAuthRateLimit(AUTH_RATE_LIMIT_TYPES.SIGNUP, signupHandler) 