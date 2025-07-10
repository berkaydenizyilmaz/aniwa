// Aniwa Projesi - Auth Business Logic Service
// Bu dosya kimlik doğrulama iş mantığını yönetir (user creation + email verification)

import { createUser } from '@/services/db/user.service'
import { createEmailVerificationToken } from './email-verification.service'
import { signupSchema, resendEmailSchema } from '@/lib/schemas/auth.schemas'
import { logInfo, logError } from '@/lib/logger'
import { LOG_EVENTS } from '@/constants/logging'
import { z } from 'zod'
import type { ApiResponse } from '@/types/api'
import type { CreateUserParams, UserWithSettings } from '@/types/auth'

// Kullanıcı kaydı - User creation + Email verification orchestration
export async function registerUser(
  params: CreateUserParams,
  baseUrl: string
): Promise<ApiResponse<UserWithSettings>> {
  try {
    // 1. Girdi validasyonu
    const validatedParams = signupSchema.parse(params)

    // 2. Kullanıcı oluştur (database service kullan)
    const userResult = await createUser(validatedParams)
    if (!userResult.success || !userResult.data) {
      return userResult
    }

    // 3. Email doğrulama token'ı oluştur ve email gönder
    const emailResult = await createEmailVerificationToken(
      validatedParams.email,
      validatedParams.username,
      baseUrl
    )

    if (!emailResult.success) {
      // Email gönderilemezse kullanıcı oluşturulmuş olsa bile hata dön
      // (Kullanıcı daha sonra email doğrulama tekrar talep edebilir)
      logError(LOG_EVENTS.AUTH_SIGNUP_FAILED, 'Email doğrulama gönderilemedi', {
        userId: userResult.data.id,
        email: validatedParams.email
      })
      
      return {
        success: false,
        error: 'Kullanıcı oluşturuldu ancak doğrulama emaili gönderilemedi'
      }
    }

    // 4. Başarı loglaması
    logInfo(LOG_EVENTS.AUTH_SIGNUP_SUCCESS, 'Kullanıcı kaydı tamamlandı', {
      userId: userResult.data.id,
      email: userResult.data.email,
      username: userResult.data.username,
      emailVerificationSent: true
    }, userResult.data.id)

    return {
      success: true,
      data: userResult.data
    }

  } catch (error) {
    // Hata yönetimi
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message
      }
    }

    logError(LOG_EVENTS.AUTH_SIGNUP_FAILED, 'Kullanıcı kaydı hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      email: params.email
    })

    return {
      success: false,
      error: 'Kullanıcı kaydı gerçekleştirilemedi'
    }
  }
}

// Email doğrulama tekrar gönderme
export async function resendEmailVerification(
  email: string,
  baseUrl: string
): Promise<ApiResponse<{ token: string }>> {
  try {
    // 1. Email validasyonu
    const validatedEmail = resendEmailSchema.parse({ email }).email

    // 2. Kullanıcının varlığını kontrol et
    const { findUserByEmail } = await import('@/services/db/user.service')
    const userResult = await findUserByEmail(validatedEmail)
    
    if (!userResult.success || !userResult.data) {
      return {
        success: false,
        error: 'Kullanıcı bulunamadı'
      }
    }

    // 3. Email zaten doğrulanmış mı kontrol et
    if (userResult.data.emailVerified) {
      return {
        success: false,
        error: 'Email adresi zaten doğrulanmış'
      }
    }

    // 4. Yeni doğrulama token'ı oluştur
    const tokenResult = await createEmailVerificationToken(
      validatedEmail,
      userResult.data.username || userResult.data.email.split('@')[0],
      baseUrl
    )

    if (!tokenResult.success) {
      return {
        success: false,
        error: 'Doğrulama emaili gönderilemedi'
      }
    }

    logInfo(LOG_EVENTS.AUTH_EMAIL_VERIFICATION_SENT, 'Email doğrulama tekrar gönderildi', {
      userId: userResult.data.id,
      email: validatedEmail
    }, userResult.data.id)

    return tokenResult

  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message
      }
    }

    logError(LOG_EVENTS.AUTH_EMAIL_VERIFICATION_FAILED, 'Email doğrulama tekrar gönderme hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      email
    })

    return {
      success: false,
      error: 'Email doğrulama gönderilemedi'
    }
  }
} 