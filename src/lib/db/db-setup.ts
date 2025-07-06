// Aniwa Projesi - Database Setup
// Bu dosya MongoDB özel konfigürasyonlarını yönetir

import { prisma } from './prisma'
import { logInfo, logError, logWarn } from '../logger'
import { LOG_EVENTS } from '../../constants/logging'

/**
 * MongoDB TTL (Time To Live) index'lerini kurar
 * OAuthPendingUser kayıtları expiresAt tarihinde otomatik silinir
 */
export async function setupTTLIndexes() {
  try {
    // Mevcut index'leri kontrol et
    const existingIndexes = await prisma.$runCommandRaw({
      listIndexes: 'OAuthPendingUser'
    }) as { cursor: { firstBatch: Array<{ name: string }> } }

    const hasOAuthTTL = existingIndexes.cursor.firstBatch.some(
      index => index.name === 'oauth_pending_ttl'
    )

    if (hasOAuthTTL) {
      logInfo(LOG_EVENTS.AUTH_OAUTH_SUCCESS, 'TTL index zaten mevcut', {
        collection: 'OAuthPendingUser',
        indexName: 'oauth_pending_ttl'
      })
      return { success: true, message: 'Index already exists' }
    }

    // TTL index oluştur - her kayıt kendi expiresAt'ında silinir
    await prisma.$runCommandRaw({
      createIndexes: 'OAuthPendingUser',
      indexes: [
        {
          key: { expiresAt: 1 },
          name: 'oauth_pending_ttl',
          expireAfterSeconds: 0 // Her kayıt kendi expiresAt tarihinde silinir
        }
      ]
    })

    logInfo(LOG_EVENTS.AUTH_OAUTH_SUCCESS, 'MongoDB TTL index oluşturuldu', {
      collection: 'OAuthPendingUser',
      field: 'expiresAt',
      behavior: 'Her kayıt kendi expiresAt tarihinde otomatik silinir'
    })

    return { success: true, message: 'TTL index created' }
  } catch (error) {
    logError(LOG_EVENTS.AUTH_OAUTH_FAILED, 'TTL index kurulum hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    })
    return { success: false, error }
  }
}

/**
 * Uygulama başlangıcında veritabanı setup'ını çalıştır
 * Güvenli: Sadece gerekirse index oluşturur
 */
export async function initializeDatabase() {
  try {
    const result = await setupTTLIndexes()
    
    if (result.success) {
      logInfo(LOG_EVENTS.AUTH_OAUTH_SUCCESS, 'Veritabanı başlatma tamamlandı', {
        result: result.message
      })
    } else {
             logWarn(LOG_EVENTS.AUTH_OAUTH_FAILED, 'TTL index kurulumunda sorun', {
         error: result.error instanceof Error ? result.error.message : 'Bilinmeyen hata'
       })
    }
  } catch (error) {
    logError(LOG_EVENTS.AUTH_OAUTH_FAILED, 'Veritabanı başlatma hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    })
  }
}