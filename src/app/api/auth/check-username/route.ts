import { NextRequest, NextResponse } from 'next/server'
import { findUserByUsername } from '@/services/db/user.db'
import { AUTH_RATE_LIMIT_TYPES } from '@/constants'
import { checkUsernameSchema } from '@/schemas/auth'
import { withAuthRateLimit } from '@/lib/rate-limit/middleware'
import type { ApiResponse } from '@/types'

// Kullanıcı adı kullanılabilirliğini kontrol etmek için GET isteğini işler
async function checkUsernameHandler(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ available: boolean, username: string }>>> {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    // 1. Temel parametre kontrolü
    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Username parametresi gerekli.' },
        { status: 400 }
      )
    }

    // 2. Zod ile kullanıcı adı formatının validasyonu
    const validation = checkUsernameSchema.safeParse({ username })
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Geçersiz kullanıcı adı formatı.',
          details: validation.error.errors.map(err => ({ 
            path: err.path.join('.'), 
            message: err.message 
          }))
        },
        { status: 400 }
      )
    }

    const validatedUsername = validation.data.username

    // 3. DB servisi aracılığıyla kullanıcı adının mevcut olup olmadığını kontrol et
    const existingUser = await findUserByUsername(validatedUsername) 
    const isAvailable = !existingUser

    // 4. Başarılı yanıt gönder
    return NextResponse.json({
      success: true,
      data: {
        available: isAvailable,
        username: validatedUsername
      }
    })

  } catch (error) {
    console.error('checkUsernameHandler hatası:', error)
    
    return NextResponse.json(
      { success: false, error: 'Kullanıcı adı kontrolü sırasında beklenmedik bir hata oluştu.' },
      { status: 500 }
    )
  }
}

export const GET = withAuthRateLimit(AUTH_RATE_LIMIT_TYPES.USERNAME_CHECK, checkUsernameHandler)