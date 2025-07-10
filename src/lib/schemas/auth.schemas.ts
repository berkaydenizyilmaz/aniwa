// Aniwa Projesi - Auth Zod Schemas
// Bu dosya kimlik doğrulama ile ilgili tüm validasyon şemalarını içerir

import { z } from 'zod'
import {
  USERNAME_REGEX,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  TOKEN_MIN_LENGTH,
  EMAIL_MIN_LENGTH,
} from '../../constants/auth'

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



// Tip çıkarımları (TypeScript için)
export type SignupData = z.infer<typeof signupSchema>
export type LoginData = z.infer<typeof loginSchema>
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>
export type ResetPasswordApiData = z.infer<typeof resetPasswordApiSchema> 