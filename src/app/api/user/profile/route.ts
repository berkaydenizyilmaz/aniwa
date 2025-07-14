import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserProfile, updateUserProfile } from '@/services/business/profile.service'
import { updateUserSchema } from '@/schemas/user'
import type { ApiResponse, UserWithSettings } from '@/types'

// Kullanıcı profil bilgilerini getirmek için GET isteğini işler
async function getProfileHandler(): Promise<NextResponse<ApiResponse<{ user: UserWithSettings }>>> {
  try {
    // 1. Authentication kontrolü
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Giriş yapmanız gerekiyor.' },
        { status: 401 }
      )
    }

    // 2. Business service ile profil bilgilerini getir
    const result = await getUserProfile(session.user.id)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 404 }
      )
    }

    // 3. Başarılı yanıt gönder
    return NextResponse.json({
      success: true,
      data: {
        user: result.data!
      }
    })

  } catch (error) {
    console.error('getProfileHandler hatası:', error)
    
    return NextResponse.json(
      { success: false, error: 'Profil bilgileri alınırken beklenmedik bir hata oluştu.' },
      { status: 500 }
    )
  }
}

// Kullanıcı profil bilgilerini güncellemek için PUT isteğini işler
async function updateProfileHandler(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ user: UserWithSettings }>>> {
  try {
    // 1. Authentication kontrolü
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Giriş yapmanız gerekiyor.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // 2. Zod ile veri formatının validasyonu
    const validation = updateUserSchema.safeParse(body)
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

    // 3. Business service ile profil güncelleme
    const result = await updateUserProfile(session.user.id, validation.data)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    // 4. Başarılı yanıt gönder
    return NextResponse.json({
      success: true,
      message: 'Profil başarıyla güncellendi!',
      data: {
        user: result.data
      }
    })

  } catch (error) {
    console.error('updateProfileHandler hatası:', error)
    
    return NextResponse.json(
      { success: false, error: 'Profil güncellenirken beklenmedik bir hata oluştu.' },
      { status: 500 }
    )
  }
}

export const GET = getProfileHandler
export const PUT = updateProfileHandler 