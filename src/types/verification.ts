// Bu dosya doğrulama token sistemi ile ilgili tüm tip tanımlarını içerir

// Verification token türleri - Sadece şifre sıfırlama
export type VerificationTokenType = 'PASSWORD_RESET'

// Verification token oluşturma parametreleri
export interface CreateVerificationTokenParams {
  email: string
  type: VerificationTokenType
  expiryHours: number
}

// Verification token doğrulama parametreleri
export interface VerifyTokenParams {
  token: string
  type: VerificationTokenType
}

// Token doğrulama sonucu
export interface VerifyTokenResult {
  email: string
}

// Token temizleme sonucu
export interface TokenCleanupResult {
  deletedCount: number
} 