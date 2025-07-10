// Aniwa Projesi - Email Service
// Bu dosya Resend ile email gönderim işlemlerini yönetir

import { Resend } from 'resend'
import { env } from '@/lib/env'
import { logInfo, logError } from '@/lib/logger'
import { LOG_EVENTS } from '@/constants/logging'
import { EMAIL_SENDER, EMAIL_SUBJECTS, EMAIL_CONTENT, EMAIL_STYLES } from '@/constants/email'
import { 
  sendEmailSchema,
  sendVerificationEmailSchema,
  sendPasswordResetEmailSchema,
  sendPasswordChangedNotificationSchema
} from '@/lib/schemas/email.schemas'
import { z } from 'zod'
import type { ApiResponse } from '@/types/api'
import type { 
  EmailSendResult,
  SendEmailParams,
  SendVerificationEmailParams,
  SendPasswordResetEmailParams,
  SendPasswordChangedNotificationParams
} from '@/types/email'

// Resend client'ı oluştur
const resend = new Resend(env.RESEND_API_KEY)

// Genel email gönderim fonksiyonu
async function sendEmail(params: SendEmailParams): Promise<ApiResponse<EmailSendResult>> {
  try {
    // 1. Girdi validasyonu
    const validatedParams = sendEmailSchema.parse(params)
    const { to, subject, html, from = EMAIL_SENDER.FROM_ADDRESS } = validatedParams

    // 2. Ön koşul kontrolleri (guard clauses)
    if (!env.RESEND_API_KEY) {
      return { success: false, error: 'Email servisi yapılandırılmamış' }
    }

    // 3. Ana iş mantığı - Email gönderim
    const result = await resend.emails.send({
      from,
      to: [to],
      subject,
      html,
    })

    if (result.error) {
      logError(LOG_EVENTS.API_CALL, 'Resend API hatası', {
        error: result.error.message,
        to,
        subject,
        provider: 'resend'
      })
      
      return {
        success: false,
        error: `Email gönderim hatası: ${result.error.message}`
      }
    }

    // 4. Başarı loglaması
    logInfo(LOG_EVENTS.API_CALL, 'Email başarıyla gönderildi', {
      to,
      subject,
      emailId: result.data?.id,
      provider: 'resend'
    })

    // 5. Başarılı yanıt
    return {
      success: true,
      data: { id: result.data?.id || '' }
    }

  } catch (error) {
    // 6. Hata loglaması
    logError(LOG_EVENTS.SERVICE_ERROR, 'Email gönderim hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      to: params.to,
      subject: params.subject,
      provider: 'resend'
    })

    // 7. Hata yanıtı
    return {
      success: false,
      error: 'Email gönderilemedi'
    }
  }
}

// Email template için temel HTML yapısı oluşturur
function createEmailTemplate(content: string): string {
  return `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${EMAIL_SENDER.BRAND_NAME}</title>
      <style>
        body { margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { ${EMAIL_STYLES.CONTAINER} }
        .header { ${EMAIL_STYLES.HEADER} }
        .logo { ${EMAIL_STYLES.LOGO} }
        .content { ${EMAIL_STYLES.CONTENT} }
        .button { ${EMAIL_STYLES.BUTTON} }
        .footer { ${EMAIL_STYLES.FOOTER} }
        .warning { background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 12px; margin: 20px 0; font-size: 14px; }
        .success { background-color: #d1fae5; border: 1px solid #10b981; border-radius: 6px; padding: 12px; margin: 20px 0; font-size: 14px; }
        .link { word-break: break-all; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">${EMAIL_SENDER.BRAND_NAME}</div>
        </div>
        
        ${content}
        
        <div class="footer">
          <p>${EMAIL_CONTENT.FOOTER.BRAND}</p>
          <p>${EMAIL_CONTENT.FOOTER.COPYRIGHT}</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Email doğrulama emaili gönderir
export async function sendVerificationEmail(
  params: SendVerificationEmailParams
): Promise<ApiResponse<EmailSendResult>> {
  try {
    // 1. Girdi validasyonu
    const validatedParams = sendVerificationEmailSchema.parse(params)
    const { to, username, verificationUrl } = validatedParams

    // 2. Ön koşul kontrolleri (guard clauses)
    if (!verificationUrl.startsWith('http')) {
      return { success: false, error: 'Geçersiz doğrulama URL\'si' }
    }

    // 3. Ana iş mantığı - Email içeriği oluştur
    const content = `
      <h1 style="color: #1f2937; font-size: 24px; margin-bottom: 20px;">${EMAIL_CONTENT.VERIFICATION.SUBJECT}</h1>
      
      <div class="content">
        <p>${EMAIL_CONTENT.VERIFICATION.GREETING} <strong>${username}</strong>,</p>
        
        <p>${EMAIL_CONTENT.VERIFICATION.MESSAGE}</p>
        
        <div style="text-align: center;">
          <a href="${verificationUrl}" class="button">${EMAIL_CONTENT.VERIFICATION.BUTTON_TEXT}</a>
        </div>
        
        <div class="warning">
          <strong>⚠️ Önemli:</strong> ${EMAIL_CONTENT.VERIFICATION.EXPIRY_NOTE}
        </div>
        
        <p>${EMAIL_CONTENT.VERIFICATION.ALTERNATIVE}</p>
        <p class="link">${verificationUrl}</p>
        
        <p>${EMAIL_CONTENT.VERIFICATION.SECURITY_NOTE}</p>
      </div>
    `

    const html = createEmailTemplate(content)

    // 4. Email gönder
    const result = await sendEmail({
      to,
      subject: EMAIL_SUBJECTS.EMAIL_VERIFICATION,
      html,
    })

    // 5. Başarılı yanıt (sendEmail'den dönen sonuç)
    return result

  } catch (error) {
    // 6. Hata loglaması
    logError(LOG_EVENTS.SERVICE_ERROR, 'Email doğrulama gönderim hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      to: params.to
    })
    
    // 7. Hata yanıtı
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    
    return { success: false, error: 'Email gönderilemedi' }
  }
}

// Şifre sıfırlama emaili gönderir
export async function sendPasswordResetEmail(
  params: SendPasswordResetEmailParams
): Promise<ApiResponse<EmailSendResult>> {
  try {
    // 1. Girdi validasyonu
    const validatedParams = sendPasswordResetEmailSchema.parse(params)
    const { to, username, resetUrl } = validatedParams

    // 2. Ön koşul kontrolleri (guard clauses)
    if (!resetUrl.startsWith('http')) {
      return { success: false, error: 'Geçersiz sıfırlama URL\'si' }
    }

    // 3. Ana iş mantığı - Email içeriği oluştur
    const content = `
      <h1 style="color: #1f2937; font-size: 24px; margin-bottom: 20px;">${EMAIL_CONTENT.PASSWORD_RESET.SUBJECT}</h1>
      
      <div class="content">
        <p>${EMAIL_CONTENT.PASSWORD_RESET.GREETING} <strong>${username}</strong>,</p>
        
        <p>${EMAIL_CONTENT.PASSWORD_RESET.MESSAGE}</p>
        
        <div style="text-align: center;">
          <a href="${resetUrl}" class="button">${EMAIL_CONTENT.PASSWORD_RESET.BUTTON_TEXT}</a>
        </div>
        
        <div class="warning">
          <strong>⚠️ Önemli:</strong> ${EMAIL_CONTENT.PASSWORD_RESET.EXPIRY_NOTE}
        </div>
        
        <p>${EMAIL_CONTENT.PASSWORD_RESET.ALTERNATIVE}</p>
        <p class="link">${resetUrl}</p>
        
        <p><strong>${EMAIL_CONTENT.PASSWORD_RESET.SECURITY_NOTE}</strong></p>
      </div>
    `

    const html = createEmailTemplate(content)

    // 4. Email gönder
    const result = await sendEmail({
      to,
      subject: EMAIL_SUBJECTS.PASSWORD_RESET,
      html,
    })

    // 5. Başarılı yanıt (sendEmail'den dönen sonuç)
    return result

  } catch (error) {
    // 6. Hata loglaması
    logError(LOG_EVENTS.SERVICE_ERROR, 'Şifre sıfırlama email gönderim hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      to: params.to
    })
    
    // 7. Hata yanıtı
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    
    return { success: false, error: 'Email gönderilemedi' }
  }
}

// Şifre değişikliği bildirim emaili gönderir
export async function sendPasswordChangedNotification(
  params: SendPasswordChangedNotificationParams
): Promise<ApiResponse<EmailSendResult>> {
  try {
    // 1. Girdi validasyonu
    const validatedParams = sendPasswordChangedNotificationSchema.parse(params)
    const { to, username, changeTime } = validatedParams

    // 2. Ön koşul kontrolleri (guard clauses)
    if (!changeTime || changeTime.trim().length === 0) {
      return { success: false, error: 'Değişiklik zamanı gerekli' }
    }

    // 3. Ana iş mantığı - Email içeriği oluştur
    const content = `
      <h1 style="color: #1f2937; font-size: 24px; margin-bottom: 20px;">${EMAIL_CONTENT.PASSWORD_CHANGED.SUBJECT}</h1>
      
      <div class="content">
        <p>${EMAIL_CONTENT.PASSWORD_CHANGED.GREETING} <strong>${username}</strong>,</p>
        
        <div class="success">
          <strong>✅ ${EMAIL_CONTENT.PASSWORD_CHANGED.MESSAGE}</strong>
        </div>
        
        <p>${EMAIL_CONTENT.PASSWORD_CHANGED.MESSAGE}</p>
        
        <p><strong>Güvenlik Bilgileri:</strong></p>
        <ul>
          <li>Değişiklik Zamanı: ${changeTime}</li>
          <li>Hesap: ${to}</li>
        </ul>
        
        <div class="warning">
          <strong>⚠️ ${EMAIL_CONTENT.PASSWORD_CHANGED.SECURITY_MESSAGE}</strong>
        </div>
        
        <p>${EMAIL_CONTENT.PASSWORD_CHANGED.SECURITY_NOTE}</p>
      </div>
    `

    const html = createEmailTemplate(content)

    // 4. Email gönder
    const result = await sendEmail({
      to,
      subject: EMAIL_SUBJECTS.PASSWORD_CHANGED,
      html,
    })

    // 5. Başarılı yanıt (sendEmail'den dönen sonuç)
    return result

  } catch (error) {
    // 6. Hata loglaması
    logError(LOG_EVENTS.SERVICE_ERROR, 'Şifre değişikliği bildirim email gönderim hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      to: params.to
    })
    
    // 7. Hata yanıtı
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    
    return { success: false, error: 'Email gönderilemedi' }
  }
} 