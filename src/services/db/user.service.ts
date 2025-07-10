// Aniwa Projesi - User Database Service
// Bu dosya kullanıcı CRUD işlemlerini yönetir

import { prisma } from '@/lib/db/prisma'
import { logInfo, logError, logWarn } from '@/lib/logger'
import { LOG_EVENTS } from '@/constants/logging'
import { USER_ROLES, BCRYPT_SALT_ROUNDS } from '@/constants/auth'
import { z } from 'zod'
import { generateUserSlug } from '@/lib/utils'
import { Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { signupSchema } from '@/lib/schemas/auth.schemas'
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

    // 2. Email kontrolü (guard clause)
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      logWarn(LOG_EVENTS.AUTH_SIGNUP_FAILED, 'Email zaten kullanımda', {
        email: email.toLowerCase()
      })
      return { success: false, error: 'Bu email adresi zaten kullanımda' }
    }

    // 3. Username kontrolü (guard clause)
    const existingUsername = await prisma.user.findUnique({
      where: { username }
    })

    if (existingUsername) {
      logWarn(LOG_EVENTS.AUTH_SIGNUP_FAILED, 'Username zaten kullanımda', {
        username
      })
      return { success: false, error: 'Bu kullanıcı adı zaten kullanımda' }
    }

    // 4. Ana iş mantığı
    const uniqueSlug = generateUserSlug(username)
    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)

    // Transaction ile kullanıcı + ayarları oluştur
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

    // 5. Başarı loglaması
    logInfo(LOG_EVENTS.AUTH_SIGNUP_SUCCESS, 'Yeni kullanıcı oluşturuldu', {
      userId: result.user.id,
      email: result.user.email,
      username: result.user.username,
      slug: result.user.slug
    }, result.user.id)

    // 6. Başarılı yanıt
    const data: UserWithSettings = {
      ...result.user,
      userSettings: result.userSettings,
    }

    return { success: true, data }

  } catch (error) {
    // 7. Hata yönetimi
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return { success: false, error: 'Bu kayıt zaten mevcut' }
      }
    }

    // 8. Hata loglaması
    logError(LOG_EVENTS.AUTH_SIGNUP_FAILED, 'Kullanıcı oluşturma hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      email: params.email?.toLowerCase()
    })

    return { 
      success: false, 
      error: 'Kullanıcı oluşturulamadı'
    }
  }
}

// Kullanıcıyı email ile bulur
export async function findUserByEmail(email: string): Promise<ApiResponse<UserWithSettings | null>> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        userSettings: true
      }
    })

    return { success: true, data: user }
  } catch (error) {
    logError(LOG_EVENTS.DATABASE_ERROR, 'Kullanıcı email ile bulunamadı', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      email: email.toLowerCase()
    })

    return { 
      success: false, 
      error: 'Kullanıcı bulunamadı' 
    }
  }
}

// Kullanıcıyı username ile bulur
export async function findUserByUsername(username: string): Promise<ApiResponse<UserWithSettings | null>> {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        userSettings: true
      }
    })

    return { success: true, data: user }
  } catch (error) {
    logError(LOG_EVENTS.DATABASE_ERROR, 'Kullanıcı username ile bulunamadı', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      username
    })

    return { 
      success: false, 
      error: 'Kullanıcı bulunamadı' 
    }
  }
}

// Kullanıcıyı ID ile bulur
export async function findUserById(id: string): Promise<ApiResponse<UserWithSettings | null>> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        userSettings: true
      }
    })

    return { success: true, data: user }
  } catch (error) {
    logError(LOG_EVENTS.DATABASE_ERROR, 'Kullanıcı ID ile bulunamadı', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      userId: id
    })

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
    await prisma.user.update({
      where: { id: userId },
      data: { 
        emailVerified: isVerified ? new Date() : null 
      }
    })

    logInfo(LOG_EVENTS.AUTH_EMAIL_VERIFIED, 'Email doğrulama durumu güncellendi', {
      userId,
      isVerified
    }, userId)

    return { success: true, data: undefined }
  } catch (error) {
    logError(LOG_EVENTS.DATABASE_ERROR, 'Email doğrulama durumu güncellenemedi', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      userId,
      isVerified
    })

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
    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS)

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash }
    })

    logInfo(LOG_EVENTS.AUTH_PASSWORD_CHANGED, 'Kullanıcı şifresi güncellendi', {
      userId
    }, userId)

    return { success: true, data: undefined }
  } catch (error) {
    logError(LOG_EVENTS.DATABASE_ERROR, 'Kullanıcı şifresi güncellenemedi', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      userId
    })

    return { 
      success: false, 
      error: 'Şifre güncellenemedi' 
    }
  }
} 