import { z } from 'zod'
import { AUTH } from '@/constants'

// Temel field şemaları
export const emailSchema = z
  .string()
  .email('Geçerli bir email adresi giriniz')
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
  .regex(AUTH.USERNAME_REGEX, 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir')
  .toLowerCase()
  .transform((username) => username.trim())

// Auth şemaları

// Kullanıcı kayıt şeması
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
})

// Kullanıcı giriş şeması
export const loginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
})

// Şifre sıfırlama talebi şeması
export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

// Şifre sıfırlama şeması
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token gerekli'),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
})

// Şifre değiştirme şeması
export const changePasswordSchema = z.object({
  newPassword: passwordSchema,
})

// Kullanıcı adı kontrol şeması
export const checkUsernameSchema = z.object({
  username: usernameSchema,
})

// Verification token şemaları

// Token oluşturma şeması
export const createVerificationTokenSchema = z.object({
  email: emailSchema,
  type: z.enum(Object.values(AUTH.VERIFICATION_TOKEN_TYPES) as [string, ...string[]]),
  expiryHours: z.number().positive('Geçerli süre belirtilmeli')
})

// Token doğrulama şeması
export const verifyTokenSchema = z.object({
  token: z.string().min(1, 'Token gerekli'),
  type: z.enum(Object.values(AUTH.VERIFICATION_TOKEN_TYPES) as [string, ...string[]])
})

// Type exports
export type SignupData = z.infer<typeof signupSchema>
export type LoginData = z.infer<typeof loginSchema>
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>
export type ChangePasswordData = z.infer<typeof changePasswordSchema>
export type CheckUsernameData = z.infer<typeof checkUsernameSchema>
export type CreateVerificationTokenData = z.infer<typeof createVerificationTokenSchema>
export type VerifyTokenData = z.infer<typeof verifyTokenSchema> 