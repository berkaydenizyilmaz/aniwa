// Aniwa Projesi - Auth Service
// Bu dosya kimlik doğrulama işlemlerini işlevsel yaklaşımla yönetir

import { prisma } from '@/lib/prisma'
import { logInfo, logError, logWarn } from '@/lib/logger'
import { LOG_EVENTS } from '@/lib/constants/logging'
import { USER_ROLES, BCRYPT_SALT_ROUNDS } from '@/lib/constants/auth'
import { DEFAULT_THEME, DEFAULT_LANGUAGE } from '@/lib/constants/app'
import bcrypt from 'bcryptjs'
import type { Prisma } from '@prisma/client'
import type { 
  CreateUserParams, 
  UserWithSettings, 
  UpdateProfileParams, 
  UpdateUserSettingsParams,
  AuthApiResponse
} from '@/types/auth'

/**
 * Yeni kullanıcı oluşturur
 */
export async function createUser(params: CreateUserParams): Promise<AuthApiResponse> {
  const { email, password, username, name } = params

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

    // Username kontrolü (eğer verilmişse)
    if (username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username }
      })

      if (existingUsername) {
        logWarn(LOG_EVENTS.AUTH_SIGNUP_FAILED, 'Username zaten kullanımda', {
          username
        })
        return { success: false, error: 'Bu kullanıcı adı zaten kullanımda' }
      }
    }

    // Şifreyi hash'le
    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)

    // Kullanıcıyı oluştur
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        username: username || email.split('@')[0],
        name,
        role: USER_ROLES.USER,
      }
    })

    // Varsayılan ayarları oluştur
    await prisma.userProfileSettings.create({
      data: {
        userId: user.id,
        themePreference: DEFAULT_THEME,
        languagePreference: DEFAULT_LANGUAGE
      }
    })

    logInfo(LOG_EVENTS.AUTH_SIGNUP_SUCCESS, 'Yeni kullanıcı oluşturuldu', {
      userId: user.id,
      email: user.email,
      username: user.username
    }, user.id)

    return { 
      success: true, 
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role
      }
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
 * Kullanıcıyı email ile getirir
 */
export async function getUserByEmail(email: string): Promise<UserWithSettings | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        userSettings: true
      }
    })

    if (!user) return null

    return user
  } catch (error) {
    logError(LOG_EVENTS.AUTH_SESSION_ERROR, 'Email ile kullanıcı getirme hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      email: email.toLowerCase()
    })
    return null
  }
}

/**
 * Kullanıcı şifresini günceller
 */
export async function updatePassword(userId: string, newPassword: string): Promise<AuthApiResponse> {
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
export async function updateProfile(userId: string, data: UpdateProfileParams): Promise<AuthApiResponse> {
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
export async function updateUserSettings(userId: string, settings: UpdateUserSettingsParams): Promise<AuthApiResponse> {
  try {
    const userSettings = await prisma.userProfileSettings.upsert({
      where: { userId },
      update: {
        themePreference: settings.themePreference,
        languagePreference: settings.languagePreference,
        notificationPreferences: settings.notificationPreferences as Prisma.InputJsonValue,
        privacySettings: settings.privacySettings as Prisma.InputJsonValue
      },
      create: {
        userId,
        themePreference: settings.themePreference || 'system',
        languagePreference: settings.languagePreference || 'tr',
        notificationPreferences: settings.notificationPreferences as Prisma.InputJsonValue,
        privacySettings: settings.privacySettings as Prisma.InputJsonValue
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