// Bu dosya kullanıcı işlemleri ile ilgili validasyon şemalarını içerir

import { z } from 'zod'
import { userIdSchema, emailSchema, usernameSchema } from './auth.schemas'

// Kullanıcı bulma şemaları
export const findUserByEmailSchema = z.object({
  email: emailSchema
})

export const findUserByUsernameSchema = z.object({
  username: usernameSchema
})

export const findUserByIdSchema = z.object({
  id: userIdSchema
})

// Kullanıcı güncelleme şemaları
export const updateEmailVerificationSchema = z.object({
  userId: userIdSchema,
  isVerified: z.boolean()
})

export const updateUserPasswordSchema = z.object({
  userId: userIdSchema,
  newPassword: z.string().min(8, 'Şifre en az 8 karakter olmalıdır')
})

// Tip çıkarımları
export type FindUserByEmailData = z.infer<typeof findUserByEmailSchema>
export type FindUserByUsernameData = z.infer<typeof findUserByUsernameSchema>
export type FindUserByIdData = z.infer<typeof findUserByIdSchema>
export type UpdateEmailVerificationData = z.infer<typeof updateEmailVerificationSchema>
export type UpdateUserPasswordData = z.infer<typeof updateUserPasswordSchema> 