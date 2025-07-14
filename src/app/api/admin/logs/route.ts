import { NextRequest, NextResponse } from 'next/server'
import { findLogsWithUser, countLogs } from '@/services/db/log.db'
import { LogLevel } from '@prisma/client'
import type { PaginatedResponse, LogWithUser } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const offset = (page - 1) * limit
    const level = searchParams.getAll('level')
    const event = searchParams.getAll('event')
    const userId = searchParams.get('userId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Where koşulları
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
      if (startDate) where.timestamp.gte = new Date(startDate)
      if (endDate) where.timestamp.lte = new Date(endDate)
    }

    // Logları getir
    const [logs, total] = await Promise.all([
      findLogsWithUser(where, { timestamp: 'desc' }, limit, offset),
      countLogs(where)
    ])

    // PaginatedResponse tipinde döndür
    const totalPages = Math.ceil(total / limit)
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
    console.error('Loglar getirme hatası:', error)
    
    return NextResponse.json(
      { success: false, error: 'Loglar getirilirken hata oluştu' },
      { status: 500 }
    )
  }
} 