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
} from '@/types/auth'
import type { ApiResponse } from '@/types/api'

// Yeni kullanıcı oluşturur (Transaction ile)
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