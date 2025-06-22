// Aniwa Projesi - Email Service
// Bu dosya Resend ile email gönderim işlemlerini yönetir

import { Resend } from 'resend'
import { env } from '@/lib/env'
import { logInfo, logError } from '@/lib/logger'
import { LOG_EVENTS } from '@/lib/constants/logging'
import { EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS, PASSWORD_RESET_TOKEN_EXPIRY_HOURS } from '@/lib/constants/auth'
import { EMAIL_TEMPLATES, EMAIL_SUBJECTS } from '@/lib/constants/app'
import type { 
  AuthApiResponse, 
  EmailSendResult,
  SendEmailParams,
  SendVerificationEmailParams,
  SendPasswordResetEmailParams,
  SendPasswordChangedNotificationParams
} from '@/types/auth'

// Resend client'ı oluştur
const resend = new Resend(env.RESEND_API_KEY)

/**
 * Genel email gönderim fonksiyonu
 */
async function sendEmail(params: SendEmailParams): Promise<AuthApiResponse<EmailSendResult>> {
  try {
    const { to, subject, html, from = EMAIL_TEMPLATES.FROM_ADDRESS } = params

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

    logInfo(LOG_EVENTS.API_CALL, 'Email başarıyla gönderildi', {
      to,
      subject,
      emailId: result.data?.id,
      provider: 'resend'
    })

    return {
      success: true,
      data: { id: result.data?.id || '' }
    }
  } catch (error) {
    logError(LOG_EVENTS.API_CALL, 'Email gönderim hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      to: params.to,
      subject: params.subject,
      provider: 'resend'
    })

    return {
      success: false,
      error: 'Email gönderilemedi'
    }
  }
}

/**
 * Email template için temel HTML yapısı oluşturur
 */
function createEmailTemplate(content: string): string {
  const currentYear = new Date().getFullYear()
  
  return `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Aniwa</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: ${EMAIL_TEMPLATES.STYLES.CONTAINER_MAX_WIDTH};
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background: white;
          border-radius: ${EMAIL_TEMPLATES.STYLES.BORDER_RADIUS};
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          background: ${EMAIL_TEMPLATES.BRAND_COLORS.PRIMARY_GRADIENT};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 10px;
        }
        .title {
          color: #1f2937;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .content {
          margin-bottom: 30px;
        }
        .button {
          display: inline-block;
          background: ${EMAIL_TEMPLATES.BRAND_COLORS.BUTTON_GRADIENT};
          color: white;
          padding: ${EMAIL_TEMPLATES.STYLES.BUTTON_PADDING};
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          text-align: center;
          margin: 20px 0;
        }
        .button:hover {
          transform: translateY(-1px);
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 14px;
          color: #6b7280;
          text-align: center;
        }
        .warning {
          background-color: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 6px;
          padding: 12px;
          margin: 20px 0;
          font-size: 14px;
        }
        .success {
          background-color: #d1fae5;
          border: 1px solid #10b981;
          border-radius: 6px;
          padding: 12px;
          margin: 20px 0;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">${EMAIL_TEMPLATES.BRAND_NAME}</div>
        </div>
        
        ${content}
        
        <div class="footer">
          <p>Bu email otomatik olarak gönderilmiştir, lütfen yanıtlamayın.</p>
          <p>© ${currentYear} Aniwa. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Email doğrulama emaili gönderir
 */
export async function sendVerificationEmail(
  params: SendVerificationEmailParams
): Promise<AuthApiResponse<EmailSendResult>> {
  const { to, username, verificationUrl } = params

  const content = `
    <h1 class="title">Email Adresinizi Doğrulayın</h1>
    
    <div class="content">
      <p>Merhaba <strong>${username}</strong>,</p>
      
      <p>Aniwa'ya hoş geldiniz! Hesabınızı aktifleştirmek için email adresinizi doğrulamanız gerekiyor.</p>
      
      <p>Aşağıdaki butona tıklayarak email adresinizi doğrulayabilirsiniz:</p>
      
      <div style="text-align: center;">
        <a href="${verificationUrl}" class="button">Email Adresimi Doğrula</a>
      </div>
      
      <div class="warning">
        <strong>⚠️ Önemli:</strong> Bu bağlantı ${EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS} saat boyunca geçerlidir. Süre dolmadan önce doğrulama işlemini tamamlayın.
      </div>
      
      <p>Eğer butona tıklayamıyorsanız, aşağıdaki bağlantıyı kopyalayıp tarayıcınıza yapıştırabilirsiniz:</p>
      <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${verificationUrl}</p>
      
      <p>Bu işlemi siz yapmadıysanız, bu emaili güvenle yok sayabilirsiniz.</p>
    </div>
  `

  const html = createEmailTemplate(content)

  return sendEmail({
    to,
    subject: EMAIL_SUBJECTS.EMAIL_VERIFICATION,
    html,
  })
}

/**
 * Şifre sıfırlama emaili gönderir
 */
export async function sendPasswordResetEmail(
  params: SendPasswordResetEmailParams
): Promise<AuthApiResponse<EmailSendResult>> {
  const { to, username, resetUrl } = params

  const content = `
    <h1 class="title">Şifre Sıfırlama</h1>
    
    <div class="content">
      <p>Merhaba <strong>${username}</strong>,</p>
      
      <p>Hesabınız için şifre sıfırlama talebinde bulundunuz. Yeni bir şifre oluşturmak için aşağıdaki butona tıklayın:</p>
      
      <div style="text-align: center;">
        <a href="${resetUrl}" class="button">Şifremi Sıfırla</a>
      </div>
      
      <div class="warning">
        <strong>⚠️ Önemli:</strong> Bu bağlantı ${PASSWORD_RESET_TOKEN_EXPIRY_HOURS} saat boyunca geçerlidir. Güvenlik amacıyla kısa sürelidir.
      </div>
      
      <p>Eğer butona tıklayamıyorsanız, aşağıdaki bağlantıyı kopyalayıp tarayıcınıza yapıştırabilirsiniz:</p>
      <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${resetUrl}</p>
      
      <p><strong>Bu işlemi siz yapmadıysanız, hesabınızın güvenliği için derhal bizimle iletişime geçin.</strong></p>
    </div>
  `

  const html = createEmailTemplate(content)

  return sendEmail({
    to,
    subject: EMAIL_SUBJECTS.PASSWORD_RESET,
    html,
  })
}

/**
 * Şifre değişikliği bildirim emaili gönderir
 */
export async function sendPasswordChangedNotification(
  params: SendPasswordChangedNotificationParams
): Promise<AuthApiResponse<EmailSendResult>> {
  const { to, username } = params

  const content = `
    <h1 class="title">Şifreniz Değiştirildi</h1>
    
    <div class="content">
      <p>Merhaba <strong>${username}</strong>,</p>
      
      <div class="success">
        <strong>✅ Başarılı:</strong> Hesabınızın şifresi başarıyla değiştirildi.
      </div>
      
      <p>Hesabınızın şifresi az önce güvenli bir şekilde güncellendi. Artık yeni şifrenizle giriş yapabilirsiniz.</p>
      
      <p><strong>Güvenlik Bilgileri:</strong></p>
      <ul>
        <li>Değişiklik Zamanı: ${new Date().toLocaleString('tr-TR')}</li>
        <li>Hesap: ${to}</li>
      </ul>
      
      <div class="warning">
        <strong>⚠️ Bu işlemi siz yapmadıysanız:</strong> Derhal bizimle iletişime geçin ve hesabınızın güvenliğini sağlayın.
      </div>
      
      <p>Hesabınızın güvenliği bizim için çok önemlidir. Herhangi bir şüpheniz varsa lütfen destek ekibimizle iletişime geçin.</p>
    </div>
  `

  const html = createEmailTemplate(content)

  return sendEmail({
    to,
    subject: EMAIL_SUBJECTS.PASSWORD_CHANGED,
    html,
  })
} 