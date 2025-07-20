import { ZodError } from 'zod';
import { BusinessError } from '@/lib/errors';

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
export function handleServerActionError(error: unknown): ServerActionErrorResponse {
  // Business error'ları yakala
  if (error instanceof BusinessError) {
    return {
      success: false,
      error: error.message
    };
  }

  // Zod validation hatası
  if (error instanceof ZodError) {
    return {
      success: false,
      error: 'Geçersiz veri formatı',
      fieldErrors: error.flatten().fieldErrors
    };
  }

  // Beklenmedik hata
  console.error('Server Action Error:', error);
  return {
    success: false,
    error: 'Bir hata oluştu. Lütfen tekrar deneyin.'
  };
} 