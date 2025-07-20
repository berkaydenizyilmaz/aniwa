import { z } from 'zod';
import { AUTH } from '@/lib/constants/auth.constants';

// Kullanıcı kaydı şeması
export const registerSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  username: z.string()
    .min(AUTH.USERNAME.MIN_LENGTH, 'Kullanıcı adı gerekli')
    .max(AUTH.USERNAME.MAX_LENGTH, 'Kullanıcı adı çok uzun')
    .regex(AUTH.USERNAME.REGEX, 'Kullanıcı adı sadece harf ve rakam içerebilir'),
  password: z.string()
    .min(AUTH.PASSWORD.MIN_LENGTH, 'Şifre en az 6 karakter olmalı')
});

// Kullanıcı girişi şeması
export const loginSchema = z.object({
  username: z.string()
    .min(AUTH.USERNAME.MIN_LENGTH, 'Kullanıcı adı gerekli'),
  password: z.string()
    .min(AUTH.PASSWORD.MIN_LENGTH, `Şifre en az ${AUTH.PASSWORD.MIN_LENGTH} karakter olmalı`)
});

// Şifre sıfırlama isteği şeması
export const forgotPasswordSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin')
});

// Şifre sıfırlama şeması
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token gerekli'),
  password: z.string()
    .min(AUTH.PASSWORD.MIN_LENGTH, `Şifre en az ${AUTH.PASSWORD.MIN_LENGTH} karakter olmalı`),
  confirmPassword: z.string().min(1, 'Şifre tekrarı gerekli')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
});

// Tip tanımları
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>; 