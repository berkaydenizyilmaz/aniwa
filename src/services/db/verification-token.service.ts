// Aniwa Projesi - Verification Token Database Service
// Bu dosya doğrulama token'larının CRUD işlemlerini yönetir

import { prisma } from '@/lib/db/prisma'
import { logInfo, logError, logWarn } from '@/lib/logger'
import { LOG_EVENTS } from '@/constants/logging'
import { VERIFICATION_TOKEN_TYPES } from '@/constants/auth'
import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { createVerificationTokenSchema, verifyTokenSchema } from '@/lib/schemas/verification.schemas'
import type { ApiResponse } from '@/types/api'

// Verification token oluşturur
export async function createVerificationToken(params: {
  email: string
  type: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET'
  expiryHours: number
}): Promise<ApiResponse<{ token: string; expiresAt: Date }>> {
  try {
    // 1. Girdi validasyonu
    const validatedParams = createVerificationTokenSchema.parse(params)
    const { email, type, expiryHours } = validatedParams

    // 2. Mevcut token'ları temizle
    await prisma.verificationToken.deleteMany({
      where: {
        email: email.toLowerCase(),
        type: VERIFICATION_TOKEN_TYPES[type]
      }
    })

    // 3. Yeni token oluştur
    const tokenBytes = new Uint8Array(32)
    crypto.getRandomValues(tokenBytes)
    const token = Array.from(tokenBytes, byte => byte.toString(16).padStart(2, '0')).join('')
    
    const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000)

    // 4. Token'ı veritabanına kaydet
    await prisma.verificationToken.create({
      data: {
        email: email.toLowerCase(),
        token,
        type: VERIFICATION_TOKEN_TYPES[type],
        expiresAt
      }
    })

    // 5. Başarı loglaması
    logInfo(LOG_EVENTS.AUTH_EMAIL_VERIFICATION_SENT, 'Verification token oluşturuldu', {
      email: email.toLowerCase(),
      tokenType: type,
      tokenPrefix: token.substring(0, 8) + '...',
      expiresAt: expiresAt.toISOString()
    })

    return {
      success: true,
      data: { token, expiresAt }
    }

  } catch (error) {
    // Hata yönetimi
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return { success: false, error: 'Token zaten mevcut' }
      }
    }

    logError(LOG_EVENTS.AUTH_EMAIL_VERIFICATION_FAILED, 'Verification token oluşturulamadı', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      email: params.email.toLowerCase(),
      type: params.type
    })

    return {
      success: false,
      error: 'Verification token oluşturulamadı'
    }
  }
}

// Verification token'ını doğrular
export async function verifyToken(
  token: string,
  type: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET'
): Promise<ApiResponse<{ email: string; isValid: boolean }>> {
  try {
    // 1. Girdi validasyonu
    const validatedParams = verifyTokenSchema.parse({ token, type })

    // 2. Token'ı bul
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token: validatedParams.token }
    })

    if (!verificationToken) {
      logWarn(LOG_EVENTS.AUTH_EMAIL_VERIFICATION_FAILED, 'Geçersiz verification token', {
        tokenPrefix: token.substring(0, 8) + '...',
        type
      })
      
      return {
        success: true,
        data: { email: '', isValid: false }
      }
    }

    // 3. Token türü kontrolü
    if (verificationToken.type !== VERIFICATION_TOKEN_TYPES[type]) {
      logWarn(LOG_EVENTS.AUTH_EMAIL_VERIFICATION_FAILED, 'Yanlış token türü', {
        tokenPrefix: token.substring(0, 8) + '...',
        expected: type,
        actual: verificationToken.type
      })
      
      return {
        success: true,
        data: { email: '', isValid: false }
      }
    }

    // 4. Token süresi kontrolü
    if (verificationToken.expiresAt < new Date()) {
      logWarn(LOG_EVENTS.AUTH_EMAIL_VERIFICATION_FAILED, 'Token süresi dolmuş', {
        tokenPrefix: token.substring(0, 8) + '...',
        expiresAt: verificationToken.expiresAt.toISOString(),
        type
      })
      
      return {
        success: true,
        data: { email: '', isValid: false }
      }
    }

    // 5. Başarılı doğrulama
    return {
      success: true,
      data: { 
        email: verificationToken.email,
        isValid: true 
      }
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }

    logError(LOG_EVENTS.AUTH_EMAIL_VERIFICATION_FAILED, 'Token doğrulama hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      tokenPrefix: token.substring(0, 8) + '...',
      type
    })

    return {
      success: false,
      error: 'Token doğrulanamadı'
    }
  }
}

// Kullanılan token'ı siler
export async function deleteVerificationToken(token: string): Promise<ApiResponse<void>> {
  try {
    await prisma.verificationToken.delete({
      where: { token }
    })

    logInfo(LOG_EVENTS.AUTH_EMAIL_VERIFICATION_SUCCESS, 'Verification token silindi', {
      tokenPrefix: token.substring(0, 8) + '...'
    })

    return { success: true, data: undefined }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        // Token zaten silinmiş, bu bir hata değil
        return { success: true, data: undefined }
      }
    }

    logError(LOG_EVENTS.DATABASE_ERROR, 'Token silinemedi', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      tokenPrefix: token.substring(0, 8) + '...'
    })

    return {
      success: false,
      error: 'Token silinemedi'
    }
  }
}

// Süresi dolmuş token'ları temizler
export async function cleanupExpiredTokens(): Promise<ApiResponse<{ deletedCount: number }>> {
  try {
    const result = await prisma.verificationToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })

    logInfo(LOG_EVENTS.DATABASE_ERROR, 'Süresi dolmuş token\'lar temizlendi', {
      deletedCount: result.count
    })

    return {
      success: true,
      data: { deletedCount: result.count }
    }
  } catch (error) {
    logError(LOG_EVENTS.DATABASE_ERROR, 'Token temizleme hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    })

    return {
      success: false,
      error: 'Token temizleme işlemi başarısız'
    }
  }
} 