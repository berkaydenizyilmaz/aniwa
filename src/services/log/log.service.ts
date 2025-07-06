import { prisma } from '@/lib/db/prisma'
import { Prisma } from '@prisma/client'
import type  { ApiResponse } from '@/types/api'
import type {
  CreateLogParams,
  LogFilters,
  LogWithUser,
  LogListResponse
} from '@/types/logging'
import { logUserSelect } from '@/types/logging'

/**
 * Yeni log kaydı oluşturur
 */
export async function createLog(params: CreateLogParams): Promise<ApiResponse<LogWithUser>> {
  try {
    const log = await prisma.log.create({
      data: {
        level: params.level,
        event: params.event,
        message: params.message,
        metadata: params.metadata,
        userId: params.userId,
      },
      include: {
        user: { select: logUserSelect },
      },
    })

    return { success: true, data: log }
  } catch (error) {
    console.error('Log oluşturma hatası:', error)
    return { 
      success: false, 
      error: { message: 'Log kaydı oluşturulamadı' }
    }
  }
}

/**
 * Logları filtreler ve listeler
 */
export async function getLogs(filters: LogFilters = {}): Promise<ApiResponse<LogListResponse>> {
  try {
    const {
      level,
      event,
      userId,
      userRoles,
      startDate,
      endDate,
      limit = 50,
      offset = 0,
    } = filters

    // Filtreleme koşullarını oluştur
    const where: Prisma.LogWhereInput = {}

    if (level) where.level = level
    if (event) where.event = { contains: event, mode: 'insensitive' }
    if (userId) where.userId = userId
    
    // Rol bazlı filtreleme
    if (userRoles && userRoles.length > 0) {
      where.user = {
        roles: { hasSome: userRoles }
      }
    }
    
    if (startDate || endDate) {
      where.timestamp = {}
      if (startDate) where.timestamp.gte = startDate
      if (endDate) where.timestamp.lte = endDate
    }

    const [logs, total] = await Promise.all([
      prisma.log.findMany({
        where,
        include: {
          user: { select: logUserSelect },
        },
        orderBy: { timestamp: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.log.count({ where }),
    ])

    return {
      success: true,
      data: {
        logs,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
    }
  } catch (error) {
    console.error('Log listeleme hatası:', error)
    return { 
      success: false, 
      error: { message: 'Loglar listelenemedi' } 
    }
  }
}