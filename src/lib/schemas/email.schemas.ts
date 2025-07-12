// Bu dosya email gönderim validasyon şemalarını içerir

import { z } from 'zod'

// Genel email gönderim şeması
export const sendEmailSchema = z.object({
  to: z.string().email('Geçersiz alıcı email adresi'),
  subject: z.string().min(1, 'Email konusu gerekli'),
  html: z.string().min(1, 'Email içeriği gerekli'),
  from: z.string().email('Geçersiz gönderici email adresi').optional()
})

// Email doğrulama gönderim şeması
export const sendVerificationEmailSchema = z.object({
  to: z.string().email('Geçersiz email adresi'),
  username: z.string().min(1, 'Kullanıcı adı gerekli'),
  verificationUrl: z.string().url('Geçersiz doğrulama URL\'si')
})

// Şifre sıfırlama email şeması
export const sendPasswordResetEmailSchema = z.object({
  to: z.string().email('Geçersiz email adresi'),
  username: z.string().min(1, 'Kullanıcı adı gerekli'),
  resetUrl: z.string().url('Geçersiz sıfırlama URL\'si')
})

// Şifre değişikliği bildirim email şeması
export const sendPasswordChangedNotificationSchema = z.object({
  to: z.string().email('Geçersiz email adresi'),
  username: z.string().min(1, 'Kullanıcı adı gerekli'),
  changeTime: z.string().min(1, 'Değişiklik zamanı gerekli')
})

// Tip çıkarımları
export type SendEmailData = z.infer<typeof sendEmailSchema>
export type SendVerificationEmailData = z.infer<typeof sendVerificationEmailSchema>
export type SendPasswordResetEmailData = z.infer<typeof sendPasswordResetEmailSchema>
export type SendPasswordChangedNotificationData = z.infer<typeof sendPasswordChangedNotificationSchema> 