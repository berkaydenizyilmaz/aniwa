// Bu dosya log kayıtlarının CRUD işlemlerini yönetir

import { prisma } from '@/lib/db/prisma'
import { Prisma, UserRole, LogLevel } from '@prisma/client'
import { createLogSchema, logFiltersSchema } from '@/schemas/admin'
import type { ApiResponse } from '@/types'
import type { LogFilters, LogWithUser, LogListResponse, CreateLogParams } from '@/types/admin'

// Log kullanıcı seçimi
const logUserSelect = {
  id: true,
  username: true,
  email: true,
  roles: true,
}

// Yeni log kaydı oluşturur
export async function createLog(params: CreateLogParams): Promise<ApiResponse<LogWithUser>> {
  try {
    // 1. Girdi validasyonu
    const validatedParams = createLogSchema.parse(params)

    // 2. Guard clauses
    if (!validatedParams.event || !validatedParams.message) {
      return { success: false, error: 'Event ve mesaj gerekli' }
    }

    // 3. Ana işlem - Log kaydı oluştur
    const log = await prisma.log.create({
      data: {
        level: validatedParams.level,
        event: validatedParams.event,
        message: validatedParams.message,
        metadata: (validatedParams.metadata as Prisma.JsonValue) || null,
        userId: validatedParams.userId || null,
      },
      include: {
        user: { select: logUserSelect },
      },
    })

    return { success: true, data: log as LogWithUser }

  } catch {
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

    // 2. Guard clauses
    if (limit > 100) {
      return { success: false, error: 'Limit maksimum 100 olabilir' }
    }

    // 3. Ana işlem - Filtreleme koşullarını oluştur
    const where: Prisma.LogWhereInput = {}

    if (level) where.level = { in: level as LogLevel[] }
    if (event && event.length > 0) {
      where.event = { in: event }
    }
    if (userId) where.userId = userId
    
    // Rol bazlı filtreleme
    if (userRoles && userRoles.length > 0) {
      where.user = {
        roles: { hasSome: userRoles as UserRole[] }
      }
    }
    
    if (startDate || endDate) {
      where.timestamp = {}
      if (startDate) where.timestamp.gte = startDate
      if (endDate) where.timestamp.lte = endDate
    }

    // Logları getir
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
        logs: logs as LogWithUser[],
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
    }

  } catch {
    return { 
      success: false, 
      error: 'Loglar listelenemedi' 
    }
  }
}

// Log kaydını ID ile getirir
export async function getLogById(id: string): Promise<ApiResponse<LogWithUser | null>> {
  try {
    // 1. Girdi validasyonu
    if (!id || typeof id !== 'string') {
      return { success: false, error: 'Geçersiz log ID' }
    }

    // 2. Guard clauses
    if (id.length !== 24) {
      return { success: false, error: 'Log ID formatı hatalı' }
    }

    // 3. Ana işlem - Log kaydını getir
    const log = await prisma.log.findUnique({
      where: { id },
      include: {
        user: { select: logUserSelect },
      },
    })

    return { success: true, data: log as LogWithUser | null }

  } catch {
    return { 
      success: false, 
      error: 'Log kaydı getirilemedi' 
    }
  }
}

// Belirli tarihten eski logları siler (Maintenance işlemi)
export async function deleteOldLogs(daysOld: number): Promise<ApiResponse<{ deletedCount: number }>> {
  try {
    // 1. Girdi validasyonu
    if (!daysOld || typeof daysOld !== 'number' || daysOld <= 0) {
      return { success: false, error: 'Geçersiz gün sayısı' }
    }

    // 2. Guard clauses
    if (daysOld < 7) {
      return { success: false, error: 'En az 7 günlük loglar tutulmalı' }
    }

    // 3. Ana işlem - Eski logları sil
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

  } catch {
    return {
      success: false,
      error: 'Eski loglar silinemedi'
    }
  }
} 