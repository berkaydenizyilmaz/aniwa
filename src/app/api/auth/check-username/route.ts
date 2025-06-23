import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { logInfo, logWarn } from '@/lib/logger'
import { LOG_EVENTS } from '@/lib/constants/logging'
import { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH, USERNAME_REGEX } from '@/lib/constants/auth'
import { withAuthRateLimit } from '@/lib/rate-limit/middleware'
import { AUTH_RATE_LIMIT_TYPES } from '@/lib/constants/rate-limits'
import { HTTP_STATUS } from '@/lib/constants/app'

async function checkUsernameHandler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json(
        { error: 'Username parametresi gerekli' },
        { status: HTTP_STATUS.BAD_REQUEST }
      )
    }

    // Username formatını kontrol et
    if (username.length < USERNAME_MIN_LENGTH || username.length > USERNAME_MAX_LENGTH) {
      return NextResponse.json(
        { available: false, error: 'Username ' + USERNAME_MIN_LENGTH + '-' + USERNAME_MAX_LENGTH + ' karakter arasında olmalı' },
        { status: HTTP_STATUS.BAD_REQUEST }
      )
    }

    // Sadece alfanumerik ve alt çizgi kontrolü
    if (!USERNAME_REGEX.test(username)) {
      return NextResponse.json(
        { available: false, error: 'Username sadece harf, rakam ve alt çizgi içerebilir' },
        { status: HTTP_STATUS.BAD_REQUEST }
      )
    }

    // Veritabanında kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { username },
      select: { id: true }
    })

    const isAvailable = !existingUser

    logInfo(LOG_EVENTS.AUTH_USERNAME_CHECK, 'Username kullanılabilirlik kontrolü', {
      username,
      available: isAvailable
    })

    return NextResponse.json({
      available: isAvailable,
      username
    })

  } catch (error) {
    logWarn(LOG_EVENTS.AUTH_USERNAME_CHECK, 'Username kontrol hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    })

    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    )
  }
}

// Rate limiting ile sarılmış export
export const GET = withAuthRateLimit(AUTH_RATE_LIMIT_TYPES.USERNAME_CHECK, checkUsernameHandler) 