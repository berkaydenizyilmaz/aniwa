import { NextRequest, NextResponse } from 'next/server'
import { findLogsWithUser, countLogs } from '@/services/db/log.db'
import { LogLevel } from '@prisma/client'
import type { PaginatedResponse, LogWithUser } from '@/types'

// Admin loglarını getirmek için GET isteğini işler
async function getLogsHandler(
  request: NextRequest
): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    
    // 1. Query parametrelerini parse et
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const offset = (page - 1) * limit
    const level = searchParams.getAll('level')
    const event = searchParams.getAll('event')
    const userId = searchParams.get('userId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // 2. Temel validasyonlar
    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { success: false, error: 'Limit 1-100 arasında olmalıdır.' },
        { status: 400 }
      )
    }

    if (page < 1) {
      return NextResponse.json(
        { success: false, error: 'Sayfa numarası 1 veya daha büyük olmalıdır.' },
        { status: 400 }
      )
    }

    // 3. Where koşullarını hazırla
    const where: {
      level?: { in: LogLevel[] }
      event?: { in: string[] }
      userId?: string
      timestamp?: { gte?: Date, lte?: Date }
    } = {}
    
    if (level.length > 0) {
      where.level = { in: level as LogLevel[] }
    }
    
    if (event.length > 0) {
      where.event = { in: event }
    }
    
    if (userId) {
      where.userId = userId
    }
    
    if (startDate || endDate) {
      where.timestamp = {}
      if (startDate) {
        const parsedStartDate = new Date(startDate)
        if (isNaN(parsedStartDate.getTime())) {
          return NextResponse.json(
            { success: false, error: 'Geçersiz başlangıç tarihi formatı.' },
            { status: 400 }
          )
        }
        where.timestamp.gte = parsedStartDate
      }
      if (endDate) {
        const parsedEndDate = new Date(endDate)
        if (isNaN(parsedEndDate.getTime())) {
          return NextResponse.json(
            { success: false, error: 'Geçersiz bitiş tarihi formatı.' },
            { status: 400 }
          )
        }
        where.timestamp.lte = parsedEndDate
      }
    }

    // 4. DB servisi aracılığıyla logları getir
    const [logs, total] = await Promise.all([
      findLogsWithUser(where, { timestamp: 'desc' }, limit, offset),
      countLogs(where)
    ])

    // 5. Pagination bilgilerini hesapla
    const totalPages = Math.ceil(total / limit)
    
    // 6. Başarılı yanıt gönder
    const response: PaginatedResponse<LogWithUser> = {
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('getLogsHandler hatası:', error)
    
    return NextResponse.json(
      { success: false, error: 'Loglar getirilirken beklenmedik bir hata oluştu.' },
      { status: 500 }
    )
  }
}

export const GET = getLogsHandler 