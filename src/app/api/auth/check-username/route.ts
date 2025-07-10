import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { logInfo, logWarn } from '@/lib/logger'
import { LOG_EVENTS } from '@/constants/logging'
import { checkUsernameSchema } from '@/lib/schemas/auth.schemas'
import { withAuthRateLimit } from '@/lib/rate-limit/middleware'
import { AUTH_RATE_LIMIT_TYPES } from '@/constants/rate-limits'
import { ApiResponse } from '@/types/api'

async function checkUsernameHandler(request: NextRequest): Promise<NextResponse<ApiResponse<{ available: boolean, username: string }>>> {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json(
        { success: false, error: { message: 'Username parametresi gerekli' } },
        { status: 400 }
      )
    }

    // Zod ile validasyon
    const validation = checkUsernameSchema.safeParse({ username })
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: { message: validation.error.errors[0]?.message || 'Geçersiz username' }
        },
        { status: 400 }
      )
    }

    const validatedUsername = validation.data.username

    // Veritabanında kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { username: validatedUsername },
      select: { id: true }
    })

    const isAvailable = !existingUser

    logInfo(LOG_EVENTS.AUTH_USERNAME_CHECK, 'Username kullanılabilirlik kontrolü', {
      username: validatedUsername,
      available: isAvailable
    })

    return NextResponse.json({
      success: true,
      data: {
        available: isAvailable,
        username: validatedUsername
      }
    })

  } catch (error) {
    logWarn(LOG_EVENTS.AUTH_USERNAME_CHECK, 'Username kontrol hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    })

    return NextResponse.json(
      { success: false, error: { message: 'Sunucu hatası' } },
      { status: 500 }
    )
  }
}

// Rate limiting ile sarılmış export
export const GET = withAuthRateLimit(AUTH_RATE_LIMIT_TYPES.USERNAME_CHECK, checkUsernameHandler) 