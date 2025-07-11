// Auth Tipleri
// Bu dosya kimlik doğrulama ile ilgili tüm tip tanımlarını içerir

import { User, UserProfileSettings, UserRole } from "@prisma/client";

// Kullanıcı ile ilişkili ayarları içeren tip
export type UserWithSettings = User & {
  userSettings: UserProfileSettings | null;
};

// Kullanıcı oluşturma parametreleri
export interface CreateUserParams {
  email: string;
  password: string;
  username: string;
  role?: UserRole;
}

// Kullanıcı güncelleme parametreleri
export interface UpdateUserParams {
  email?: string;
  username?: string;
  bio?: string;
  profilePicture?: string;
  profileBanner?: string;
  image?: string;
}

// Giriş parametreleri
export interface LoginParams {
  email: string;
  password: string;
}

// Kayıt parametreleri
export interface SignupParams {
  email: string;
  password: string;
  username: string;
}

// Şifre sıfırlama parametreleri
export interface PasswordResetParams {
  email: string;
}

// Şifre güncelleme parametreleri
export interface PasswordUpdateParams {
  token: string;
  newPassword: string;
}

// Username kontrol parametreleri
export interface UsernameCheckParams {
  username: string;
}

// NextAuth session user tipi
export interface SessionUser {
  id: string;
  email: string;
  username: string;
  image?: string;
  roles: UserRole[];
}

// ---- Hook dönüş tipleri ----

// useAuth hook'u için dönüş tipi
export interface UseAuthReturn {
  user: SessionUser | null
  isLoading: boolean
  isAuthenticated: boolean
  hasRole: (role: UserRole) => boolean
  hasAnyRole: (roles: UserRole[]) => boolean
  requireRole: (role: UserRole) => boolean
  requireAnyRole: (roles: UserRole[]) => boolean
}

// ---- API Response tipleri ----

// Giriş işlemi sonucu
export interface LoginResult {
  user?: SessionUser
  signInResponse?: unknown // SignInResponse type is not imported, so using 'unknown' instead of 'any'
}

// Çıkış işlemi sonucu
export interface LogoutResult {
  redirectUrl?: string
}