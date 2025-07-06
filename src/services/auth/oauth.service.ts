// Aniwa Projesi - OAuth Service
// Bu dosya OAuth geçici kullanıcı işlemlerini işlevsel yaklaşımla yönetir

import { prisma } from '@/lib/db/prisma'
import { logInfo, logError, logWarn } from '@/lib/logger'
import { LOG_EVENTS } from '@/constants/logging'
import { USER_ROLES, OAUTH_TOKEN_EXPIRY_HOURS } from '@/constants/auth'
import { generateUserSlug } from '@/lib/utils'
import type { 
  CreateOAuthPendingUserParams, 
  OAuthTokenVerificationParams,
  AuthApiResponse
} from '@/types/auth'

/**
 * OAuth geçici kullanıcısı oluşturur
 */
export async function createOAuthPendingUser(
  params: CreateOAuthPendingUserParams
): Promise<AuthApiResponse<{ token: string }>> {
  const { email, provider, providerId, name, image } = params

  try {
    // Mevcut kullanıcı kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      logInfo(LOG_EVENTS.AUTH_OAUTH_SUCCESS, 'Mevcut kullanıcı OAuth girişi', {
        userId: existingUser.id,
        email: existingUser.email,
        provider
      }, existingUser.id)

      return { 
        success: true, 
        data: { token: 'existing_user' } // Özel token - mevcut kullanıcı
      }
    }

    // Benzersiz token oluştur
    const tokenBytes = new Uint8Array(32)
    crypto.getRandomValues(tokenBytes)
    const token = Array.from(tokenBytes, byte => byte.toString(16).padStart(2, '0')).join('')
    const expiresAt = new Date(Date.now() + OAUTH_TOKEN_EXPIRY_HOURS * (60 * 1000))

    // Mevcut pending user'ı temizle
    await prisma.oAuthPendingUser.deleteMany({
      where: { email: email.toLowerCase() }
    })

    // Yeni pending user oluştur
    const pendingUser = await prisma.oAuthPendingUser.create({
      data: {
        email: email.toLowerCase(),
        provider,
        providerId,
        name,
        image,
        token,
        expiresAt
      }
    })

    logInfo(LOG_EVENTS.AUTH_OAUTH_SUCCESS, 'OAuth geçici kullanıcı oluşturuldu', {
      email: pendingUser.email,
      provider,
      token: token.substring(0, 8) + '...' // Güvenlik için sadece başlangıcı logla
    })

    return { 
      success: true, 
      data: { token }
    }
  } catch (error) {
    logError(LOG_EVENTS.AUTH_OAUTH_FAILED, 'OAuth geçici kullanıcı oluşturma hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      email: email.toLowerCase(),
      provider
    })
    return { 
      success: false, 
      error: 'OAuth işlemi başarısız' 
    }
  }
}

/**
 * Token ile kullanıcı oluşturur ve geçici kaydı siler (Transaction ile)
 */
export async function verifyOAuthTokenAndCreateUser(
  params: OAuthTokenVerificationParams
): Promise<AuthApiResponse> {
  const { token, username } = params

  try {
    // Mevcut kullanıcı özel durumu
    if (token === 'existing_user') {
      return { success: false, error: 'Kullanıcı zaten mevcut' }
    }

    // Geçici kullanıcıyı bul
    const pendingUser = await prisma.oAuthPendingUser.findUnique({
      where: { token }
    })

    if (!pendingUser) {
      logWarn(LOG_EVENTS.AUTH_OAUTH_FAILED, 'Geçersiz OAuth token', { token: token.substring(0, 8) + '...' })
      return { success: false, error: 'Geçersiz veya süresi dolmuş token' }
    }

    // Token süresi kontrolü
    if (pendingUser.expiresAt < new Date()) {
      await prisma.oAuthPendingUser.delete({ where: { id: pendingUser.id } })
      logWarn(LOG_EVENTS.AUTH_OAUTH_FAILED, 'OAuth token süresi dolmuş', {
        email: pendingUser.email,
        provider: pendingUser.provider
      })
      return { success: false, error: 'Token süresi dolmuş, lütfen tekrar giriş yapın' }
    }

    // Username kontrolü
    const existingUsername = await prisma.user.findUnique({
      where: { username }
    })

    if (existingUsername) {
      logWarn(LOG_EVENTS.AUTH_SIGNUP_FAILED, 'Username zaten kullanımda', {
        username,
        email: pendingUser.email
      })
      return { success: false, error: 'Bu kullanıcı adı zaten kullanımda' }
    }

    // Slug oluştur
    const uniqueSlug = generateUserSlug(username)

    // Transaction ile kullanıcı + ayarları oluştur ve geçici kaydı sil
    const result = await prisma.$transaction(async (tx) => {
      // 1. Kullanıcıyı oluştur
      const user = await tx.user.create({
        data: {
          email: pendingUser.email,
          username,
          slug: uniqueSlug,
          roles: [USER_ROLES.USER],
          image: pendingUser.image,
          emailVerified: new Date() // OAuth kullanıcıları doğrulanmış sayılır
        }
      })

      // 2. Varsayılan ayarları oluştur
      const userSettings = await tx.userProfileSettings.create({
        data: {
          userId: user.id,
        }
      })

      // 3. Geçici kaydı sil
      await tx.oAuthPendingUser.delete({ where: { id: pendingUser.id } })

      return { user, userSettings }
    })

    logInfo(LOG_EVENTS.AUTH_USER_CREATED, 'OAuth kullanıcısı oluşturuldu', {
      userId: result.user.id,
      email: result.user.email,
      username: result.user.username,
      slug: result.user.slug,
      provider: pendingUser.provider
    }, result.user.id)

    return { 
      success: true, 
      data: {
        id: result.user.id,
        email: result.user.email,
        username: result.user.username,
        roles: result.user.roles
      }
    }
  } catch (error) {
    logError(LOG_EVENTS.AUTH_SIGNUP_FAILED, 'OAuth kullanıcı oluşturma hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      username
    })
    return { 
      success: false, 
      error: 'Kullanıcı oluşturulamadı' 
    }
  }
}

/**
 * Token ile geçici kullanıcı bilgilerini getirir
 */
export async function getOAuthPendingUser(token: string) {
  try {
    if (token === 'existing_user') {
      return null
    }

    const pendingUser = await prisma.oAuthPendingUser.findUnique({
      where: { token }
    })

    if (!pendingUser || pendingUser.expiresAt < new Date()) {
      return null
    }

    return pendingUser
  } catch (error) {
    logError(LOG_EVENTS.AUTH_SESSION_ERROR, 'OAuth geçici kullanıcı getirme hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    })
    return null
  }
} 