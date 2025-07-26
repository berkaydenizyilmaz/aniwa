import { ZodError } from 'zod';
import { BusinessError, DatabaseError } from '@/lib/errors';
import { logger } from '@/lib/utils/logger';
import { EVENTS } from '@/lib/constants/events.constants';

// Server Action error response type
export type ServerActionErrorResponse = {
  success: false;
  error: string;
  fieldErrors?: Record<string, string[]>;
};

// Server Action success response type
export type ServerActionSuccessResponse<T = unknown> = {
  success: true;
  data: T;
};

// Server Action response type
export type ServerActionResponse<T = unknown> = 
  | ServerActionSuccessResponse<T> 
  | ServerActionErrorResponse;

// Field errors'ı form'a set etmek için helper
export function setFormFieldErrors<T extends Record<string, unknown>>(
  fieldErrors: Record<string, string[]>,
  setError: (name: keyof T, error: { type: string; message: string }) => void
) {
  Object.entries(fieldErrors).forEach(([field, errors]) => {
    if (Array.isArray(errors) && errors.length > 0) {
      setError(field as keyof T, {
        type: 'server',
        message: errors[0]
      });
    }
  });
}

// Server Action error handler
export function handleServerActionError(
  error: unknown, 
  context?: { actionName?: string; userId?: string }
): ServerActionErrorResponse {
  // Business error - zaten loglanmış
  if (error instanceof BusinessError) {
    return {
      success: false,
      error: error.message
    };
  }

  // Database error - zaten loglanmış
  if (error instanceof DatabaseError) {
    return {
      success: false,
      error: 'Veritabanı hatası'
    };
  }

  // Zod validation hatası - loglanmaz (client hatası)
  if (error instanceof ZodError) {
    return {
      success: false,
      error: 'Geçersiz veri formatı',
      fieldErrors: error.flatten().fieldErrors
    };
  }

  // Beklenmedik hata - logla
  logger.error(
    EVENTS.SYSTEM.ACTION_ERROR,
    'Server Action seviyesinde beklenmedik hata',
    {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      stack: error instanceof Error ? error.stack : undefined,
      actionName: context?.actionName,
      userId: context?.userId
    },
    context?.userId
  );

  console.error('Server Action Error:', error);
  return {
    success: false,
    error: 'Bir hata oluştu. Lütfen tekrar deneyin.'
  };
} 