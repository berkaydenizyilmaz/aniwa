// Aniwa Projesi - Auth Zod Schemas
// Bu dosya kimlik doğrulama ile ilgili tüm validasyon şemalarını içerir

import { z } from 'zod'
import { UserRole } from '@prisma/client'
import {
  USERNAME_REGEX,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  TOKEN_MIN_LENGTH,
  EMAIL_MIN_LENGTH,
} from '../../constants/auth'

// Prisma enum'larını Zod enum'larına çevir
const userRoleEnum = z.enum([UserRole.USER, UserRole.MODERATOR, UserRole.EDITOR, UserRole.ADMIN])

// User ID şeması (MongoDB ObjectId)
export const userIdSchema = z
  .string()
  .min(24, 'Geçersiz kullanıcı ID')
  .max(24, 'Geçersiz kullanıcı ID')
  .regex(/^[a-f\d]{24}$/i, 'Geçersiz kullanıcı ID formatı')

// Email şeması
export const emailSchema = z
  .string()
  .min(EMAIL_MIN_LENGTH, 'Email adresi gerekli')
  .email('Geçerli bir email adresi giriniz')
  .toLowerCase()

// Username şeması
export const usernameSchema = z
  .string()
  .min(USERNAME_MIN_LENGTH, `Kullanıcı adı en az ${USERNAME_MIN_LENGTH} karakter olmalıdır`)
  .max(USERNAME_MAX_LENGTH, `Kullanıcı adı en fazla ${USERNAME_MAX_LENGTH} karakter olmalıdır`)
  .regex(USERNAME_REGEX, 'Kullanıcı adı sadece küçük harf ve rakam içerebilir')

// Password şeması
export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Şifre en az ${PASSWORD_MIN_LENGTH} karakter olmalıdır`)
  .max(PASSWORD_MAX_LENGTH, `Şifre en fazla ${PASSWORD_MAX_LENGTH} karakter olmalıdır`)

// Signup şeması
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
})

// Login şeması
export const loginSchema = z.object({
  username: usernameSchema,
  password: z.string().min(PASSWORD_MIN_LENGTH, 'Şifre gerekli'),
})

// Username kontrol şeması
export const checkUsernameSchema = z.object({
  username: usernameSchema,
})

// Email doğrulama şeması
export const verifyEmailSchema = z.object({
  token: z.string().min(TOKEN_MIN_LENGTH, 'Doğrulama kodu gerekli'),
})

// Şifre sıfırlama talebi şeması
export const forgotPasswordSchema = z.object({
  email: emailSchema
})

// Şifre sıfırlama şeması (frontend form için - password + confirm)
export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
})

// Şifre sıfırlama API şeması (backend için - token + password)
export const resetPasswordApiSchema = z.object({
  token: z.string().min(TOKEN_MIN_LENGTH, 'Token gerekli'),
  password: passwordSchema,
})

// Email tekrar gönderme şeması
export const resendEmailSchema = z.object({
  email: emailSchema
})

// Tip çıkarımları (TypeScript için)
export type SignupData = z.infer<typeof signupSchema>
export type LoginData = z.infer<typeof loginSchema>
export type CheckUsernameData = z.infer<typeof checkUsernameSchema>
export type VerifyEmailData = z.infer<typeof verifyEmailSchema>
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>
export type ResetPasswordApiData = z.infer<typeof resetPasswordApiSchema>
export type ResendEmailData = z.infer<typeof resendEmailSchema> 