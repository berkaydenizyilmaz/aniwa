// Business error sınıflarında kullanılan hata kodları
export const ERROR_CODES = {
  // Genel hatalar
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  
  // Kaynak bulunamadı hataları
  NOT_FOUND: 'NOT_FOUND',
  
  // Yetkilendirme hataları
  UNAUTHORIZED: 'UNAUTHORIZED',
  
  // Çakışma hataları
  CONFLICT: 'CONFLICT',
  
  // Validasyon hataları
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  
  // Rate limit hataları
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  
  // Token hataları
  INVALID_TOKEN: 'INVALID_TOKEN',
  
  // Kullanıcı durumu hataları
  USER_BANNED: 'USER_BANNED',
  
  // Dış servis hataları
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
} as const;