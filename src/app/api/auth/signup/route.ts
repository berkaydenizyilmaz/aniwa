// Aniwa Projesi - Signup API Route
// Bu endpoint yeni kullanıcı kaydı işlemlerini yönetir

import { NextRequest, NextResponse } from 'next/server'
import { signupSchema } from '@/lib/schemas/auth.schemas'
import { createUser } from '@/services/auth/auth.service'
import { logError } from '@/lib/logger'
import { LOG_EVENTS } from '@/lib/constants/logging'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Request validation
    const validationResult = signupSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: validationResult.error.errors[0].message 
        },
        { status: 400 }
      )
    }

    const { email, password, username, name } = validationResult.data

    // Kullanıcı oluştur
    const result = await createUser({
      email,
      password,
      username,
      name
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Hesabınız başarıyla oluşturuldu',
      data: result.data
    })

  } catch (error) {
    logError(LOG_EVENTS.AUTH_SIGNUP_FAILED, 'Signup API hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    })

    return NextResponse.json(
      { success: false, error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
} 