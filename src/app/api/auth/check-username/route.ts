import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { AUTH_RATE_LIMIT_TYPES } from '@/constants'
import { checkUsernameSchema } from '@/schemas/auth'
import { withAuthRateLimit } from '@/lib/rate-limit/middleware'
import type { ApiResponse } from '@/types'

async function checkUsernameHandler(request: NextRequest): Promise<NextResponse<ApiResponse<{ available: boolean, username: string }>>> {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Username parametresi gerekli' },
        { status: 400 }
      )
    }

    // Zod ile validasyon
    const validation = checkUsernameSchema.safeParse({ username })
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Geçersiz username',
          details: validation.error.errors
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

    return NextResponse.json({
      success: true,
      data: {
        available: isAvailable,
        username: validatedUsername
      }
    })

  } catch {
    return NextResponse.json(
      { success: false, error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}

// Rate limiting ile sarılmış export
export const GET = withAuthRateLimit(AUTH_RATE_LIMIT_TYPES.USERNAME_CHECK, checkUsernameHandler) 