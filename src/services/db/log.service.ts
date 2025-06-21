import { prisma } from '@/lib/prisma'
import { Prisma, LogLevel } from '@prisma/client'; 

export interface CreateLogParams {
  level: LogLevel
  event: string
  message: string
  metadata?: Prisma.JsonValue
  userId?: string
}

export interface LogFilters {
  level?: LogLevel
  event?: string
  userId?: string
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}

/**
 * Log servis sınıfı - Uygulama loglarını yönetir
 */
export class LogService {
  /**
   * Yeni log kaydı oluşturur
   */
  static async createLog(params: CreateLogParams) {
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
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      })

      return { success: true, data: log }
    } catch (error) {
      console.error('Log oluşturma hatası:', error)
      return { 
        success: false, 
        error: 'Log kaydı oluşturulamadı' 
      }
    }
  }

  /**
   * Logları filtreler ve listeler
   */
  static async getLogs(filters: LogFilters = {}) {
    try {
      const {
        level,
        event,
        userId,
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
      if (startDate || endDate) {
        where.timestamp = {}
        if (startDate) where.timestamp.gte = startDate
        if (endDate) where.timestamp.lte = endDate
      }

      const [logs, total] = await Promise.all([
        prisma.log.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
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
        error: 'Loglar listelenemedi' 
      }
    }
  }

  /**
   * Belirli bir log kaydını ID ile getirir
   */
  static async getLogById(id: string) {
    try {
      const log = await prisma.log.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      })

      if (!log) {
        return { success: false, error: 'Log kaydı bulunamadı' }
      }

      return { success: true, data: log }
    } catch (error) {
      console.error('Log getirme hatası:', error)
      return { 
        success: false, 
        error: 'Log kaydı getirilemedi' 
      }
    }
  }

  /**
   * Belirli tarihten eski logları siler (temizlik için)
   */
  static async cleanOldLogs(olderThanDays: number = 30) {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays)

      const result = await prisma.log.deleteMany({
        where: {
          timestamp: {
            lt: cutoffDate,
          },
        },
      })

      return { 
        success: true, 
        data: { deletedCount: result.count } 
      }
    } catch (error) {
      console.error('Eski log temizleme hatası:', error)
      return { 
        success: false, 
        error: 'Eski loglar temizlenemedi' 
      }
    }
  }

  /**
   * Log seviyelerine göre istatistik getirir
   */
  static async getLogStats(startDate?: Date, endDate?: Date) {
    try {
      const where: Prisma.LogWhereInput = {}
      
      if (startDate || endDate) {
        where.timestamp = {}
        if (startDate) where.timestamp.gte = startDate
        if (endDate) where.timestamp.lte = endDate
      }

      const stats = await prisma.log.groupBy({
        by: ['level'],
        where,
        _count: {
          level: true,
        },
      })

      const formattedStats = stats.reduce((acc, stat) => {
        acc[stat.level] = stat._count.level
        return acc
      }, {} as Record<LogLevel, number>)

      return { success: true, data: formattedStats }
    } catch (error) {
      console.error('Log istatistik hatası:', error)
      return { 
        success: false, 
        error: 'Log istatistikleri getirilemedi' 
      }
    }
  }
}

// Hızlı kullanım için yardımcı fonksiyonlar
export const logError = (event: string, message: string, metadata?: Prisma.JsonValue, userId?: string) =>
  LogService.createLog({ level: 'ERROR', event, message, metadata, userId })

export const logWarn = (event: string, message: string, metadata?: Prisma.JsonValue, userId?: string) =>
  LogService.createLog({ level: 'WARN', event, message, metadata, userId })

export const logInfo = (event: string, message: string, metadata?: Prisma.JsonValue, userId?: string) =>
  LogService.createLog({ level: 'INFO', event, message, metadata, userId })

export const logDebug = (event: string, message: string, metadata?: Prisma.JsonValue, userId?: string) =>
  LogService.createLog({ level: 'DEBUG', event, message, metadata, userId })