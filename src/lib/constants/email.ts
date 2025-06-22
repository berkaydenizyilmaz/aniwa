// Aniwa Projesi - Email Sabitleri
// Bu dosya email sistemi ile ilgili tüm sabitleri içerir

import { EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS, PASSWORD_RESET_TOKEN_EXPIRY_HOURS } from "./auth";

// Email Gönderen Bilgileri
export const EMAIL_SENDER = {
  FROM_ADDRESS: 'Aniwa <noreply@aniwa.tr>',
  BRAND_NAME: 'aniwa',
  DOMAIN: 'aniwa.tr',
} as const

// Email Konuları
export const EMAIL_SUBJECTS = {
  EMAIL_VERIFICATION: 'Aniwa - Email Adresinizi Doğrulayın',
  PASSWORD_RESET: 'Aniwa - Şifre Sıfırlama',
  PASSWORD_CHANGED: 'Aniwa - Şifreniz Değiştirildi',
} as const

// Email Template Türleri
export const EMAIL_TYPES = {
  EMAIL_VERIFICATION: 'email_verification',
  PASSWORD_RESET: 'password_reset',
  PASSWORD_CHANGED: 'password_changed',
} as const

// Email Template Ortak Stilleri
export const EMAIL_STYLES = {
  CONTAINER: 'font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;',
  HEADER: 'text-align: center; padding: 20px 0; border-bottom: 2px solid #3B82F6;',
  LOGO: 'font-size: 32px; font-weight: bold; color: #3B82F6; text-decoration: none;',
  CONTENT: 'padding: 30px 0; line-height: 1.6; color: #374151;',
  BUTTON: 'display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0;',
  FOOTER: 'text-align: center; padding: 20px 0; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 14px;',
} as const

// Email Template Metinleri
export const EMAIL_CONTENT = {
  VERIFICATION: {
    GREETING: 'Merhaba!',
    MESSAGE: 'Aniwa\'ya hoş geldin! Email adresini doğrulamak için aşağıdaki butona tıkla:',
    BUTTON_TEXT: 'Email Adresimi Doğrula',
    EXPIRY_NOTE: 'Bu link ' + EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS + ' saat boyunca geçerlidir.',
    ALTERNATIVE: 'Eğer buton çalışmıyorsa, aşağıdaki linki tarayıcına kopyala:',
  },
  PASSWORD_RESET: {
    GREETING: 'Merhaba!',
    MESSAGE: 'Şifre sıfırlama talebinde bulundun. Yeni şifre oluşturmak için aşağıdaki butona tıkla:',
    BUTTON_TEXT: 'Şifremi Sıfırla',
    EXPIRY_NOTE: 'Bu link ' + PASSWORD_RESET_TOKEN_EXPIRY_HOURS + ' saat boyunca geçerlidir.',
    ALTERNATIVE: 'Eğer buton çalışmıyorsa, aşağıdaki linki tarayıcına kopyala:',
    SECURITY_NOTE: 'Eğer bu talebi sen yapmadıysan, bu emaili görmezden gel.',  
  },
  PASSWORD_CHANGED: {
    GREETING: 'Merhaba!',
    MESSAGE: 'Hesabının şifresi başarıyla değiştirildi.',
    SECURITY_MESSAGE: 'Eğer bu değişikliği sen yapmadıysan, hemen bizimle iletişime geç.',
    CONTACT_BUTTON: 'İletişime Geç',
    SECURITY_NOTE: 'Hesabının güvenliği bizim için çok önemlidir. Herhangi bir şüpheniz varsa lütfen destek ekibimizle iletişime geçin.',
  },
  FOOTER: {
    BRAND: 'Aniwa - Anime Takip Platformu',
    UNSUBSCRIBE: 'Bu emaili almak istemiyorsan, hesap ayarlarından bildirim tercihlerini değiştirebilirsin.',
    COPYRIGHT: `© ${new Date().getFullYear()} Aniwa. Tüm hakları saklıdır.`,
  },
} as const

// Tip tanımlamaları
export type EmailType = typeof EMAIL_TYPES[keyof typeof EMAIL_TYPES]
export type EmailSubject = typeof EMAIL_SUBJECTS[keyof typeof EMAIL_SUBJECTS] 