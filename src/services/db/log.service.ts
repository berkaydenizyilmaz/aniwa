// Aniwa Projesi - Log Database Service
// Bu dosya log kayıtlarının CRUD işlemlerini yönetir

import { prisma } from '@/lib/db/prisma'
import { Prisma, UserRole } from '@prisma/client'
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
import { LOG_EVENTS } from '@/constants/logging'

// Yeni log kaydı oluşturur
export async function createLog(params: CreateLogParams): Promise<ApiResponse<LogWithUser>> {
  try {
    // 1. Girdi validasyonu
    const validatedParams = createLogSchema.parse(params)

    // 2. Ön koşul kontrolleri (guard clauses)
    if (!validatedParams.event || !validatedParams.message) {
      return { success: false, error: 'Event ve mesaj gerekli' }
    }

    // 3. Ana iş mantığı - Log kaydı oluştur
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

    // 4. Başarı loglaması (sadece önemli işlemler için)
    if (validatedParams.level === 'ERROR') {
      console.info(`[LOG_CREATED] Error log kaydı oluşturuldu: ${validatedParams.event}`)
    }

    // 5. Başarılı yanıt
    return { success: true, data: log }

  } catch (error) {
    // 6. Hata loglaması
    console.error(`[${LOG_EVENTS.DATABASE_ERROR}] Log oluşturma hatası:`, {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      event: params.event,
      level: params.level
    })

    // 7. Hata yanıtı
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return { success: false, error: 'Log kaydı zaten mevcut' }
      }
    }

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

    // 2. Ön koşul kontrolleri (guard clauses)
    if (limit > 100) {
      return { success: false, error: 'Limit maksimum 100 olabilir' }
    }

    // 3. Ana iş mantığı - Filtreleme koşullarını oluştur
    const where: Prisma.LogWhereInput = {}

    if (level) where.level = level
    if (event) where.event = { contains: event, mode: 'insensitive' }
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

    // 4. Başarı loglaması (sadece büyük sorgular için)
    if (total > 1000) {
      console.info(`[LOG_QUERY] Büyük log sorgusu: ${total} kayıt`, {
        filters: validatedFilters,
        resultCount: logs.length
      })
    }

    // 5. Başarılı yanıt
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
    // 6. Hata loglaması
    console.error(`[${LOG_EVENTS.DATABASE_ERROR}] Log listeleme hatası:`, {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      filters
    })

    // 7. Hata yanıtı
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }

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

    // 2. Ön koşul kontrolleri (guard clauses)
    if (id.length !== 24) {
      return { success: false, error: 'Log ID formatı hatalı' }
    }

    // 3. Ana iş mantığı - Log kaydını getir
    const log = await prisma.log.findUnique({
      where: { id },
      include: {
        user: { select: logUserSelect },
      },
    })

    // 4. Başarı loglaması (gerekli değil, basit sorgu)
    
    // 5. Başarılı yanıt
    return { success: true, data: log }

  } catch (error) {
    // 6. Hata loglaması
    console.error(`[${LOG_EVENTS.DATABASE_ERROR}] Log getirme hatası:`, {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      logId: id
    })

    // 7. Hata yanıtı
    return { 
      success: false, 
      error: 'Log kaydı getirilemedi' 
    }
  }
}

// Belirli tarihten eski logları siler
export async function deleteOldLogs(daysOld: number): Promise<ApiResponse<{ deletedCount: number }>> {
  try {
    // 1. Girdi validasyonu
    if (!daysOld || typeof daysOld !== 'number' || daysOld <= 0) {
      return { success: false, error: 'Geçersiz gün sayısı' }
    }

    // 2. Ön koşul kontrolleri (guard clauses)
    if (daysOld < 7) {
      return { success: false, error: 'En az 7 günlük loglar tutulmalı' }
    }

    // 3. Ana iş mantığı - Eski logları sil
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    const result = await prisma.log.deleteMany({
      where: {
        timestamp: {
          lt: cutoffDate
        }
      }
    })

    // 4. Başarı loglaması
    console.info(`[LOG_CLEANUP] Eski loglar silindi`, {
      daysOld,
      cutoffDate: cutoffDate.toISOString(),
      deletedCount: result.count
    })

    // 5. Başarılı yanıt
    return {
      success: true,
      data: { deletedCount: result.count }
    }

  } catch (error) {
    // 6. Hata loglaması
    console.error(`[${LOG_EVENTS.DATABASE_ERROR}] Eski log silme hatası:`, {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      daysOld
    })

    // 7. Hata yanıtı
    return {
      success: false,
      error: 'Eski loglar silinemedi'
    }
  }
} 