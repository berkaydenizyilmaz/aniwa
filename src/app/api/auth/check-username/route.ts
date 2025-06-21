import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logInfo, logWarn } from '@/lib/logger'
import { LOG_EVENTS } from '@/lib/constants/logging'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json(
        { error: 'Username parametresi gerekli' },
        { status: 400 }
      )
    }

    // Username formatını kontrol et
    if (username.length < 3 || username.length > 20) {
      return NextResponse.json(
        { available: false, error: 'Username 3-20 karakter arasında olmalı' },
        { status: 400 }
      )
    }

    // Sadece alfanumerik ve alt çizgi kontrolü
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { available: false, error: 'Username sadece harf, rakam ve alt çizgi içerebilir' },
        { status: 400 }
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
      { status: 500 }
    )
  }
} 