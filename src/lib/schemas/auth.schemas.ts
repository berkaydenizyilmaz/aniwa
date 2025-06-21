// Aniwa Projesi - Auth Zod Schemas
// Bu dosya kimlik doğrulama ile ilgili tüm validasyon şemalarını içerir

import { z } from 'zod'
import {
  USERNAME_REGEX,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  BIO_MAX_LENGTH,
  TOKEN_MIN_LENGTH,
  EMAIL_MIN_LENGTH,
} from '../constants/auth'
import {
  EMAIL_REGEX,
  THEME_PREFERENCES,
  DEFAULT_THEME,
  LANGUAGE_PREFERENCES,
  DEFAULT_LANGUAGE,
} from '../constants/app'

// Email şeması
export const emailSchema = z
  .string()
  .min(EMAIL_MIN_LENGTH, 'Email adresi gerekli')
  .regex(EMAIL_REGEX, 'Geçerli bir email adresi giriniz')
  .toLowerCase()

// Username şeması
export const usernameSchema = z
  .string()
  .min(USERNAME_MIN_LENGTH, `Kullanıcı adı en az ${USERNAME_MIN_LENGTH} karakter olmalıdır`)
  .max(USERNAME_MAX_LENGTH, `Kullanıcı adı en fazla ${USERNAME_MAX_LENGTH} karakter olmalıdır`)
  .regex(USERNAME_REGEX, 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir')

// Password şeması
export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Şifre en az ${PASSWORD_MIN_LENGTH} karakter olmalıdır`)
  .max(PASSWORD_MAX_LENGTH, `Şifre en fazla ${PASSWORD_MAX_LENGTH} karakter olmalıdır`)



// Bio şeması
export const bioSchema = z
  .string()
  .max(BIO_MAX_LENGTH, `Biyografi en fazla ${BIO_MAX_LENGTH} karakter olmalıdır`)
  .trim()
  .optional()

// URL şeması (profil resimleri için)
export const urlSchema = z
  .string()
  .url('Geçerli bir URL giriniz')
  .optional()

// Signup şeması
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema, // Zorunlu
})

// Login şeması
export const loginSchema = z.object({
  username: usernameSchema,
  password: z.string().min(PASSWORD_MIN_LENGTH, 'Şifre gerekli'),
})

// Profil güncelleme şeması
export const updateProfileSchema = z.object({
  username: usernameSchema.optional(),
  bio: bioSchema,
  profilePicture: urlSchema,
  profileBanner: urlSchema,
})

// Şifre güncelleme şeması
export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(PASSWORD_MIN_LENGTH, 'Mevcut şifre gerekli'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(PASSWORD_MIN_LENGTH, 'Şifre onayı gerekli'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
})

// Kullanıcı ayarları şeması
export const userSettingsSchema = z.object({
  themePreference: z.enum(THEME_PREFERENCES).default(DEFAULT_THEME),
  languagePreference: z.enum(LANGUAGE_PREFERENCES).default(DEFAULT_LANGUAGE),
  notificationPreferences: z.record(z.boolean()).optional(),
  privacySettings: z.record(z.union([z.string(), z.boolean(), z.number()])).optional(),
})

// Email doğrulama şeması
export const verifyEmailSchema = z.object({
  token: z.string().min(TOKEN_MIN_LENGTH, 'Doğrulama kodu gerekli'),
})

// Şifre sıfırlama şeması
export const resetPasswordSchema = z.object({
  email: emailSchema,
})

// Şifre sıfırlama onay şeması
export const confirmResetPasswordSchema = z.object({
  token: z.string().min(TOKEN_MIN_LENGTH, 'Sıfırlama kodu gerekli'),
  password: passwordSchema,
  confirmPassword: z.string().min(PASSWORD_MIN_LENGTH, 'Şifre onayı gerekli'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
})

// Tip çıkarımları (TypeScript için)
export type SignupData = z.infer<typeof signupSchema>
export type LoginData = z.infer<typeof loginSchema>
export type UpdateProfileData = z.infer<typeof updateProfileSchema>
export type UpdatePasswordData = z.infer<typeof updatePasswordSchema>
export type UserSettingsData = z.infer<typeof userSettingsSchema>
export type VerifyEmailData = z.infer<typeof verifyEmailSchema>
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>
export type ConfirmResetPasswordData = z.infer<typeof confirmResetPasswordSchema> 