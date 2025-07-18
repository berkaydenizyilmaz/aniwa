// Auth API istek/yanıt tipleri

import { RegisterInput, LoginInput } from '@/lib/schemas/auth.schema';

// Register API yanıtı
export interface RegisterResponse {
  id: string;
  username: string;
  email: string;
}

// Login API yanıtı
export interface LoginResponse {
  id: string;
  username: string;
  email: string;
}

// Auth API istek tipleri
export type RegisterRequest = RegisterInput;
export type LoginRequest = LoginInput; 