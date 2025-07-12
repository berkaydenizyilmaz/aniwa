// Aniwa Projesi - Auth Schemas
// Bu dosya kimlik doğrulama ile ilgili Zod şemalarını içerir

import { z } from 'zod'
import { AUTH } from '@/constants'

// =============================================================================
// TEMEL FIELD ŞEMALARI
// =============================================================================

export const emailSchema = z
  .string()
  .email('Geçerli bir email adresi giriniz')
  .max(AUTH.MAX_EMAIL_LENGTH, `Email adresi en fazla ${AUTH.MAX_EMAIL_LENGTH} karakter olabilir`)
  .toLowerCase()
  .transform((email) => email.trim())

export const passwordSchema = z
  .string()
  .min(AUTH.MIN_PASSWORD_LENGTH, `Şifre en az ${AUTH.MIN_PASSWORD_LENGTH} karakter olmalı`)
  .max(AUTH.MAX_PASSWORD_LENGTH, `Şifre en fazla ${AUTH.MAX_PASSWORD_LENGTH} karakter olabilir`)

export const usernameSchema = z
  .string()
  .min(AUTH.MIN_USERNAME_LENGTH, `Kullanıcı adı en az ${AUTH.MIN_USERNAME_LENGTH} karakter olmalı`)
  .max(AUTH.MAX_USERNAME_LENGTH, `Kullanıcı adı en fazla ${AUTH.MAX_USERNAME_LENGTH} karakter olabilir`)
  .regex(AUTH.USERNAME_REGEX, 'Kullanıcı adı sadece harf, rakam, alt çizgi ve tire içerebilir')
  .toLowerCase()
  .transform((username) => username.trim())

// =============================================================================
// AUTH ŞEMALARI
// =============================================================================

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
})

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token gerekli'),
  password: passwordSchema,
})

export const checkUsernameSchema = z.object({
  username: usernameSchema,
})

// =============================================================================
// VERIFICATION TOKEN ŞEMALARI
// =============================================================================

export const createVerificationTokenSchema = z.object({
  email: emailSchema,
  type: z.enum(['PASSWORD_RESET'] as const),
  expiryHours: z.number().positive('Geçerli süre belirtilmeli')
})

export const verifyTokenSchema = z.object({
  token: z.string().min(1, 'Token gerekli'),
  type: z.enum(['PASSWORD_RESET'] as const)
}) 