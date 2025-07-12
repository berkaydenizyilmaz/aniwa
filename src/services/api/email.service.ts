// Bu dosya email gönderim işlemlerini yönetir (Resend API)

import { Resend } from 'resend'
import { env } from '@/lib/env'
import { logInfo, logError } from '@/services/business/logger.service'
import { LOG_EVENTS } from '@/constants/logging'
import { EMAIL_SENDER, EMAIL_SUBJECTS, EMAIL_CONTENT, EMAIL_STYLES } from '@/constants/email'
import { z } from 'zod'
import type { ApiResponse } from '@/types/api'

// Resend client
const resend = new Resend(env.RESEND_API_KEY)

// Email gönderme sonuç tipi
export interface EmailSendResult {
  id?: string
  from: string
  to: string
  subject: string
}

// Base email gönderme parametreleri
interface SendEmailParams {
  to: string
  subject: string
  html: string
  from?: string
}

// Şifre sıfırlama email parametreleri
interface SendPasswordResetEmailParams {
  to: string
  username: string
  resetUrl: string
}

// Şifre sıfırlama email şeması
const sendPasswordResetEmailSchema = z.object({
  to: z.string().email('Geçerli email adresi gerekli'),
  username: z.string().min(1, 'Kullanıcı adı gerekli'),
  resetUrl: z.string().url('Geçerli URL gerekli')
})

// Email şablonu oluştur
const createEmailTemplate = (content: string): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Aniwa</title>
        <style>
          ${EMAIL_STYLES}
        </style>
      </head>
      <body>
        <div class="container">
          ${content}
          
          <div class="footer">
            <p>Bu email Aniwa tarafından gönderilmiştir.</p>
            <p>Eğer bu işlemi siz yapmadıysanız, lütfen bu emaili dikkate almayın.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

// Base email gönderim fonksiyonu
async function sendEmail(params: SendEmailParams): Promise<ApiResponse<EmailSendResult>> {
  try {
    const { to, subject, html, from = EMAIL_SENDER.FROM_ADDRESS } = params

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    })

    if (error) {
      logError(LOG_EVENTS.API_CALL, 'Resend API hatası', {
        error: error.message,
        to,
        subject
      })

      return {
        success: false,
        error: 'Email gönderilemedi'
      }
    }

    logInfo(LOG_EVENTS.API_CALL, 'Email başarıyla gönderildi', {
      emailId: data?.id,
      to,
      subject
    })

    return {
      success: true,
      data: {
        id: data?.id,
        from,
        to,
        subject
      }
    }

  } catch (error) {
    logError(LOG_EVENTS.SERVICE_ERROR, 'Email gönderim hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      to: params.to,
      subject: params.subject
    })

    return {
      success: false,
      error: 'Email gönderilemedi'
    }
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
        
        <p>${EMAIL_CONTENT.PASSWORD_RESET.SECURITY_NOTE}</p>
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
export async function sendPasswordChangeNotificationEmail(
  params: { to: string; username: string }
): Promise<ApiResponse<EmailSendResult>> {
  try {
    const { to, username } = params

    const content = `
      <h1 style="color: #1f2937; font-size: 24px; margin-bottom: 20px;">Şifre Değişikliği Bildirimi</h1>
      
      <div class="content">
        <p>Merhaba <strong>${username}</strong>,</p>
        
        <p>Hesabınızın şifresi başarıyla değiştirildi.</p>
        
        <div class="warning">
          <strong>⚠️ Önemli:</strong> Eğer bu değişikliği siz yapmadıysanız, lütfen derhal bizimle iletişime geçin.
        </div>
        
        <p>Güvenliğiniz için hesabınızı düzenli olarak kontrol etmenizi öneririz.</p>
      </div>
    `

    const html = createEmailTemplate(content)

    const result = await sendEmail({
      to,
      subject: 'Aniwa - Şifre Değişikliği Bildirimi',
      html,
    })

    return result

  } catch (error) {
    logError(LOG_EVENTS.SERVICE_ERROR, 'Şifre değişikliği bildirim email gönderim hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      to: params.to
    })

    return { success: false, error: 'Email gönderilemedi' }
  }
} 