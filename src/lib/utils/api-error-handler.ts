import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { BusinessError } from '@/lib/errors';
import { ERROR_CODES } from '@/lib/constants/error.constants';

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
export function handleApiError(error: unknown) {
  // Zod validasyon hatası
  if (error instanceof ZodError) {
    return NextResponse.json({
      success: false,
      error: 'Geçersiz veri formatı',
      details: formatZodErrors(error)
    }, { status: 400 });
  }
  
  // Business error
  if (error instanceof BusinessError) {
    const status = getHttpStatus(error.code);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      errorCode: error.code
    }, { status });
  }
  
  // Beklenmedik hata
  console.error('API Error:', error);
  return NextResponse.json({
    success: false,
    error: 'Sunucu hatası'
  }, { status: 500 });
} 