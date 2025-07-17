// =============================================================================
// EMAIL SERVICE TIPLERI
// =============================================================================

// Email gönderme sonuç tipi
export interface EmailSendResult {
  id?: string
  from: string
  to: string
  subject: string
}

// Base email gönderme parametreleri
export interface SendEmailParams {
  to: string
  subject: string
  html: string
  from?: string
}

// Şifre sıfırlama email parametreleri
export interface SendPasswordResetEmailParams {
  to: string
  username: string
  resetUrl: string
}

// Şifre değişikliği bildirim email parametreleri
export interface SendPasswordChangeNotificationEmailParams {
  to: string
  username: string
}