// Bu dosya e-posta servisleri ile ilgili tüm tip tanımlarını içerir

// Email send result tipi
export interface EmailSendResult {
  id: string
}

// Send email params tipi
export interface SendEmailParams {
  to: string
  subject: string
  html: string
  from?: string
}

// Send password reset email params tipi
export interface SendPasswordResetEmailParams {
  to: string
  username: string
  resetUrl: string
}

// Send password changed notification params tipi
export interface SendPasswordChangedNotificationParams {
  to: string
  username: string
  changeTime: string
} 