// API Yanıt Tipleri
// Bu dosya, proje genelindeki tüm API yanıtları için standart tip tanımlarını içerir.

// API'den dönen hatalar için standart yapı.
export interface ApiError {
  message: string;
  code?: string | number; // Opsiyonel hata kodu (örn: 'INVALID_INPUT')
}

// API Response tipi tanımlamaları
export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  details?: Record<string, unknown>;
  message?: string;
  warning?: string;
};

// Hata response tipi
export type ApiErrorResponse = {
  success: false;
  error: string;
  details?: Record<string, unknown>;
};

// Başarılı response tipi
export type ApiSuccessResponse<T = unknown> = {
  success: true;
  data?: T;
  message?: string;
}; 