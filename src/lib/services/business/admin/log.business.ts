// Log iş mantığı katmanı

import { 
  BusinessError, 
  NotFoundError,
  DatabaseError
} from '@/lib/errors';
import { 
  findLogByIdDB,
  findAllLogsDB,
  countLogsDB,
  createLogDB
} from '@/lib/services/db/log.db';
import { logger } from '@/lib/utils/logger';
import { EVENTS_DOMAIN } from '@/lib/constants';
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
    await createLogDB({
      level: data.level,
      event: data.event,
      message: data.message,
      metadata: data.metadata ? JSON.parse(JSON.stringify(data.metadata)) : null,
      user: data.userId ? { connect: { id: data.userId } } : undefined
    });
  } catch (error) {
    console.error('Failed to create log:', error);
  }
}   

// Log getirme (ID ile)
export async function getLogBusiness(
  id: string,
  userId: string
): Promise<ApiResponse<GetLogResponse>> {
  try {
    const log = await findLogByIdDB(id);
    if (!log) {
      throw new NotFoundError('Log bulunamadı');
    }



    return {
      success: true,
      data: log
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS_DOMAIN.SYSTEM.BUSINESS_ERROR,
      'Log getirme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', logId: id },
      userId
    );
    
    throw new BusinessError('Log getirme başarısız');
  }
}

// Tüm log'ları getirme (filtrelemeli)
export async function getLogsBusiness(
  userId: string,
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
      where.createdAt = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate)
      };
    } else if (filters?.startDate) {
      where.createdAt = { gte: new Date(filters.startDate) };
    } else if (filters?.endDate) {
      where.createdAt = { lte: new Date(filters.endDate) };
    }

    // Log'ları getir
    const [logs, total] = await Promise.all([
      findAllLogsDB(
        where,
        skip,
        limit,
        { id: 'desc' },
        {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              profilePicture: true
            }
          }
        }
      ),
      countLogsDB(where)
    ]);

    const totalPages = Math.ceil(total / limit);



    return {
      success: true,
      data: {
        data: logs,
        total,
        page,
        limit,
        totalPages
      }
    };
  } catch (error) {
    if (error instanceof BusinessError || error instanceof DatabaseError) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS_DOMAIN.SYSTEM.BUSINESS_ERROR,
      'Log listeleme sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', filters },
      userId
    );
    
    throw new BusinessError('Log listeleme başarısız');
  }
}

 