import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { BusinessError, DatabaseError } from '@/lib/errors';
import { ERROR_CODES } from '@/lib/constants/error.constants';
import { logger } from '@/lib/utils/logger';
import { EVENTS } from '@/lib/constants/events.constants';

// HTTP status kodlarını belirle
function getHttpStatus(errorCode: string): number {
  switch (errorCode) {
    // 4XX Client Errors
    case ERROR_CODES.VALIDATION_ERROR:
      return 400;
    case ERROR_CODES.UNAUTHORIZED:
      return 401;
    case ERROR_CODES.NOT_FOUND:
      return 404;
    case ERROR_CODES.CONFLICT:
      return 409;
    case ERROR_CODES.RATE_LIMIT_EXCEEDED:
      return 429;
    
    // 5XX Server Errors
    case ERROR_CODES.EXTERNAL_SERVICE_ERROR:
      return 502;
    
    // Genel hatalar
    case ERROR_CODES.INVALID_TOKEN:
    case ERROR_CODES.USER_BANNED:
    case ERROR_CODES.UNKNOWN_ERROR:
    default:
      return 400;
  }
}

// Zod hatalarını düz formata çevir
function formatZodErrors(zodError: ZodError) {
  return zodError.issues.map(issue => ({
    field: issue.path.join('.'),
    message: issue.message,
    code: issue.code
  }));
}

// API error handler
export function handleApiError(error: unknown, context?: { endpoint?: string; method?: string; userId?: string }) {
  // Zod validasyon hatası
  if (error instanceof ZodError) {
    // Validation hatası loglanmaz (client hatası)
    return NextResponse.json({
      success: false,
      error: 'Geçersiz veri formatı',
      details: formatZodErrors(error)
    }, { status: 400 });
  }
  
  // Business error - zaten loglanmış
  if (error instanceof BusinessError) {
    const status = getHttpStatus(error.code);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      errorCode: error.code
    }, { status });
  }

  // Database error - zaten loglanmış
  if (error instanceof DatabaseError) {
    return NextResponse.json({
      success: false,
      error: 'Veritabanı hatası'
    }, { status: 500 });
  }
  
  // Beklenmedik hata - logla
  logger.error(
    EVENTS.SYSTEM.API_ERROR,
    'API seviyesinde beklenmedik hata',
    {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      stack: error instanceof Error ? error.stack : undefined,
      endpoint: context?.endpoint,
      method: context?.method,
      userId: context?.userId
    },
    context?.userId
  );

  console.error('API Error:', error);
  return NextResponse.json({
    success: false,
    error: 'Sunucu hatası'
  }, { status: 500 });
} 