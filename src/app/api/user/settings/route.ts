import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserProfile, updateUserProfileSettings } from '@/services/business/profile.service'
import { updateUserSettingsSchema } from '@/schemas/user'
import type { ApiResponse, UserWithSettings } from '@/types'
import type { UserProfileSettings } from '@prisma/client'

// Kullanıcı ayarlarını getirmek için GET isteğini işler
async function getSettingsHandler(): Promise<NextResponse<ApiResponse<{ settings: UserProfileSettings | null }>>> {
  try {
    // 1. Authentication kontrolü (middleware tarafından yapılıyor)
    const session = await getServerSession(authOptions)
    
    // 2. Business service ile kullanıcı bilgilerini getir (ayarlar dahil)
    const result = await getUserProfile(session!.user.id)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 404 }
      )
    }

    // 3. Sadece ayarları döndür
    return NextResponse.json({
      success: true,
      data: {
        settings: result.data!.userSettings
      }
    })

  } catch (error) {
    console.error('getSettingsHandler hatası:', error)
    
    return NextResponse.json(
      { success: false, error: 'Ayarlar alınırken beklenmedik bir hata oluştu.' },
      { status: 500 }
    )
  }
}

// Kullanıcı ayarlarını güncellemek için PUT isteğini işler
async function updateSettingsHandler(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ user: UserWithSettings }>>> {
  try {
    // 1. Authentication kontrolü (middleware tarafından yapılıyor)
    const session = await getServerSession(authOptions)
    const body = await request.json()
    
    // 2. Zod ile veri formatının validasyonu
    const validation = updateUserSettingsSchema.safeParse(body)
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

    // 3. Business service ile ayarları güncelle
    const result = await updateUserProfileSettings(session!.user.id, validation.data)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    // 4. Başarılı yanıt gönder
    return NextResponse.json({
      success: true,
      message: 'Ayarlar başarıyla güncellendi!',
      data: {
        user: result.data!
      }
    })

  } catch (error) {
    console.error('updateSettingsHandler hatası:', error)
    
    return NextResponse.json(
      { success: false, error: 'Ayarlar güncellenirken beklenmedik bir hata oluştu.' },
      { status: 500 }
    )
  }
}

export const GET = getSettingsHandler
export const PUT = updateSettingsHandler 