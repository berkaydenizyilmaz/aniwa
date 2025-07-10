// Aniwa Projesi - Database Setup
// Bu dosya MongoDB özel konfigürasyonlarını yönetir

import { logInfo } from '../logger'
import { LOG_EVENTS } from '../../constants/logging'

/**
 * Uygulama başlangıcında veritabanı setup'ını çalıştır
 * Şu an için herhangi bir özel setup gerekmiyor
 */
export async function initializeDatabase() {
  logInfo(LOG_EVENTS.AUTH_OAUTH_SUCCESS, 'Veritabanı başlatma tamamlandı', {
    message: 'Özel setup gerekmiyor'
  })
}