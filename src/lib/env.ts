// Aniwa Projesi - Environment Variables Validation
// Bu dosya environment değişkenlerini Zod ile doğrular

import { z } from 'zod'
import { logError, logInfo } from './logger'
import { LOG_EVENTS } from './constants/logging'

// Environment değişkenleri için Zod şeması
const envSchema = z.object({
  // Node Environment
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL gerekli'),
  
  // Authentication
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET en az 32 karakter olmalı'),
  NEXTAUTH_URL: z.string().url().optional(),
  
  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  
  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  
  // Rate Limiting (Vercel KV / Upstash Redis)
  KV_URL: z.string().optional(),
  KV_REST_API_URL: z.string().url().optional(),
  KV_REST_API_TOKEN: z.string().optional(),
  KV_REST_API_READ_ONLY_TOKEN: z.string().optional(),
  REDIS_URL: z.string().optional(),
  
  // Email
  RESEND_API_KEY: z.string().optional(),
})

// Environment değişkenlerini doğrula
function validateEnv() {
  try {
    const validatedEnv = envSchema.parse(process.env)
    
    // Başarılı validation'ı logla
    logInfo(LOG_EVENTS.DATABASE, 'Environment variables validated successfully', {
      nodeEnv: validatedEnv.NODE_ENV,
      hasDatabase: !!validatedEnv.DATABASE_URL,
      hasAuth: !!validatedEnv.NEXTAUTH_SECRET,
      hasGoogleAuth: !!(validatedEnv.GOOGLE_CLIENT_ID && validatedEnv.GOOGLE_CLIENT_SECRET),
      hasCloudinary: !!(validatedEnv.CLOUDINARY_CLOUD_NAME && validatedEnv.CLOUDINARY_API_KEY),
      hasRateLimit: !!(validatedEnv.KV_REST_API_URL || validatedEnv.REDIS_URL),
      hasEmail: !!validatedEnv.RESEND_API_KEY,
    })
    
    return validatedEnv
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      
      // Environment hatalarını logla
      logError(LOG_EVENTS.DATABASE, 'Environment variables validation failed', {
        errors: missingVars.join(', '),
        nodeEnv: process.env.NODE_ENV || 'unknown',
        errorCount: error.errors.length,
      })
      
      console.error('❌ Environment değişkenleri hatası:')
      missingVars.forEach(err => console.error(`  - ${err}`))
      console.error('\n📝 .env dosyanızı kontrol edin\n')
      
      // Development'ta uyarı ver, production'da hata fırlat
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Environment değişkenleri eksik veya hatalı')
      }
    }
    
    // Hata durumunda varsayılan değerlerle devam et
    const fallbackEnv = envSchema.parse({
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL || '',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'development-secret-key-min-32-chars',
    })
    
    return fallbackEnv
  }
}

// Doğrulanmış environment değişkenlerini export et
export const env = validateEnv()

// Tip güvenliği için environment tipini export et
export type Env = z.infer<typeof envSchema>

// Kolay erişim için yardımcı fonksiyonlar
export const isDevelopment = env.NODE_ENV === 'development'
export const isProduction = env.NODE_ENV === 'production'

// Servislerin aktif olup olmadığını kontrol et
export const hasGoogleAuth = !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET)
export const hasCloudinary = !!(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET)
export const hasRateLimit = !!(env.KV_REST_API_URL && env.KV_REST_API_TOKEN) || !!env.REDIS_URL
export const hasEmail = !!env.RESEND_API_KEY 