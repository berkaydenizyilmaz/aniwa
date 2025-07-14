import { NextRequest, NextResponse } from 'next/server'
import { findLogsWithUser, countLogs } from '@/services/db/log.db'
import { LogLevel } from '@prisma/client'
import { logQuerySchema } from '@/schemas/admin'
import { ADMIN } from '@/constants'
import type { PaginatedResponse, LogWithUser } from '@/types'

// Admin loglarını getirmek için GET isteğini işler
async function getLogsHandler(
  request: NextRequest
): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    
    // 1. Query parametrelerini parse et ve validate et
    const queryParams = {
      level: searchParams.getAll('level'),
      event: searchParams.getAll('event'),
      userId: searchParams.get('userId'),
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
      limit: searchParams.get('limit'),
      page: searchParams.get('page'),
      sortBy: searchParams.get('sortBy'),
      sortOrder: searchParams.get('sortOrder'),
    }

    // 2. Zod ile validasyon
    const validation = logQuerySchema.safeParse(queryParams)
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Geçersiz parametreler.',
          details: validation.error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    const { level, event, userId, startDate, endDate, limit, page, sortBy, sortOrder } = validation.data
    const offset = (page - 1) * limit

    // 3. Where koşullarını hazırla
    const where: {
      level?: { in: LogLevel[] }
      event?: { in: string[] }
      userId?: string
      timestamp?: { gte?: Date, lte?: Date }
    } = {}
    
    if (level && level.length > 0) {
      where.level = { in: level }
    }
    
    if (event && event.length > 0) {
      where.event = { in: event }
    }
    
    if (userId) {
      where.userId = userId
    }
    
    if (startDate || endDate) {
      where.timestamp = {}
      if (startDate) {
        const parsedStartDate = new Date(startDate)
        where.timestamp.gte = parsedStartDate
      }
      if (endDate) {
        const parsedEndDate = new Date(endDate)
        where.timestamp.lte = parsedEndDate
      }
      
      // Tarih aralığı kontrolü
      if (startDate && endDate) {
        const daysDiff = Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
        if (daysDiff > ADMIN.LOGS.MAX_DAYS_RANGE) {
          return NextResponse.json(
            { success: false, error: `Tarih aralığı en fazla ${ADMIN.LOGS.MAX_DAYS_RANGE} gün olabilir.` },
            { status: 400 }
          )
        }
      }
    }

    // 4. DB servisi aracılığıyla logları getir
    const orderBy = {
      [sortBy || 'timestamp']: sortOrder || 'desc'
    }
    
    const [logs, total] = await Promise.all([
      findLogsWithUser(where, orderBy, limit, offset),
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