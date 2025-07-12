// Bu dosya kimlik doğrulama ile ilgili tüm Zod şemalarını içerir

import { z } from 'zod'
import { 
  MIN_PASSWORD_LENGTH, 
  MAX_PASSWORD_LENGTH, 
  MIN_USERNAME_LENGTH, 
  MAX_USERNAME_LENGTH,
  USERNAME_REGEX,
  MAX_EMAIL_LENGTH
} from '@/constants/auth'

// Temel field şemaları
export const emailSchema = z
  .string()
  .email('Geçerli bir email adresi giriniz')
  .max(MAX_EMAIL_LENGTH, `Email adresi en fazla ${MAX_EMAIL_LENGTH} karakter olabilir`)
  .toLowerCase()
  .transform((email) => email.trim())

export const passwordSchema = z
  .string()
  .min(MIN_PASSWORD_LENGTH, `Şifre en az ${MIN_PASSWORD_LENGTH} karakter olmalı`)
  .max(MAX_PASSWORD_LENGTH, `Şifre en fazla ${MAX_PASSWORD_LENGTH} karakter olabilir`)

export const usernameSchema = z
  .string()
  .min(MIN_USERNAME_LENGTH, `Kullanıcı adı en az ${MIN_USERNAME_LENGTH} karakter olmalı`)
  .max(MAX_USERNAME_LENGTH, `Kullanıcı adı en fazla ${MAX_USERNAME_LENGTH} karakter olabilir`)
  .regex(USERNAME_REGEX, 'Kullanıcı adı sadece harf, rakam, alt çizgi ve tire içerebilir')
  .toLowerCase()
  .transform((username) => username.trim())

export const userIdSchema = z.string().min(1, 'Kullanıcı ID gerekli')

// Ana auth şemaları
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

// User update şeması
export const userUpdateSchema = z.object({
  email: emailSchema.optional(),
  username: usernameSchema.optional(),
  bio: z.string().max(500, 'Bio en fazla 500 karakter olabilir').optional(),
  profilePicture: z.string().url('Geçerli bir URL giriniz').optional(),
  profileBanner: z.string().url('Geçerli bir URL giriniz').optional(),
  image: z.string().url('Geçerli bir URL giriniz').optional(),
})

// Verification token şemaları
export const createVerificationTokenSchema = z.object({
  email: emailSchema,
  type: z.enum(['PASSWORD_RESET'] as const),
  expiryHours: z.number().positive('Geçerli süre belirtilmeli')
})

export const verifyTokenSchema = z.object({
  token: z.string().min(1, 'Token gerekli'),
  type: z.enum(['PASSWORD_RESET'] as const)
})

// NextAuth session şeması
export const sessionUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string(),
  image: z.string().url().optional(),
  roles: z.array(z.enum(['USER', 'MODERATOR', 'ADMIN'])),
}) 