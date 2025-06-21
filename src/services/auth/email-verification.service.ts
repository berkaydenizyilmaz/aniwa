// Aniwa Projesi - Email Verification Service
// Bu dosya email doğrulama ve şifre sıfırlama token işlemlerini yönetir

import { prisma } from '@/lib/db/prisma'
import { logInfo, logError, logWarn } from '@/lib/logger'
import { LOG_EVENTS } from '@/lib/constants/logging'
import { 
  VERIFICATION_TOKEN_TYPES, 
  EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS,
  PASSWORD_RESET_TOKEN_EXPIRY_HOURS 
} from '@/lib/constants/auth'
import { 
  sendVerificationEmail, 
  sendPasswordResetEmail, 
  sendPasswordChangedNotification 
} from '@/services/api/email.service'
import type { AuthApiResponse } from '@/types/auth'

/**
 * Email doğrulama token'ı oluşturur ve doğrulama emaili gönderir
 */
export async function createEmailVerificationToken(
  email: string,
  username: string,
  baseUrl: string
): Promise<AuthApiResponse<{ token: string }>> {
  try {
    // Mevcut token'ları temizle
    await prisma.verificationToken.deleteMany({
      where: {
        email: email.toLowerCase(),
        type: VERIFICATION_TOKEN_TYPES.EMAIL_VERIFICATION
      }
    })

    // Yeni token oluştur
    const tokenBytes = new Uint8Array(32)
    crypto.getRandomValues(tokenBytes)
    const token = Array.from(tokenBytes, byte => byte.toString(16).padStart(2, '0')).join('')
    
    const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000)

    // Token'ı veritabanına kaydet
    await prisma.verificationToken.create({
      data: {
        email: email.toLowerCase(),
        token,
        type: VERIFICATION_TOKEN_TYPES.EMAIL_VERIFICATION,
        expiresAt
      }
    })

    // Email gönder
    const verificationUrl = `${baseUrl}/dogrulama?token=${token}`
    const emailResult = await sendVerificationEmail({
      to: email.toLowerCase(),
      username,
      verificationUrl
    })

    if (!emailResult.success) {
      // Email gönderilemezse token'ı sil
      await prisma.verificationToken.delete({
        where: { token }
      })
      
      return {
        success: false,
        error: 'Doğrulama emaili gönderilemedi'
      }
    }

    logInfo(LOG_EVENTS.AUTH_EMAIL_VERIFICATION_SENT, 'Email doğrulama token\'ı oluşturuldu ve email gönderildi', {
      email: email.toLowerCase(),
      tokenPrefix: token.substring(0, 8) + '...',
      expiresAt: expiresAt.toISOString(),
      emailId: emailResult.data?.id
    })

    return {
      success: true,
      data: { token }
    }
  } catch (error) {
    logError(LOG_EVENTS.AUTH_EMAIL_VERIFICATION_FAILED, 'Email doğrulama token\'ı oluşturulamadı', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      email: email.toLowerCase()
    })
    
    return {
      success: false,
      error: 'Email doğrulama token\'ı oluşturulamadı'
    }
  }
}

/**
 * Şifre sıfırlama token'ı oluşturur ve sıfırlama emaili gönderir
 */
export async function createPasswordResetToken(
  email: string,
  baseUrl: string
): Promise<AuthApiResponse<{ token: string }>> {
  try {
    // Kullanıcının varlığını kontrol et
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      logWarn(LOG_EVENTS.AUTH_PASSWORD_RESET_FAILED, 'Şifre sıfırlama - kullanıcı bulunamadı', {
        email: email.toLowerCase()
      })
      
      // Güvenlik için her zaman başarılı yanıt döndür
      return {
        success: true,
        data: { token: 'dummy' }
      }
    }

    // Mevcut token'ları temizle
    await prisma.verificationToken.deleteMany({
      where: {
        email: email.toLowerCase(),
        type: VERIFICATION_TOKEN_TYPES.PASSWORD_RESET
      }
    })

    // Yeni token oluştur
    const tokenBytes = new Uint8Array(32)
    crypto.getRandomValues(tokenBytes)
    const token = Array.from(tokenBytes, byte => byte.toString(16).padStart(2, '0')).join('')
    
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000)

    // Token'ı veritabanına kaydet
    await prisma.verificationToken.create({
      data: {
        email: email.toLowerCase(),
        token,
        type: VERIFICATION_TOKEN_TYPES.PASSWORD_RESET,
        expiresAt
      }
    })

    // Email gönder
    const resetUrl = `${baseUrl}/sifre-sifirlama?token=${token}`
    const emailResult = await sendPasswordResetEmail({
      to: email.toLowerCase(),
      username: user.username || user.email.split('@')[0],
      resetUrl
    })

    if (!emailResult.success) {
      // Email gönderilemezse token'ı sil
      await prisma.verificationToken.delete({
        where: { token }
      })
      
      return {
        success: false,
        error: 'Şifre sıfırlama emaili gönderilemedi'
      }
    }

    logInfo(LOG_EVENTS.AUTH_PASSWORD_RESET_REQUESTED, 'Şifre sıfırlama token\'ı oluşturuldu ve email gönderildi', {
      email: email.toLowerCase(),
      userId: user.id,
      tokenPrefix: token.substring(0, 8) + '...',
      expiresAt: expiresAt.toISOString(),
      emailId: emailResult.data?.id
    }, user.id)

    return {
      success: true,
      data: { token }
    }
  } catch (error) {
    logError(LOG_EVENTS.AUTH_PASSWORD_RESET_FAILED, 'Şifre sıfırlama token\'ı oluşturulamadı', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      email: email.toLowerCase()
    })
    
    return {
      success: false,
      error: 'Şifre sıfırlama token\'ı oluşturulamadı'
    }
  }
}

/**
 * Email doğrulama token'ını kontrol eder ve kullanıcının email'ini doğrular
 */
export async function verifyEmailToken(token: string): Promise<AuthApiResponse<{ email: string }>> {
  try {
    // Token'ı bul
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }
    })

    if (!verificationToken) {
      logWarn(LOG_EVENTS.AUTH_EMAIL_VERIFICATION_FAILED, 'Geçersiz email doğrulama token\'ı', {
        tokenPrefix: token.substring(0, 8) + '...'
      })
      
      return {
        success: false,
        error: 'Geçersiz veya süresi dolmuş doğrulama bağlantısı'
      }
    }

    // Token türü kontrolü
    if (verificationToken.type !== VERIFICATION_TOKEN_TYPES.EMAIL_VERIFICATION) {
      logWarn(LOG_EVENTS.AUTH_EMAIL_VERIFICATION_FAILED, 'Yanlış token türü', {
        tokenPrefix: token.substring(0, 8) + '...',
        actualType: verificationToken.type,
        expectedType: VERIFICATION_TOKEN_TYPES.EMAIL_VERIFICATION
      })
      
      return {
        success: false,
        error: 'Geçersiz doğrulama bağlantısı'
      }
    }

    // Token süresi kontrolü
    if (verificationToken.expiresAt < new Date()) {
      // Süresi dolmuş token'ı sil
      await prisma.verificationToken.delete({
        where: { id: verificationToken.id }
      })
      
      logWarn(LOG_EVENTS.AUTH_EMAIL_VERIFICATION_FAILED, 'Email doğrulama token\'ı süresi dolmuş', {
        email: verificationToken.email,
        tokenPrefix: token.substring(0, 8) + '...'
      })
      
      return {
        success: false,
        error: 'Doğrulama bağlantısının süresi dolmuş. Lütfen yeni bir doğrulama e-postası isteyin.'
      }
    }

    // Kullanıcının email'ini doğrula
    await prisma.user.update({
      where: { email: verificationToken.email },
      data: { emailVerified: new Date() }
    })

    // Token'ı sil (tek kullanımlık)
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id }
    })

    logInfo(LOG_EVENTS.AUTH_EMAIL_VERIFICATION_SUCCESS, 'Email başarıyla doğrulandı', {
      email: verificationToken.email
    })

    return {
      success: true,
      data: { email: verificationToken.email }
    }
  } catch (error) {
    logError(LOG_EVENTS.AUTH_EMAIL_VERIFICATION_FAILED, 'Email doğrulama hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      tokenPrefix: token.substring(0, 8) + '...'
    })
    
    return {
      success: false,
      error: 'Email doğrulama işlemi başarısız'
    }
  }
}

/**
 * Şifre sıfırlama token'ını kontrol eder (şifre değiştirmeden önce)
 */
export async function verifyPasswordResetToken(token: string): Promise<AuthApiResponse<{ email: string }>> {
  try {
    // Token'ı bul
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }
    })

    if (!verificationToken) {
      logWarn(LOG_EVENTS.AUTH_PASSWORD_RESET_FAILED, 'Geçersiz şifre sıfırlama token\'ı', {
        tokenPrefix: token.substring(0, 8) + '...'
      })
      
      return {
        success: false,
        error: 'Geçersiz veya süresi dolmuş şifre sıfırlama bağlantısı'
      }
    }

    // Token türü kontrolü
    if (verificationToken.type !== VERIFICATION_TOKEN_TYPES.PASSWORD_RESET) {
      logWarn(LOG_EVENTS.AUTH_PASSWORD_RESET_FAILED, 'Yanlış token türü', {
        tokenPrefix: token.substring(0, 8) + '...',
        actualType: verificationToken.type,
        expectedType: VERIFICATION_TOKEN_TYPES.PASSWORD_RESET
      })
      
      return {
        success: false,
        error: 'Geçersiz şifre sıfırlama bağlantısı'
      }
    }

    // Token süresi kontrolü
    if (verificationToken.expiresAt < new Date()) {
      // Süresi dolmuş token'ı sil
      await prisma.verificationToken.delete({
        where: { id: verificationToken.id }
      })
      
      logWarn(LOG_EVENTS.AUTH_PASSWORD_RESET_FAILED, 'Şifre sıfırlama token\'ı süresi dolmuş', {
        email: verificationToken.email,
        tokenPrefix: token.substring(0, 8) + '...'
      })
      
      return {
        success: false,
        error: 'Şifre sıfırlama bağlantısının süresi dolmuş. Lütfen yeni bir şifre sıfırlama e-postası isteyin.'
      }
    }

    return {
      success: true,
      data: { email: verificationToken.email }
    }
  } catch (error) {
    logError(LOG_EVENTS.AUTH_PASSWORD_RESET_FAILED, 'Şifre sıfırlama token kontrolü hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      tokenPrefix: token.substring(0, 8) + '...'
    })
    
    return {
      success: false,
      error: 'Şifre sıfırlama kontrolü başarısız'
    }
  }
}

/**
 * Şifre sıfırlama token'ını kullanarak şifre değiştirir
 */
export async function resetPasswordWithToken(
  token: string, 
  newPassword: string
): Promise<AuthApiResponse> {
  try {
    // Token'ı doğrula
    const tokenResult = await verifyPasswordResetToken(token)
    if (!tokenResult.success) {
      return tokenResult
    }

    const email = tokenResult.data!.email

    // Şifreyi hash'le
    const bcrypt = (await import('bcryptjs')).default
    const { BCRYPT_SALT_ROUNDS } = await import('@/lib/constants/auth')
    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS)

    // Kullanıcının şifresini güncelle
    const user = await prisma.user.update({
      where: { email },
      data: { passwordHash }
    })

    // Token'ı sil (tek kullanımlık)
    await prisma.verificationToken.delete({
      where: { token }
    })

    // Şifre değişikliği bildirim emaili gönder
    await sendPasswordChangedNotification(
      email,
      user.username || user.email.split('@')[0]
    )

    logInfo(LOG_EVENTS.AUTH_PASSWORD_RESET_SUCCESS, 'Şifre başarıyla sıfırlandı', {
      email,
      userId: user.id
    }, user.id)

    return {
      success: true,
      message: 'Şifreniz başarıyla güncellendi'
    }
  } catch (error) {
    logError(LOG_EVENTS.AUTH_PASSWORD_RESET_FAILED, 'Şifre sıfırlama hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      tokenPrefix: token.substring(0, 8) + '...'
    })
    
    return {
      success: false,
      error: 'Şifre sıfırlama işlemi başarısız'
    }
  }
} 