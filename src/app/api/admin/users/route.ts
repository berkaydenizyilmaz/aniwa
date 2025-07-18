import { NextRequest, NextResponse } from 'next/server'
import { getUsersForAdmin } from '@/services/business/admin.service'
import { userListQuerySchema } from '@/schemas/admin'
import type { ApiResponse } from '@/types'

// Admin paneli için kullanıcı listesini getirmek için GET isteğini işler
async function getUsersHandler(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const searchParams = req.nextUrl.searchParams
    const query = Object.fromEntries(searchParams.entries())

    const validation = userListQuerySchema.safeParse(query)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Geçersiz sorgu parametreleri.',
          details: validation.error.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
        },
        { status: 400 }
      )
    }

    const result = await getUsersForAdmin(validation.data)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    console.error('getUsersHandler Error:', error)
    return NextResponse.json(
      { success: false, error: 'Kullanıcılar listelenirken beklenmedik bir hata oluştu.' },
      { status: 500 }
    )
  }
}

export const GET = getUsersHandler
