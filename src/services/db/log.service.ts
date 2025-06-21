import { prisma } from '@/lib/prisma'
import { Prisma, LogLevel, UserRole } from '@prisma/client'
import type { 
  CreateLogParams, 
  LogFilters, 
  LogServiceResponse, 
  LogWithUser, 
  LogListResponse,
  RoleBasedLogStats
} from '@/types/logging'

/**
 * Yeni log kaydı oluşturur
 */
export async function createLog(params: CreateLogParams): Promise<LogServiceResponse<LogWithUser>> {
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
            role: true,
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
  export async function getLogs(filters: LogFilters = {}): Promise<LogServiceResponse<LogListResponse>> {
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
          role: userRoles.length === 1 ? userRoles[0] : { in: userRoles }
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
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              role: true,
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
export async function getLogById(id: string): Promise<LogServiceResponse<LogWithUser>> {
  try {
    const log = await prisma.log.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
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
export async function cleanOldLogs(olderThanDays: number = 30): Promise<LogServiceResponse<{ deletedCount: number }>> {
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
export async function getLogStats(
  startDate?: Date, 
  endDate?: Date
): Promise<LogServiceResponse<Record<LogLevel, number>>> {
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

/**
 * Rol bazlı log istatistikleri getirir
 */
export async function getLogStatsByRole(
  startDate?: Date, 
  endDate?: Date
): Promise<LogServiceResponse<RoleBasedLogStats[]>> {
  try {
    const where: Prisma.LogWhereInput = {
      user: { isNot: null } // Sadece kullanıcı logları
    }
    
    if (startDate || endDate) {
      where.timestamp = {}
      if (startDate) where.timestamp.gte = startDate
      if (endDate) where.timestamp.lte = endDate
    }

    // Tüm logları user ile birlikte getir
    const logs = await prisma.log.findMany({
      where,
      include: {
        user: {
          select: {
            role: true
          }
        }
      }
    })

    // Manuel olarak gruplama yap
    const roleMap = new Map<UserRole, RoleBasedLogStats>()

    logs.forEach(log => {
      if (!log.user) return
      
      const role = log.user.role
      const level = log.level
      
      if (!roleMap.has(role)) {
        roleMap.set(role, {
          role,
          count: 0,
          levels: {} as Record<LogLevel, number>
        })
      }
      
      const roleStat = roleMap.get(role)!
      roleStat.count += 1
      roleStat.levels[level] = (roleStat.levels[level] || 0) + 1
    })

    return { 
      success: true, 
      data: Array.from(roleMap.values()) 
    }
  } catch (error) {
    console.error('Rol bazlı log istatistik hatası:', error)
    return { 
      success: false, 
      error: 'Rol bazlı log istatistikleri getirilemedi' 
    }
  }
}

// Hızlı kullanım için yardımcı fonksiyonlar
export const logError = (event: string, message: string, metadata?: Prisma.JsonValue, userId?: string) =>
  createLog({ level: 'ERROR', event, message, metadata, userId })

export const logWarn = (event: string, message: string, metadata?: Prisma.JsonValue, userId?: string) =>
  createLog({ level: 'WARN', event, message, metadata, userId })

export const logInfo = (event: string, message: string, metadata?: Prisma.JsonValue, userId?: string) =>
  createLog({ level: 'INFO', event, message, metadata, userId })

export const logDebug = (event: string, message: string, metadata?: Prisma.JsonValue, userId?: string) =>
  createLog({ level: 'DEBUG', event, message, metadata, userId })