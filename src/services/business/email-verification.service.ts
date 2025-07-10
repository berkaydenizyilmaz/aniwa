// Aniwa Projesi - Email Verification Business Logic Service
// Bu dosya email doğrulama iş mantığını yönetir (token + email orchestration)

import { createVerificationToken, verifyToken, deleteVerificationToken } from '@/services/db/verification-token.service'
import { findUserByEmail, updateEmailVerificationStatus } from '@/services/db/user.service'
import { sendVerificationEmail } from '@/services/api/email.service'
import { EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS } from '@/constants/auth'
import { ROUTES } from '@/constants/routes'
import { logInfo, logError, logWarn } from '@/lib/logger'
import { LOG_EVENTS } from '@/constants/logging'
import { emailSchema } from '@/lib/schemas/auth.schemas'
import { z } from 'zod'
import type { ApiResponse } from '@/types/api'

// Email doğrulama token'ı oluşturur ve doğrulama emaili gönderir
export async function createEmailVerificationToken(
  email: string,
  username: string,
  baseUrl: string
): Promise<ApiResponse<{ token: string }>> {
  try {
    // 1. Girdi validasyonu
    const validatedEmail = emailSchema.parse(email)

    // 2. Ön koşul kontrolleri (guard clauses)
    if (!username || username.trim().length === 0) {
      return { success: false, error: 'Kullanıcı adı gerekli' }
    }

    if (!baseUrl || !baseUrl.startsWith('http')) {
      return { success: false, error: 'Geçerli base URL gerekli' }
    }

    // 3. Ana iş mantığı - Token oluştur (database service)
    const tokenResult = await createVerificationToken({
      email: validatedEmail,
      type: 'EMAIL_VERIFICATION',
      expiryHours: EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS
    })

    if (!tokenResult.success || !tokenResult.data) {
      return {
        success: false,
        error: tokenResult.error || 'Token oluşturulamadı'
      }
    }

    // Email gönder (external API service)
    const verificationUrl = `${baseUrl}${ROUTES.PAGES.AUTH.VERIFY_REQUEST}?token=${tokenResult.data.token}`
    const emailResult = await sendVerificationEmail({
      to: validatedEmail,
      username,
      verificationUrl
    })

    if (!emailResult.success) {
      // Email gönderilemezse token'ı sil
      await deleteVerificationToken(tokenResult.data.token)
      
      return {
        success: false,
        error: 'Doğrulama emaili gönderilemedi'
      }
    }

    // 4. Başarı loglaması
    logInfo(LOG_EVENTS.AUTH_EMAIL_VERIFICATION_SENT, 'Email doğrulama token\'ı oluşturuldu ve email gönderildi', {
      email: validatedEmail,
      tokenPrefix: tokenResult.data.token.substring(0, 8) + '...',
      expiresAt: tokenResult.data.expiresAt.toISOString(),
      emailId: emailResult.data?.id
    })

    // 5. Başarılı yanıt
    return {
      success: true,
      data: { token: tokenResult.data.token }
    }

  } catch (error) {
    // 6. Hata loglaması
    logError(LOG_EVENTS.SERVICE_ERROR, 'Email doğrulama token\'ı oluşturulamadı', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      email: email.toLowerCase()
    })
    
    // 7. Hata yanıtı
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    
    return {
      success: false,
      error: 'Email doğrulama token\'ı oluşturulamadı'
    }
  }
}

// Email doğrulama token'ını kontrol eder ve kullanıcının email'ini doğrular
export async function verifyEmailToken(token: string): Promise<ApiResponse<{ email: string }>> {
  try {
    // 1. Girdi validasyonu
    if (!token || token.trim().length === 0) {
      return { success: false, error: 'Token gerekli' }
    }

    // 2. Ön koşul kontrolleri (guard clauses)
    if (token.length < 32) {
      return { success: false, error: 'Geçersiz token formatı' }
    }

    // 3. Ana iş mantığı - Token'ı doğrula (database service)
    const tokenResult = await verifyToken(token, 'EMAIL_VERIFICATION')
    
    if (!tokenResult.success || !tokenResult.data) {
      return {
        success: false,
        error: tokenResult.error || 'Token doğrulanamadı'
      }
    }

    if (!tokenResult.data.isValid) {
      return {
        success: false,
        error: 'Geçersiz veya süresi dolmuş token'
      }
    }

    // Kullanıcıyı bul
    const userResult = await findUserByEmail(tokenResult.data.email)
    
    if (!userResult.success || !userResult.data) {
      logWarn(LOG_EVENTS.AUTH_EMAIL_VERIFICATION_FAILED, 'Email doğrulama - kullanıcı bulunamadı', {
        email: tokenResult.data.email,
        tokenPrefix: token.substring(0, 8) + '...'
      })
      
      return {
        success: false,
        error: 'Kullanıcı bulunamadı'
      }
    }

    // Email zaten doğrulanmış mı kontrol et
    if (userResult.data.emailVerified) {
      // Token'ı sil (artık gerekli değil)
      await deleteVerificationToken(token)
      
      return {
        success: false,
        error: 'Email adresi zaten doğrulanmış'
      }
    }

    // Email doğrulama durumunu güncelle
    const updateResult = await updateEmailVerificationStatus(userResult.data.id, true)
    
    if (!updateResult.success) {
      return {
        success: false,
        error: 'Email doğrulama durumu güncellenemedi'
      }
    }

    // Kullanılan token'ı sil
    await deleteVerificationToken(token)

    // 4. Başarı loglaması
    logInfo(LOG_EVENTS.AUTH_EMAIL_VERIFICATION_SUCCESS, 'Email başarıyla doğrulandı', {
      email: tokenResult.data.email,
      userId: userResult.data.id,
      tokenPrefix: token.substring(0, 8) + '...'
    }, userResult.data.id)

    // 5. Başarılı yanıt
    return {
      success: true,
      data: { email: tokenResult.data.email }
    }

  } catch (error) {
    // 6. Hata loglaması
    logError(LOG_EVENTS.SERVICE_ERROR, 'Email doğrulama hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      tokenPrefix: token.substring(0, 8) + '...'
    })
    
    // 7. Hata yanıtı
    return {
      success: false,
      error: 'Email doğrulanamadı'
    }
  }
} 