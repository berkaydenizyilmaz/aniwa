// Aniwa Projesi - Environment Variables Validation
// Bu dosya environment değişkenlerini Zod ile doğrular

import { z } from 'zod'

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
  
  // Rate Limiting
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  
  // Email
  RESEND_API_KEY: z.string().optional(),
})

// Environment değişkenlerini doğrula
function validateEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      
      console.error('❌ Environment değişkenleri hatası:')
      missingVars.forEach(err => console.error(`  - ${err}`))
      console.error('\n📝 .env.local dosyanızı kontrol edin\n')
      
      // Development'ta uyarı ver, production'da hata fırlat
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Environment değişkenleri eksik veya hatalı')
      }
    }
    
    // Hata durumunda varsayılan değerlerle devam et
    return envSchema.parse({
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL || '',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'development-secret-key-min-32-chars',
    })
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
export const hasRateLimit = !!(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN)
export const hasEmail = !!env.RESEND_API_KEY 