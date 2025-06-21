// Aniwa Projesi - Email Service
// Bu dosya Resend ile email gönderim işlemlerini yönetir

import { Resend } from 'resend'
import { env } from '@/lib/env'
import { logInfo, logError } from '@/lib/logger'
import { LOG_EVENTS } from '@/lib/constants/logging'
import type { AuthApiResponse } from '@/types/auth'
import { EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS, PASSWORD_RESET_TOKEN_EXPIRY_HOURS } from '@/lib/constants/auth'

// Resend client'ı oluştur
const resend = new Resend(env.RESEND_API_KEY)

// Email gönderim parametreleri
interface SendEmailParams {
  to: string
  subject: string
  html: string
  from?: string
}

// Email verification parametreleri
interface SendVerificationEmailParams {
  to: string
  username: string
  verificationUrl: string
}

// Password reset parametreleri
interface SendPasswordResetEmailParams {
  to: string
  username: string
  resetUrl: string
}

/**
 * Genel email gönderim fonksiyonu
 */
async function sendEmail(params: SendEmailParams): Promise<AuthApiResponse<{ id: string }>> {
  try {
    const { to, subject, html, from = 'Aniwa <noreply@aniwa.tr>' } = params

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
 * Email doğrulama emaili gönderir
 */
export async function sendVerificationEmail(
  params: SendVerificationEmailParams
): Promise<AuthApiResponse<{ id: string }>> {
  const { to, username, verificationUrl } = params

  const subject = 'Aniwa - Email Adresinizi Doğrulayın'
  
  const html = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Doğrulama - Aniwa</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background: white;
          border-radius: 12px;
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
          background: linear-gradient(135deg, #8b5cf6, #06b6d4, #10b981);
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
          background: linear-gradient(135deg, #8b5cf6, #06b6d4);
          color: white;
          padding: 14px 28px;
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
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">aniwa</div>
          <h1 class="title">Email Adresinizi Doğrulayın</h1>
        </div>
        
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
          
          <p>Bu emaili siz talep etmediyseniz, güvenle yok sayabilirsiniz.</p>
        </div>
        
        <div class="footer">
          <p>Bu email otomatik olarak gönderilmiştir, lütfen yanıtlamayın.</p>
          <p>&copy; ${new Date().getFullYear()} Aniwa. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({ to, subject, html })
}

/**
 * Şifre sıfırlama emaili gönderir
 */
export async function sendPasswordResetEmail(
  params: SendPasswordResetEmailParams
): Promise<AuthApiResponse<{ id: string }>> {
  const { to, username, resetUrl } = params

  const subject = 'Aniwa - Şifre Sıfırlama'
  
  const html = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Şifre Sıfırlama - Aniwa</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background: white;
          border-radius: 12px;
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
          background: linear-gradient(135deg, #8b5cf6, #06b6d4, #10b981);
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
          background: linear-gradient(135deg, #ef4444, #f97316);
          color: white;
          padding: 14px 28px;
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
          background-color: #fee2e2;
          border: 1px solid #ef4444;
          border-radius: 6px;
          padding: 12px;
          margin: 20px 0;
          font-size: 14px;
        }
        .security-tip {
          background-color: #f0f9ff;
          border: 1px solid #0ea5e9;
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
          <div class="logo">aniwa</div>
          <h1 class="title">Şifre Sıfırlama</h1>
        </div>
        
        <div class="content">
          <p>Merhaba <strong>${username}</strong>,</p>
          
          <p>Hesabınız için şifre sıfırlama talebinde bulundunuz. Aşağıdaki butona tıklayarak yeni şifrenizi belirleyebilirsiniz:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Şifremi Sıfırla</a>
          </div>
          
          <div class="warning">
            <strong>⚠️ Önemli:</strong> Bu bağlantı ${PASSWORD_RESET_TOKEN_EXPIRY_HOURS} saat boyunca geçerlidir. Güvenlik amacıyla süre kısa tutulmuştur.
          </div>
          
          <div class="security-tip">
            <strong>🔒 Güvenlik İpucu:</strong> Şifrenizi sıfırladıktan sonra, güçlü ve benzersiz bir şifre seçmeyi unutmayın.
          </div>
          
          <p>Eğer butona tıklayamıyorsanız, aşağıdaki bağlantıyı kopyalayıp tarayıcınıza yapıştırabilirsiniz:</p>
          <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${resetUrl}</p>
          
          <p><strong>Bu talebi siz yapmadıysanız:</strong></p>
          <ul>
            <li>Bu emaili güvenle yok sayabilirsiniz</li>
            <li>Şifreniz değişmeyecektir</li>
            <li>Hesabınızın güvenliği için şifrenizi kontrol etmenizi öneririz</li>
          </ul>
        </div>
        
        <div class="footer">
          <p>Bu email otomatik olarak gönderilmiştir, lütfen yanıtlamayın.</p>
          <p>&copy; ${new Date().getFullYear()} Aniwa. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({ to, subject, html })
}

/**
 * Şifre başarıyla değiştirildi bildirimi gönderir
 */
export async function sendPasswordChangedNotification(
  to: string,
  username: string
): Promise<AuthApiResponse<{ id: string }>> {
  const subject = 'Aniwa - Şifreniz Değiştirildi'
  
  const html = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Şifre Değiştirildi - Aniwa</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background: white;
          border-radius: 12px;
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
          background: linear-gradient(135deg, #8b5cf6, #06b6d4, #10b981);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 10px;
        }
        .title {
          color: #059669;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .content {
          margin-bottom: 30px;
        }
        .success {
          background-color: #d1fae5;
          border: 1px solid #059669;
          border-radius: 6px;
          padding: 12px;
          margin: 20px 0;
          font-size: 14px;
          text-align: center;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 14px;
          color: #6b7280;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">aniwa</div>
          <h1 class="title">✅ Şifreniz Başarıyla Değiştirildi</h1>
        </div>
        
        <div class="content">
          <p>Merhaba <strong>${username}</strong>,</p>
          
          <div class="success">
            <strong>🎉 Tebrikler!</strong> Hesabınızın şifresi başarıyla değiştirildi.
          </div>
          
          <p>Hesabınızın güvenliği için şifre değişikliği hakkında sizi bilgilendiriyoruz.</p>
          
          <p><strong>Değişiklik Zamanı:</strong> ${new Date().toLocaleString('tr-TR')}</p>
          
          <p>Bu değişikliği siz yapmadıysanız, lütfen derhal bizimle iletişime geçin ve hesabınızı güvence altına alın.</p>
          
          <p>Hesabınızın güvenliği için:</p>
          <ul>
            <li>Şifrenizi kimseyle paylaşmayın</li>
            <li>Güçlü ve benzersiz şifreler kullanın</li>
            <li>Şüpheli aktivite fark ederseniz hemen bildirin</li>
          </ul>
        </div>
        
        <div class="footer">
          <p>Bu email otomatik olarak gönderilmiştir, lütfen yanıtlamayın.</p>
          <p>&copy; ${new Date().getFullYear()} Aniwa. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({ to, subject, html })
} 