// Aniwa Projesi - Log Database Service
// Bu dosya log kayıtlarının CRUD işlemlerini yönetir

import { prisma } from '@/lib/db/prisma'
import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { createLogSchema, logFiltersSchema } from '@/lib/schemas/log.schemas'
import type { ApiResponse } from '@/types/api'
import type {
  CreateLogParams,
  LogFilters,
  LogWithUser,
  LogListResponse
} from '@/types/logging'
import { logUserSelect } from '@/types/logging'

// Yeni log kaydı oluşturur
export async function createLog(params: CreateLogParams): Promise<ApiResponse<LogWithUser>> {
  try {
    // 1. Girdi validasyonu
    const validatedParams = createLogSchema.parse(params)

    // 2. Log kaydı oluştur
    const log = await prisma.log.create({
      data: {
        level: validatedParams.level,
        event: validatedParams.event,
        message: validatedParams.message,
        metadata: validatedParams.metadata,
        userId: validatedParams.userId,
      },
      include: {
        user: { select: logUserSelect },
      },
    })

    return { success: true, data: log }

  } catch (error) {
    // Hata yönetimi
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return { success: false, error: 'Log kaydı zaten mevcut' }
      }
    }

    console.error('Log oluşturma hatası:', error)
    return { 
      success: false, 
      error: 'Log kaydı oluşturulamadı'
    }
  }
}

// Logları filtreler ve listeler
export async function getLogs(filters: LogFilters = {}): Promise<ApiResponse<LogListResponse>> {
  try {
    // 1. Girdi validasyonu
    const validatedFilters = logFiltersSchema.parse(filters)
    
    const {
      level,
      event,
      userId,
      userRoles,
      startDate,
      endDate,
      limit,
      offset,
    } = validatedFilters

    // 2. Filtreleme koşullarını oluştur
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

    // 3. Logları getir
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
    // Hata yönetimi
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }

    console.error('Log listeleme hatası:', error)
    return { 
      success: false, 
      error: 'Loglar listelenemedi' 
    }
  }
}

// Log kaydını ID ile getirir
export async function getLogById(id: string): Promise<ApiResponse<LogWithUser | null>> {
  try {
    const log = await prisma.log.findUnique({
      where: { id },
      include: {
        user: { select: logUserSelect },
      },
    })

    return { success: true, data: log }
  } catch (error) {
    console.error('Log getirme hatası:', error)
    return { 
      success: false, 
      error: 'Log kaydı getirilemedi' 
    }
  }
}

// Belirli tarihten eski logları siler
export async function deleteOldLogs(daysOld: number): Promise<ApiResponse<{ deletedCount: number }>> {
  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    const result = await prisma.log.deleteMany({
      where: {
        timestamp: {
          lt: cutoffDate
        }
      }
    })

    return {
      success: true,
      data: { deletedCount: result.count }
    }
  } catch (error) {
    console.error('Eski log silme hatası:', error)
    return {
      success: false,
      error: 'Eski loglar silinemedi'
    }
  }
} 