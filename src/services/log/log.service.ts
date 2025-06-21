import { prisma } from '@/lib/db/prisma'
import { Prisma, LogLevel, UserRole } from '@prisma/client'
import { LOG_CLEANUP_DEFAULTS } from '@/lib/constants/logging'
import { PAGINATION_DEFAULTS } from '@/lib/constants/app'
import type { 
  CreateLogParams, 
  LogFilters, 
  LogServiceResponse, 
  LogWithUser, 
  LogListResponse,
  RoleBasedLogStats,
  LogUserSelect,
  LogStats,
  CleanupResult,
  DateRange
} from '@/types/logging'

// User select sabitini kullan - DRY prensibi
const USER_SELECT: { select: LogUserSelect } = {
  select: {
    id: true,
    username: true,
    email: true,
    roles: true,
  }
}

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
        user: USER_SELECT,
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
      limit = PAGINATION_DEFAULTS.LIMIT,
      offset = PAGINATION_DEFAULTS.OFFSET,
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
          user: USER_SELECT,
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
        user: USER_SELECT,
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
export async function cleanOldLogs(olderThanDays: number = LOG_CLEANUP_DEFAULTS.OLDER_THAN_DAYS): Promise<LogServiceResponse<CleanupResult>> {
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
export async function getLogStats(dateRange?: DateRange): Promise<LogServiceResponse<LogStats>> {
  try {
    const where: Prisma.LogWhereInput = {}
    
    if (dateRange?.startDate || dateRange?.endDate) {
      where.timestamp = {}
      if (dateRange.startDate) where.timestamp.gte = dateRange.startDate
      if (dateRange.endDate) where.timestamp.lte = dateRange.endDate
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
    }, {} as LogStats)

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
export async function getLogStatsByRole(dateRange?: DateRange): Promise<LogServiceResponse<RoleBasedLogStats[]>> {
  try {
    const where: Prisma.LogWhereInput = {
      user: { isNot: null } // Sadece kullanıcı logları
    }
    
    if (dateRange?.startDate || dateRange?.endDate) {
      where.timestamp = {}
      if (dateRange.startDate) where.timestamp.gte = dateRange.startDate
      if (dateRange.endDate) where.timestamp.lte = dateRange.endDate
    }

    // Tüm logları user ile birlikte getir
    const logs = await prisma.log.findMany({
      where,
      include: {
        user: {
          select: {
            roles: true
          }
        }
      }
    })

    // Manuel olarak gruplama yap - her kullanıcı birden fazla role sahip olabilir
    const roleMap = new Map<UserRole, RoleBasedLogStats>()

    logs.forEach(log => {
      if (!log.user || !log.user.roles) return
      
      const level = log.level
      
      // Her rol için ayrı ayrı sayım yap
      log.user.roles.forEach(role => {
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
