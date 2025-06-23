// Aniwa Projesi - Username Setup API Route
// Bu endpoint OAuth sonrası username seçimi için kullanılır

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { usernameSchema } from '@/lib/schemas/auth.schemas'
import { verifyOAuthTokenAndCreateUser } from '@/services/auth/oauth.service'
import { logError } from '@/lib/logger'
import { LOG_EVENTS } from '@/lib/constants/logging'
import { HTTP_STATUS } from '@/lib/constants/app'

export async function POST(request: NextRequest) {
  try {
    // Session kontrolü
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Giriş yapmanız gerekli' },
        { status: HTTP_STATUS.UNAUTHORIZED }
      )
    }

    const body = await request.json()
    const { username } = body

    // Username validasyonu
    const usernameValidation = usernameSchema.safeParse(username)
    if (!usernameValidation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: usernameValidation.error.errors[0].message 
        },
        { status: HTTP_STATUS.BAD_REQUEST }
      )
    }

    // OAuth token'ı al
    const oauthToken = session.user.oauthToken

    if (!oauthToken) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.',
          errorCode: 'SESSION_EXPIRED'
        },
        { status: HTTP_STATUS.UNAUTHORIZED }
      )
    }

    // Token ile kullanıcı oluştur
    const result = await verifyOAuthTokenAndCreateUser({
      token: oauthToken,
      username: usernameValidation.data
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: HTTP_STATUS.BAD_REQUEST }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Hesabınız başarıyla oluşturuldu',
      data: result.data
    })

  } catch (error) {
    logError(LOG_EVENTS.AUTH_SIGNUP_FAILED, 'Username setup hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    })

    return NextResponse.json(
      { success: false, error: 'Sunucu hatası' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    )
  }
} 