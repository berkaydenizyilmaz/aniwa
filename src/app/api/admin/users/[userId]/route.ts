import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { adminUpdateUserSchema } from '@/schemas/admin'
import { updateUserByAdmin } from '@/services/business/admin.service'

import type { ApiResponse } from '@/types'

// Admin tarafından kullanıcı bilgilerini güncellemek için PATCH isteğini işler
async function updateUserHandler(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
): Promise<NextResponse<ApiResponse>> {
  try {
    const session = await getServerSession(authOptions)

    const { userId } = await params
    const body = await req.json()

    const validation = adminUpdateUserSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Geçersiz veri.',
          details: validation.error.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
        },
        { status: 400 }
      )
    }

    const result = await updateUserByAdmin(userId, validation.data, session!.user.id)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Kullanıcı başarıyla güncellendi.',
      data: result.data,
    })
  } catch (error) {
    console.error('updateUserHandler Error:', error)
    return NextResponse.json(
      { success: false, error: 'Kullanıcı güncellenirken beklenmedik bir hata oluştu.' },
      { status: 500 }
    )
  }
}

export const PATCH = updateUserHandler
