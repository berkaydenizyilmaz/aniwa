import { Prisma } from '@prisma/client';
import { DatabaseError, DatabaseConnectionError, DatabaseQueryError } from '@/lib/errors/business-error';
import { logger } from '@/lib/utils/logger';
import { EVENTS } from '@/lib/constants/events.constants';

// DB error handler
export function handleDatabaseError(
  error: unknown,
  operation: string,
  context?: Record<string, unknown>
): never {
  // Log hatayı
  logger.error(
    EVENTS.SYSTEM.DATABASE_ERROR,
    `${operation} sırasında veritabanı hatası`,
    { 
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      operation,
      ...context
    }
  );

  // Prisma hata türlerine göre uygun error fırlat
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    throw new DatabaseQueryError(`${operation} başarısız`, { 
      code: error.code, 
      meta: error.meta,
      operation,
      ...context
    });
  }
  
  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    throw new DatabaseConnectionError('Veritabanı bağlantı hatası', { 
      error: error.message,
      operation,
      ...context
    });
  }
  
  // Genel DB hatası
  throw new DatabaseError(`${operation} sırasında beklenmedik veritabanı hatası`, { 
    error: error instanceof Error ? error.message : 'Bilinmeyen hata',
    operation,
    ...context
  });
} 