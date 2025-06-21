// Aniwa Projesi - Prisma Client Konfigürasyonu
// Bu dosya Prisma client'ı optimize eder ve global instance yönetir

import { PrismaClient } from '@prisma/client'
import { env } from '@/lib/env'

// Global Prisma instance için tip tanımı
declare global {
  var __prisma: PrismaClient | undefined
}

// Prisma Client konfigürasyonu
const createPrismaClient = () => {
  return new PrismaClient({
    log: ['error'],
    datasources: {
      db: {
        url: env.DATABASE_URL
      }
    }
  })
}

// Global instance yönetimi (Hot reload için)
export const prisma = globalThis.__prisma ?? createPrismaClient()

// Development'ta global instance'ı sakla
if (env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}

// Graceful shutdown
export const disconnectPrisma = async () => {
  await prisma.$disconnect()
}

// Database bağlantı kontrolü
export const checkDatabaseConnection = async () => {
  try {
    await prisma.$connect()
    return { success: true, message: 'Database bağlantısı başarılı' }
  } catch (error) {
    return { 
      success: false, 
      message: 'Database bağlantısı başarısız',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }
  }
} 