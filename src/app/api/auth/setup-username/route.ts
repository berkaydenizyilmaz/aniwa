// Aniwa Projesi - Username Setup API Route
// Bu endpoint OAuth sonrası username seçimi için kullanılır

import { NextRequest, NextResponse } from 'next/server'
import { usernameSchema } from '@/lib/schemas/auth.schemas'
import { prisma } from '@/lib/prisma'
import { logInfo, logError } from '@/lib/logger'
import { LOG_EVENTS } from '@/lib/constants/logging'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, username } = body

    // Email kontrolü
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email gerekli' },
        { status: 400 }
      )
    }

    // Username validasyonu
    const usernameValidation = usernameSchema.safeParse(username)
    if (!usernameValidation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: usernameValidation.error.errors[0].message 
        },
        { status: 400 }
      )
    }

    // Kullanıcıyı email ile bul
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    // Eğer kullanıcının zaten username'i varsa
    if (user.username) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcının zaten username\'i var' },
        { status: 400 }
      )
    }

    // Username'in kullanımda olup olmadığını kontrol et
    const existingUsername = await prisma.user.findUnique({
      where: { username: usernameValidation.data }
    })

    if (existingUsername) {
      return NextResponse.json(
        { success: false, error: 'Bu kullanıcı adı zaten kullanımda' },
        { status: 400 }
      )
    }

    // Username'i güncelle
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { username: usernameValidation.data }
    })

    logInfo(LOG_EVENTS.AUTH_USER_CREATED, 'OAuth kullanıcısı username seçti', {
      userId: user.id,
      email: user.email,
      username: usernameValidation.data
    }, user.id)

    return NextResponse.json({
      success: true,
      message: 'Username başarıyla ayarlandı',
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        name: updatedUser.name,
        role: updatedUser.role
      }
    })

  } catch (error) {
    logError(LOG_EVENTS.AUTH_SIGNUP_FAILED, 'Username setup hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    })

    return NextResponse.json(
      { success: false, error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
} 