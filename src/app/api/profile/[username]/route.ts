import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserProfileByUsername } from '@/services/business/profile.service'
import type { ApiResponse, UserWithSettings } from '@/types'

// Public profil bilgilerini getirmek için GET isteğini işler
async function getPublicProfileHandler(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
): Promise<NextResponse<ApiResponse<{ user: UserWithSettings }>>> {
  try {
    const { username } = await params
    
    // 1. Username parametresini kontrol et
    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Username parametresi gerekli.' },
        { status: 400 }
      )
    }

    // 2. Giriş yapmış kullanıcının ID'sini al (opsiyonel)
    const session = await getServerSession(authOptions)
    const viewerId = session?.user?.id

    // 3. Business service ile profil bilgilerini getir
    const result = await getUserProfileByUsername(username, viewerId)
    
    if (!result.success) {
      const status = result.error === 'Kullanıcı bulunamadı' ? 404 : 403
      return NextResponse.json(
        { success: false, error: result.error },
        { status }
      )
    }

    // 4. Başarılı yanıt gönder
    return NextResponse.json({
      success: true,
      data: {
        user: result.data!
      }
    })

  } catch (error) {
    console.error('getPublicProfileHandler hatası:', error)
    
    return NextResponse.json(
      { success: false, error: 'Profil bilgileri alınırken beklenmedik bir hata oluştu.' },
      { status: 500 }
    )
  }
}

export const GET = getPublicProfileHandler 