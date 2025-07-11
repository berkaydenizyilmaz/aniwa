// Aniwa Projesi - Email Sabitleri
// Bu dosya email sistemi ile ilgili tüm sabitleri içerir

import { PASSWORD_RESET_TOKEN_EXPIRY_HOURS } from "./auth";

// Email Gönderen Bilgileri
export const EMAIL_SENDER = {
  FROM_ADDRESS: 'Aniwa <noreply@aniwa.tr>',
  BRAND_NAME: 'aniwa',
  DOMAIN: 'aniwa.tr',
} as const

// Email Konuları
export const EMAIL_SUBJECTS = {
  PASSWORD_RESET: 'Aniwa - Şifre Sıfırlama',
  PASSWORD_CHANGED: 'Aniwa - Şifreniz Değiştirildi',
} as const

// Email Template Ortak Stilleri
export const EMAIL_STYLES = `
  body { margin: 0; padding: 0; background-color: #f8f9fa; font-family: Arial, sans-serif; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; }
  .content { padding: 30px 0; line-height: 1.6; color: #374151; }
  .button { display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
  .footer { text-align: center; padding: 20px 0; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 14px; }
  .warning { background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 12px; margin: 20px 0; font-size: 14px; }
  .link { word-break: break-all; color: #6b7280; font-size: 14px; }
`

// Email Template Metinleri
export const EMAIL_CONTENT = {
  PASSWORD_RESET: {
    SUBJECT: 'Şifre Sıfırlama',
    GREETING: 'Merhaba!',
    MESSAGE: 'Şifre sıfırlama talebinde bulundun. Yeni şifre oluşturmak için aşağıdaki butona tıkla:',
    BUTTON_TEXT: 'Şifremi Sıfırla',
    EXPIRY_NOTE: 'Bu link ' + PASSWORD_RESET_TOKEN_EXPIRY_HOURS + ' saat boyunca geçerlidir.',
    ALTERNATIVE: 'Eğer buton çalışmıyorsa, aşağıdaki linki tarayıcına kopyala:',
    SECURITY_NOTE: 'Eğer bu talebi sen yapmadıysan, bu emaili görmezden gel.',  
  },
  PASSWORD_CHANGED: {
    SUBJECT: 'Şifreniz Değiştirildi',
    GREETING: 'Merhaba!',
    MESSAGE: 'Hesabının şifresi başarıyla değiştirildi.',
    SECURITY_MESSAGE: 'Eğer bu değişikliği sen yapmadıysan, hemen bizimle iletişime geç.',
    CONTACT_BUTTON: 'İletişime Geç',
    SECURITY_NOTE: 'Hesabının güvenliği bizim için çok önemlidir. Herhangi bir şüpheniz varsa lütfen destek ekibimizle iletişime geçin.',
  },
} as const 