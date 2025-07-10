// Aniwa Projesi - User Database Service
// Bu dosya kullanıcı CRUD işlemlerini yönetir

import { prisma } from '@/lib/db/prisma'
import { logInfo, logError } from '@/lib/logger'
import { LOG_EVENTS } from '@/constants/logging'
import { USER_ROLES, BCRYPT_SALT_ROUNDS } from '@/constants/auth'
import { z } from 'zod'
import { generateUserSlug } from '@/lib/utils'
import { Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { signupSchema, emailSchema, usernameSchema, userIdSchema } from '@/lib/schemas/auth.schemas'
import type { ApiResponse } from '@/types/api'
import type { 
  CreateUserParams, 
  UserWithSettings, 
} from '@/types/auth'

// Kullanıcı oluşturur (Transaction ile)
export async function createUser(params: CreateUserParams): Promise<ApiResponse<UserWithSettings>> {
  try {
    // 1. Girdi validasyonu
    const validatedParams = signupSchema.parse(params)
    const { email, password, username } = validatedParams

    // 2. Ön koşul kontrolleri (guard clauses)
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return { success: false, error: 'Bu email adresi zaten kullanımda' }
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username }
    })

    if (existingUsername) {
      return { success: false, error: 'Bu kullanıcı adı zaten kullanımda' }
    }

    // 3. Ana iş mantığı - Transaction ile kullanıcı + ayarları oluştur
    const uniqueSlug = generateUserSlug(username)
    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          passwordHash,
          username,
          slug: uniqueSlug,
          roles: [USER_ROLES.USER],
        }
      })

      const userSettings = await tx.userProfileSettings.create({
        data: {
          userId: user.id,
        }
      })

      return { user, userSettings }
    })

    // 4. Başarı loglaması
    logInfo(LOG_EVENTS.AUTH_SIGNUP_SUCCESS, 'Yeni kullanıcı oluşturuldu', {
      userId: result.user.id,
      email: result.user.email,
      username: result.user.username,
      slug: result.user.slug
    }, result.user.id)

    // 5. Başarılı yanıt
    const data: UserWithSettings = {
      ...result.user,
      userSettings: result.userSettings,
    }

    return { success: true, data }

  } catch (error) {
    // 6. Hata loglaması
    logError(LOG_EVENTS.SERVICE_ERROR, 'Kullanıcı oluşturma hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      email: params.email?.toLowerCase()
    })

    // 7. Hata yanıtı
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return { success: false, error: 'Bu kayıt zaten mevcut' }
      }
    }

    return { 
      success: false, 
      error: 'Kullanıcı oluşturulamadı'
    }
  }
}

// Kullanıcıyı email ile bulur
export async function findUserByEmail(email: string): Promise<ApiResponse<UserWithSettings | null>> {
  try {
    // 1. Girdi validasyonu
    const validatedEmail = emailSchema.parse(email)

    // 2. Ön koşul kontrolleri (guard clauses)
    if (!validatedEmail || validatedEmail.trim().length === 0) {
      return { success: false, error: 'Email adresi gerekli' }
    }

    // 3. Ana iş mantığı - Kullanıcı sorgulama
    const user = await prisma.user.findUnique({
      where: { email: validatedEmail },
      include: {
        userSettings: true
      }
    })

    // 4. Başarı loglaması (sadece bulunursa)
    if (user) {
      logInfo(LOG_EVENTS.DATABASE_READ, 'Kullanıcı email ile bulundu', {
        userId: user.id,
        email: validatedEmail
      }, user.id)
    }

    // 5. Başarılı yanıt
    return { success: true, data: user }

  } catch (error) {
    // 6. Hata loglaması
    logError(LOG_EVENTS.SERVICE_ERROR, 'Kullanıcı email ile bulunamadı', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      email: email.toLowerCase()
    })

    // 7. Hata yanıtı
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }

    return { 
      success: false, 
      error: 'Kullanıcı bulunamadı' 
    }
  }
}

// Kullanıcıyı username ile bulur
export async function findUserByUsername(username: string): Promise<ApiResponse<UserWithSettings | null>> {
  try {
    // 1. Girdi validasyonu
    const validatedUsername = usernameSchema.parse(username)

    // 2. Ön koşul kontrolleri (guard clauses)
    if (!validatedUsername || validatedUsername.trim().length === 0) {
      return { success: false, error: 'Kullanıcı adı gerekli' }
    }

    // 3. Ana iş mantığı - Kullanıcı sorgulama
    const user = await prisma.user.findUnique({
      where: { username: validatedUsername },
      include: {
        userSettings: true
      }
    })

    // 4. Başarı loglaması (sadece bulunursa)
    if (user) {
      logInfo(LOG_EVENTS.DATABASE_READ, 'Kullanıcı username ile bulundu', {
        userId: user.id,
        username: validatedUsername
      }, user.id)
    }

    // 5. Başarılı yanıt
    return { success: true, data: user }

  } catch (error) {
    // 6. Hata loglaması
    logError(LOG_EVENTS.SERVICE_ERROR, 'Kullanıcı username ile bulunamadı', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      username
    })

    // 7. Hata yanıtı
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }

    return { 
      success: false, 
      error: 'Kullanıcı bulunamadı' 
    }
  }
}

// Kullanıcıyı ID ile bulur
export async function findUserById(id: string): Promise<ApiResponse<UserWithSettings | null>> {
  try {
    // 1. Girdi validasyonu
    const validatedId = userIdSchema.parse(id)

    // 2. Ön koşul kontrolleri (guard clauses)
    if (!validatedId || validatedId.trim().length === 0) {
      return { success: false, error: 'Kullanıcı ID gerekli' }
    }

    // 3. Ana iş mantığı - Kullanıcı sorgulama
    const user = await prisma.user.findUnique({
      where: { id: validatedId },
      include: {
        userSettings: true
      }
    })

    // 4. Başarı loglaması (sadece bulunursa)
    if (user) {
      logInfo(LOG_EVENTS.DATABASE_READ, 'Kullanıcı ID ile bulundu', {
        userId: user.id
      }, user.id)
    }

    // 5. Başarılı yanıt
    return { success: true, data: user }

  } catch (error) {
    // 6. Hata loglaması
    logError(LOG_EVENTS.SERVICE_ERROR, 'Kullanıcı ID ile bulunamadı', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      userId: id
    })

    // 7. Hata yanıtı
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }

    return { 
      success: false, 
      error: 'Kullanıcı bulunamadı' 
    }
  }
}

// Kullanıcının email doğrulama durumunu günceller
export async function updateEmailVerificationStatus(
  userId: string, 
  isVerified: boolean
): Promise<ApiResponse<void>> {
  try {
    // 1. Girdi validasyonu
    const validatedUserId = userIdSchema.parse(userId)

    // 2. Ön koşul kontrolleri (guard clauses)
    if (typeof isVerified !== 'boolean') {
      return { success: false, error: 'Doğrulama durumu boolean olmalıdır' }
    }

    // 3. Ana iş mantığı - Email doğrulama durumu güncelleme
    await prisma.user.update({
      where: { id: validatedUserId },
      data: { 
        emailVerified: isVerified ? new Date() : null 
      }
    })

    // 4. Başarı loglaması
    logInfo(LOG_EVENTS.AUTH_EMAIL_VERIFIED, 'Email doğrulama durumu güncellendi', {
      userId: validatedUserId,
      isVerified
    }, validatedUserId)

    // 5. Başarılı yanıt
    return { success: true, data: undefined }

  } catch (error) {
    // 6. Hata loglaması
    logError(LOG_EVENTS.SERVICE_ERROR, 'Email doğrulama durumu güncellenemedi', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      userId,
      isVerified
    })

    // 7. Hata yanıtı
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }

    return { 
      success: false, 
      error: 'Email doğrulama durumu güncellenemedi' 
    }
  }
}

// Kullanıcının şifresini günceller
export async function updateUserPassword(
  userId: string, 
  newPassword: string
): Promise<ApiResponse<void>> {
  try {
    // 1. Girdi validasyonu
    const validatedUserId = userIdSchema.parse(userId)

    // 2. Ön koşul kontrolleri (guard clauses)
    if (!newPassword || newPassword.trim().length === 0) {
      return { success: false, error: 'Yeni şifre gerekli' }
    }

    if (newPassword.length < 8) {
      return { success: false, error: 'Şifre en az 8 karakter olmalıdır' }
    }

    // 3. Ana iş mantığı - Şifre hash'leme ve güncelleme
    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS)

    await prisma.user.update({
      where: { id: validatedUserId },
      data: { passwordHash }
    })

    // 4. Başarı loglaması
    logInfo(LOG_EVENTS.AUTH_PASSWORD_CHANGED, 'Kullanıcı şifresi güncellendi', {
      userId: validatedUserId
    }, validatedUserId)

    // 5. Başarılı yanıt
    return { success: true, data: undefined }

  } catch (error) {
    // 6. Hata loglaması
    logError(LOG_EVENTS.SERVICE_ERROR, 'Kullanıcı şifresi güncellenemedi', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      userId
    })

    // 7. Hata yanıtı
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }

    return { 
      success: false, 
      error: 'Şifre güncellenemedi' 
    }
  }
} 