// Aniwa Projesi - Verification Token Zod Schemas
// Bu dosya verification token validasyon şemalarını içerir

import { z } from 'zod'

// Verification token oluşturma şeması
export const createVerificationTokenSchema = z.object({
  email: z.string().email('Geçersiz email formatı'),
  type: z.enum(['EMAIL_VERIFICATION', 'PASSWORD_RESET'] as const),
  expiryHours: z.number().positive('Geçerli süre belirtilmeli')
})

// Verification token doğrulama şeması
export const verifyTokenSchema = z.object({
  token: z.string().min(32, 'Geçersiz token formatı'),
  type: z.enum(['EMAIL_VERIFICATION', 'PASSWORD_RESET'] as const)
})

// Tip çıkarımları
export type CreateVerificationTokenData = z.infer<typeof createVerificationTokenSchema>
export type VerifyTokenData = z.infer<typeof verifyTokenSchema> 