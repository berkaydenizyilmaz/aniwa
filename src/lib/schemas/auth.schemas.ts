// Aniwa Projesi - Auth Zod Schemas
// Bu dosya kimlik doğrulama ile ilgili tüm validasyon şemalarını içerir

import { z } from 'zod'

// Temel validasyon kuralları
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/
const PASSWORD_MIN_LENGTH = 8

// Email şeması
export const emailSchema = z
  .string()
  .min(1, 'Email adresi gerekli')
  .regex(EMAIL_REGEX, 'Geçerli bir email adresi giriniz')
  .toLowerCase()

// Username şeması
export const usernameSchema = z
  .string()
  .min(3, 'Kullanıcı adı en az 3 karakter olmalıdır')
  .max(20, 'Kullanıcı adı en fazla 20 karakter olmalıdır')
  .regex(USERNAME_REGEX, 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir')

// Password şeması
export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Şifre en az ${PASSWORD_MIN_LENGTH} karakter olmalıdır`)
  .max(128, 'Şifre en fazla 128 karakter olmalıdır')

// Name şeması
export const nameSchema = z
  .string()
  .min(2, 'İsim en az 2 karakter olmalıdır')
  .max(50, 'İsim en fazla 50 karakter olmalıdır')
  .trim()

// Bio şeması
export const bioSchema = z
  .string()
  .max(500, 'Biyografi en fazla 500 karakter olmalıdır')
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
  username: usernameSchema.optional(),
  name: nameSchema.optional(),
})

// Login şeması
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Şifre gerekli'),
})

// Profil güncelleme şeması
export const updateProfileSchema = z.object({
  username: usernameSchema.optional(),
  name: nameSchema.optional(),
  bio: bioSchema,
  profilePicture: urlSchema,
  profileBanner: urlSchema,
})

// Şifre güncelleme şeması
export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Mevcut şifre gerekli'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'Şifre onayı gerekli'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
})

// Kullanıcı ayarları şeması
export const userSettingsSchema = z.object({
  themePreference: z.enum(['light', 'dark', 'system']).default('system'),
  languagePreference: z.enum(['tr']).default('tr'),
  notificationPreferences: z.record(z.boolean()).optional(),
  privacySettings: z.record(z.union([z.string(), z.boolean(), z.number()])).optional(),
})

// Email doğrulama şeması
export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Doğrulama kodu gerekli'),
})

// Şifre sıfırlama şeması
export const resetPasswordSchema = z.object({
  email: emailSchema,
})

// Şifre sıfırlama onay şeması
export const confirmResetPasswordSchema = z.object({
  token: z.string().min(1, 'Sıfırlama kodu gerekli'),
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Şifre onayı gerekli'),
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