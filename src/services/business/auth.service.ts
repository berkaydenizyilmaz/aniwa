// Bu dosya kimlik doğrulama iş mantığını yönetir (user creation + email verification)

import { createUser, verifyCredentials, updatePassword, findUserByEmail } from '@/services/db/user.service'
import { createToken, verifyToken, deleteToken } from '@/services/db/verification-token.service'
import { sendPasswordResetEmail } from '@/services/api/email.service'
import { signupSchema, loginSchema } from '@/schemas/auth'
import { logInfo, logError } from '@/services/business/logger.service'
import { LOG_EVENTS, AUTH } from '@/constants'
import { z } from 'zod'
import type { ApiResponse, CreateUserParams, UserWithSettings } from '@/types'

// Kullanıcı girişi - Credential verification
export async function loginUser(
  username: string,
  password: string
): Promise<ApiResponse<UserWithSettings | null>> {
  try {
    // 1. Girdi validasyonu
    const validatedData = loginSchema.parse({ username, password })

    // 2. Ana iş mantığı - Kimlik bilgilerini doğrula (database service)
    const credentialsResult = await verifyCredentials(
      validatedData.username,
      validatedData.password
    )

    if (!credentialsResult.success) {
      return credentialsResult
    }

    // Kullanıcı bulunamadı (wrong credentials)
    if (!credentialsResult.data) {
      return { success: true, data: null }
    }

    return { success: true, data: credentialsResult.data }

  } catch (error) {
    logError(LOG_EVENTS.AUTH_LOGIN_FAILED, 'Giriş işlemi hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      username: username
    })

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message
      }
    }

    return {
      success: false,
      error: 'Giriş işlemi gerçekleştirilemedi'
    }
  }
}

// Kullanıcı kaydı - Basit user creation
export async function registerUser(
  params: CreateUserParams
): Promise<ApiResponse<UserWithSettings>> {
  try {
    // 1. Girdi validasyonu
    const validatedParams = signupSchema.parse(params)

    // 2. Ana iş mantığı - Kullanıcı oluştur (database service)
    const userResult = await createUser(validatedParams)
    if (!userResult.success || !userResult.data) {
      return userResult
    }

    // Business log - Kullanıcı başarıyla kaydedildi
    logInfo(LOG_EVENTS.AUTH_SIGNUP_SUCCESS, 'Yeni kullanıcı kaydı tamamlandı', {
      userId: userResult.data.id,
      email: userResult.data.email,
      username: userResult.data.username
    }, userResult.data.id)

    // Başarılı yanıt
    return {
      success: true,
      data: userResult.data
    }

  } catch (error) {
    // Hata loglaması
    logError(LOG_EVENTS.AUTH_SIGNUP_FAILED, 'Kullanıcı kaydı hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      email: params.email
    })

    // Hata yanıtı
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message
      }
    }

    return {
      success: false,
      error: 'Kullanıcı kaydı gerçekleştirilemedi'
    }
  }
}

// Şifre güncelleme business logic
export async function updateUserPassword(
  userId: string,
  newPassword: string
): Promise<ApiResponse<void>> {
  try {
    // 1. Ana iş mantığı - Şifre güncelle (database service)
    const updateResult = await updatePassword(userId, newPassword)
    
    if (!updateResult.success) {
      return updateResult
    }

    return { success: true, data: undefined }

  } catch (error) {
    // Hata loglaması
    logError(LOG_EVENTS.AUTH_PASSWORD_RESET_FAILED, 'Şifre güncelleme hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      userId
    })

    return {
      success: false,
      error: 'Şifre güncellenemedi'
    }
  }
} 

// Şifre sıfırlama token'ı oluştur ve email gönder
export async function createPasswordResetToken(
  email: string,
  baseUrl: string
): Promise<ApiResponse<{ token: string }>> {
  try {
    // 1. Email validasyonu
    const validatedEmail = z.string().email().parse(email)

    // 2. Kullanıcının varlığını kontrol et
    const userResult = await findUserByEmail(validatedEmail)
    
    if (!userResult.success || !userResult.data) {
      return {
        success: false,
        error: 'Bu email adresi ile kayıtlı kullanıcı bulunamadı'
      }
    }

    // 3. Password reset token'ı oluştur
    const tokenResult = await createToken({
      email: validatedEmail,
      type: AUTH.VERIFICATION_TOKEN_TYPES.PASSWORD_RESET,
      expiryHours: AUTH.PASSWORD_RESET_TOKEN_EXPIRY_HOURS
    })

    if (!tokenResult.success || !tokenResult.data) {
      return {
        success: false,
        error: 'Şifre sıfırlama token\'ı oluşturulamadı'
      }
    }

    // 4. Email gönder
    const resetUrl = `${baseUrl}/sifre-sifirlama?token=${tokenResult.data}`
    const emailResult = await sendPasswordResetEmail({
      to: validatedEmail,
      username: userResult.data.username || userResult.data.email.split('@')[0],
      resetUrl
    })

    if (!emailResult.success) {
      // Email gönderilemezse token'ı sil
      await deleteToken(tokenResult.data)
      
      return {
        success: false,
        error: 'Şifre sıfırlama emaili gönderilemedi'
      }
    }

    return {
      success: true,
      data: { token: tokenResult.data }
    }

  } catch (error) {
    logError(LOG_EVENTS.AUTH_PASSWORD_RESET_FAILED, 'Şifre sıfırlama token oluşturma hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      email
    })

    return {
      success: false,
      error: 'Şifre sıfırlama işlemi başlatılamadı'
    }
  }
}

// Şifre sıfırlama token'ını doğrula
export async function verifyPasswordResetToken(
  token: string
): Promise<ApiResponse<{ email: string }>> {
  try {
    // Token'ı doğrula
    const tokenResult = await verifyToken({
      token,
      type: AUTH.VERIFICATION_TOKEN_TYPES.PASSWORD_RESET
    })

    if (!tokenResult.success || !tokenResult.data) {
      return {
        success: false,
        error: 'Geçersiz veya süresi dolmuş token'
      }
    }

    return {
      success: true,
      data: { email: tokenResult.data.email }
    }

  } catch (error) {
    logError(LOG_EVENTS.AUTH_PASSWORD_RESET_FAILED, 'Şifre sıfırlama token doğrulama hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    })

    return {
      success: false,
      error: 'Token doğrulaması başarısız'
    }
  }
}

// Şifre sıfırlama token'ı ile şifreyi güncelle
export async function resetPasswordWithToken(
  token: string,
  newPassword: string
): Promise<ApiResponse<void>> {
  try {
    // 1. Token'ı doğrula ve sil
    const tokenResult = await verifyToken({
      token,
      type: AUTH.VERIFICATION_TOKEN_TYPES.PASSWORD_RESET
    })

    if (!tokenResult.success || !tokenResult.data) {
      return {
        success: false,
        error: 'Geçersiz veya süresi dolmuş token'
      }
    }

    // 2. Kullanıcıyı bul
    const userResult = await findUserByEmail(tokenResult.data.email)
    
    if (!userResult.success || !userResult.data) {
      return {
        success: false,
        error: 'Kullanıcı bulunamadı'
      }
    }

    // 3. Şifreyi güncelle
    const updateResult = await updateUserPassword(userResult.data.id, newPassword)
    
    if (!updateResult.success) {
      return updateResult
    }

    return { success: true, data: undefined }

  } catch (error) {
    logError(LOG_EVENTS.AUTH_PASSWORD_RESET_FAILED, 'Şifre sıfırlama hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    })

    return {
      success: false,
      error: 'Şifre sıfırlanamadı'
    }
  }
} 