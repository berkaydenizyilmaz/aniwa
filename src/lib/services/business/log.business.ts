// Log iş mantığı katmanı

import { 
  BusinessError, 
  NotFoundError
} from '@/lib/errors';
import { 
  findLogById
} from '@/lib/services/db/log.db';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/utils/logger';
import { EVENTS } from '@/lib/constants/events.constants';
import { ApiResponse } from '@/lib/types/api';
import { 
  GetLogResponse, 
  GetLogsResponse,
  GetLogsRequest,
  CreateLogRequest
} from '@/lib/types/api/log.api';

// Logger için internal createLog fonksiyonu
export async function createLogBusiness(
  data: CreateLogRequest,
): Promise<void> {
  try {
    await prisma.log.create({
      data: {
        level: data.level,
        event: data.event,
        message: data.message,
        metadata: data.metadata ? JSON.parse(JSON.stringify(data.metadata)) : null,
        user: data.userId ? { connect: { id: data.userId } } : undefined
      }
    });
  } catch (error) {
    console.error('Failed to create log:', error);
  }
}   

// Log getirme (ID ile)
export async function getLogBusiness(
  id: string,
  adminUser: { id: string; username: string }
): Promise<ApiResponse<GetLogResponse>> {
  try {
    const log = await findLogById(id);
    if (!log) {
      throw new NotFoundError('Log bulunamadı');
    }

    // Başarılı getirme logu
    await logger.info(
      EVENTS.ADMIN.LOG_RETRIEVED,
      'Log başarıyla getirildi',
      { 
        logId: log.id, 
        event: log.event,
        level: log.level,
        adminId: adminUser.id,
        adminUsername: adminUser.username
      }
    );

    return {
      success: true,
      data: log
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Log getirme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', logId: id }
    );
    
    throw new BusinessError('Log getirme başarısız');
  }
}

// Tüm log'ları getirme (filtrelemeli)
export async function getLogsBusiness(
  adminUser: { id: string; username: string },
  filters?: GetLogsRequest
): Promise<ApiResponse<GetLogsResponse>> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;

    // Prisma query oluştur
    const where: Record<string, unknown> = {};
    
    if (filters?.level) {
      where.level = filters.level;
    }
    
    if (filters?.event) {
      where.event = { contains: filters.event, mode: 'insensitive' };
    }
    
    if (filters?.search) {
      where.OR = [
        { message: { contains: filters.search, mode: 'insensitive' } },
        { event: { contains: filters.search, mode: 'insensitive' } }
      ];
    }
    
    if (filters?.startDate && filters?.endDate) {
      where.timestamp = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate)
      };
    }

    // Log'ları getir
    const [logs, total] = await Promise.all([
      prisma.log.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        },
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit
      }),
      prisma.log.count({ where })
    ]);
    
    const totalPages = Math.ceil(total / limit);

    // Başarılı getirme logu
    await logger.info(
      EVENTS.ADMIN.LOGS_RETRIEVED,
      'Loglar başarıyla getirildi',
      { 
        total: logs.length,
        filtered: total,
        adminId: adminUser.id,
        adminUsername: adminUser.username
      }
    );

    return {
      success: true,
      data: {
        logs,
        total,
        page,
        limit,
        totalPages
      }
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Log listeleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', filters }
    );
    
    throw new BusinessError('Log listeleme başarısız');
  }
}

 