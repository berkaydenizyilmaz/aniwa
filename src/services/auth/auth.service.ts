// Aniwa Projesi - Auth Service
// Bu dosya kimlik doğrulama işlemlerini işlevsel yaklaşımla yönetir

import { prisma } from '@/lib/db/prisma'
import { logInfo, logError, logWarn } from '@/lib/logger'
import { LOG_EVENTS } from '@/constants/logging'
import { USER_ROLES, BCRYPT_SALT_ROUNDS } from '@/constants/auth'
import { generateUserSlug } from '@/lib/utils'
import bcrypt from 'bcryptjs'
import type { 
  CreateUserParams, 
  UserWithSettings, 
  UpdateProfileParams, 
  UpdateUserSettingsParams,
} from '@/types/auth'
import type { ApiResponse } from '@/types/api'

/**
 * Yeni kullanıcı oluşturur (Transaction ile)
 */
export async function createUser(params: CreateUserParams): Promise<ApiResponse<UserWithSettings>> {
  const { email, password, username } = params

  try {
    // Email kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      logWarn(LOG_EVENTS.AUTH_SIGNUP_FAILED, 'Email zaten kullanımda', {
        email: email.toLowerCase()
      })
      return { success: false, error: 'Bu email adresi zaten kullanımda' }
    }

    // Username kontrolü
    const existingUsername = await prisma.user.findUnique({
      where: { username }
    })

    if (existingUsername) {
      logWarn(LOG_EVENTS.AUTH_SIGNUP_FAILED, 'Username zaten kullanımda', {
        username
      })
      return { success: false, error: 'Bu kullanıcı adı zaten kullanımda' }
    }

    // Slug oluştur
    const uniqueSlug = generateUserSlug(username)

    // Şifreyi hash'le
    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)

    // Transaction ile kullanıcı + ayarları oluştur
    const result = await prisma.$transaction(async (tx) => {
      // 1. Kullanıcıyı oluştur
      const user = await tx.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        username,
          slug: uniqueSlug,
        roles: [USER_ROLES.USER],
      }
    })

      // 2. Varsayılan ayarları oluştur
      const userSettings = await tx.userProfileSettings.create({
      data: {
        userId: user.id,
      }
      })

      return { user, userSettings }
    })

    logInfo(LOG_EVENTS.AUTH_SIGNUP_SUCCESS, 'Yeni kullanıcı oluşturuldu', {
      userId: result.user.id,
      email: result.user.email,
      username: result.user.username,
      slug: result.user.slug
    }, result.user.id)

    const data: UserWithSettings = {
      ...result.user,
      userSettings: result.userSettings,
    }

    return { 
      success: true, 
      data
    }
  } catch (error) {
    logError(LOG_EVENTS.AUTH_SIGNUP_FAILED, 'Kullanıcı oluşturma hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      email: email.toLowerCase()
    })
    return { 
      success: false, 
      error: 'Kullanıcı oluşturulamadı'
    }
  }
}

/**
 * Kullanıcıyı ID ile getirir (ayarlarıyla birlikte)
 */
export async function getUserById(userId: string): Promise<UserWithSettings | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userSettings: true
      }
    })

    if (!user) return null

    return user
  } catch (error) {
    logError(LOG_EVENTS.AUTH_SESSION_ERROR, 'Kullanıcı bilgisi getirme hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      userId
    })
    return null
  }
}

/**
 * Kullanıcıyı username ile getirir
 */
export async function getUserByUsername(username: string): Promise<UserWithSettings | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        userSettings: true
      }
    })

    if (!user) return null

    return user
  } catch (error) {
    logError(LOG_EVENTS.AUTH_SESSION_ERROR, 'Username ile kullanıcı getirme hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      username
    })
    return null
  }
}

/**
 * Kullanıcı şifresini günceller
 */
export async function updatePassword(userId: string, newPassword: string): Promise<ApiResponse> {
  try {
    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS)

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash }
    })

    logInfo(LOG_EVENTS.USER_ACTION, 'Şifre güncellendi', {
      userId
    }, userId)

    return { success: true }
  } catch (error) {
    logError(LOG_EVENTS.AUTH_SESSION_ERROR, 'Şifre güncelleme hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      userId
    }, userId)
    return { success: false, error: 'Şifre güncellenemedi' }
  }
}

/**
 * Kullanıcı profilini günceller
 */
export async function updateProfile(userId: string, data: UpdateProfileParams): Promise<ApiResponse> {
  try {
    // Username kontrolü (eğer değiştiriliyorsa)
    if (data.username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: data.username,
          NOT: { id: userId }
        }
      })

      if (existingUser) {
        return { success: false, error: 'Bu kullanıcı adı zaten kullanımda' }
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      include: {
        userSettings: true
      }
    })

    logInfo(LOG_EVENTS.USER_ACTION, 'Profil güncellendi', {
      userId,
      updatedFields: Object.keys(data).join(', ')
    }, userId)

    return { success: true, data: user }
  } catch (error) {
    logError(LOG_EVENTS.USER_ACTION, 'Profil güncelleme hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      userId
    }, userId)
    return { success: false, error: 'Profil güncellenemedi' }
  }
}

/**
 * Kullanıcı ayarlarını günceller
 */
export async function updateUserSettings(userId: string, settings: UpdateUserSettingsParams): Promise<ApiResponse> {
  try {
    const userSettings = await prisma.userProfileSettings.upsert({
      where: { userId },
      update: {
      },
      create: {
        userId,
      }
    })

    logInfo(LOG_EVENTS.USER_ACTION, 'Kullanıcı ayarları güncellendi', {
      userId,
      updatedSettings: Object.keys(settings).join(', ')
    }, userId)

    return { success: true, data: userSettings }
  } catch (error) {
    logError(LOG_EVENTS.USER_ACTION, 'Ayarlar güncelleme hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      userId
    }, userId)
    return { success: false, error: 'Ayarlar güncellenemedi' }
  }
}

/**
 * Kullanıcının email doğrulama durumunu kontrol eder
 */
export async function checkEmailVerification(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { emailVerified: true }
    })

    return !!user?.emailVerified
  } catch (error) {
    logError(LOG_EVENTS.AUTH_SESSION_ERROR, 'Email doğrulama kontrolü hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      userId
    })
    return false
  }
} 