import { Resend } from 'resend'
import { env } from '@/lib/env'
import { logError } from '@/services/business/logger.service'
import { LOG_EVENTS } from '@/constants/logging'
import { z } from 'zod'
import type { 
  ApiResponse, 
  EmailSendResult, 
  SendEmailParams, 
  SendPasswordResetEmailParams,
  SendPasswordChangeNotificationEmailParams 
} from '@/types'

// Resend client
const resend = new Resend(env.RESEND_API_KEY)

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
          .button {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
          }
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
    const { to, subject, html, from = 'Aniwa <noreply@aniwa.com>' } = params

    const { data } = await resend.emails.send({
      from,
      to,
      subject,
      html,
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
    logError({
      event: LOG_EVENTS.EMAIL_SEND_ERROR,
      message: 'Email gönderim hatası',
      metadata: {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        to: params.to,
        subject: params.subject
      }
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
      <h1 style="color: #1f2937; font-size: 24px; margin-bottom: 20px;">Şifre Sıfırlama</h1>
      
      <div class="content">
        <p>Merhaba <strong>${username}</strong>,</p>
        
        <p>Şifrenizi sıfırlamak için lütfen aşağıdaki linke tıklayınız.</p>
        
        <div style="text-align: center;">
          <a href="${resetUrl}" class="button">Şifre Sıfırlama</a>
        </div>
        
        <div class="warning">
          <strong>⚠️ Önemli:</strong> Şifre sıfırlama linkiniz 1 saat sonra süresi dolacaktır.
        </div>
        
        <p>Eğer bu işlemi siz yapmadıysanız, lütfen bu emaili dikkate almayın.</p>
        <p class="link">${resetUrl}</p>
        
        <p>Güvenliğiniz için hesabınızı düzenli olarak kontrol etmenizi öneririz.</p>
      </div>
    `

    const html = createEmailTemplate(content)

    // 4. Email gönder
    const result = await sendEmail({
      to,
      subject: 'Şifre Sıfırlama',
      html,
    })

    // 5. Başarılı yanıt (sendEmail'den dönen sonuç)
    return result

  } catch (error) {
    // 6. Hata loglaması
    logError({
      event: LOG_EVENTS.EMAIL_SEND_ERROR,
      message: 'Şifre sıfırlama email gönderim hatası',
      metadata: {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        to: params.to
      }
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
  params: SendPasswordChangeNotificationEmailParams
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
    logError({
      event: LOG_EVENTS.EMAIL_SEND_ERROR,
      message: 'Şifre değişikliği bildirim email gönderim hatası',
      metadata: {
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        to: params.to
      }
    })

    return { success: false, error: 'Email gönderilemedi' }
  }
} 