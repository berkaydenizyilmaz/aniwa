// API Yanıt Tipleri
// Bu dosya, proje genelindeki tüm API yanıtları için standart tip tanımlarını içerir.

// API'den dönen hatalar için standart yapı.
export interface ApiError {
  message: string;
  code?: string | number; // Opsiyonel hata kodu (örn: 'INVALID_INPUT')
}

// Proje genelindeki tüm API yanıtları için standartlaştırılmış genel (generic) tip.
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
} 