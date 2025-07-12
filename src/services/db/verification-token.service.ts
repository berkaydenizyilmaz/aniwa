// Bu dosya doğrulama token'larının veritabanı işlemlerini yönetir

import { prisma } from '@/lib/db/prisma'
import { createVerificationTokenSchema, verifyTokenSchema } from '@/lib/schemas/auth.schemas'
import type { ApiResponse } from '@/types/api'
import { randomBytes } from 'crypto'
import type { 
  VerificationTokenType, 
  CreateVerificationTokenParams, 
  VerifyTokenParams 
} from '@/types/verification'

// Token oluştur
export async function createToken(params: CreateVerificationTokenParams): Promise<ApiResponse<string>> {
  try {
    // 1. Girdi validasyonu
    const validatedParams = createVerificationTokenSchema.parse(params)
    const { email, type, expiryHours } = validatedParams

    // 2. Güvenli token oluştur
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000)

    // 3. Mevcut token'ları temizle (aynı email + type için)
    await prisma.verificationToken.deleteMany({
      where: {
        email: email.toLowerCase(),
        type
      }
    })

    // 4. Yeni token oluştur
    await prisma.verificationToken.create({
      data: {
        token,
        email: email.toLowerCase(),
        type,
        expiresAt
      }
    })

    return { success: true, data: token }

  } catch {
    return { 
      success: false, 
      error: 'Doğrulama token\'ı oluşturulamadı'
    }
  }
}

// Token doğrula ve sil
export async function verifyToken(params: VerifyTokenParams): Promise<ApiResponse<{ email: string }>> {
  try {
    // 1. Girdi validasyonu
    const validatedParams = verifyTokenSchema.parse(params)
    const { token, type } = validatedParams

    // 2. Token'ı bul
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token,
        type,
        expiresAt: {
          gt: new Date() // Süresi dolmamış
        }
      }
    })

    // 3. Token bulunamadı veya süresi dolmuş
    if (!verificationToken) {
      return { 
        success: false, 
        error: 'Geçersiz veya süresi dolmuş token'
      }
    }

    // 4. Token'ı sil (tek kullanımlık)
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id }
    })

    return { 
      success: true, 
      data: { email: verificationToken.email }
    }

  } catch {
    return { 
      success: false, 
      error: 'Token doğrulaması başarısız'
    }
  }
}

// Belirli token'ı sil
export async function deleteToken(token: string): Promise<ApiResponse<void>> {
  try {
    await prisma.verificationToken.deleteMany({
      where: { token }
    })

    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Token silinemedi' }
  }
}

// Belirli email için token'ları sil
export async function deleteTokensByEmail(email: string, type?: VerificationTokenType): Promise<ApiResponse<void>> {
  try {
    const where = { 
      email: email.toLowerCase(),
      ...(type && { type })
    }

    await prisma.verificationToken.deleteMany({ where })

    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Token\'lar silinemedi' }
  }
}

// Süresi dolmuş token'ları temizle (Bu maintenance işlemi olduğu için log kalacak)
export async function cleanupExpiredTokens(): Promise<ApiResponse<number>> {
  try {
    const result = await prisma.verificationToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })

    return { success: true, data: result.count }
  } catch {
    return { success: false, error: 'Token temizliği başarısız' }
  }
}

// Token varlığını kontrol et
export async function tokenExists(token: string): Promise<ApiResponse<boolean>> {
  try {
    const count = await prisma.verificationToken.count({
      where: { 
        token,
        expiresAt: {
          gt: new Date()
        }
      }
    })

    return { success: true, data: count > 0 }
  } catch {
    return { success: false, error: 'Token varlığı kontrol edilemedi' }
  }
}

// Email için aktif token sayısını getir
export async function getActiveTokenCount(email: string, type?: VerificationTokenType): Promise<ApiResponse<number>> {
  try {
    const where = { 
      email: email.toLowerCase(),
      expiresAt: {
        gt: new Date()
      },
      ...(type && { type })
    }

    const count = await prisma.verificationToken.count({ where })

    return { success: true, data: count }
  } catch {
    return { success: false, error: 'Aktif token sayısı hesaplanamadı' }
  }
} 