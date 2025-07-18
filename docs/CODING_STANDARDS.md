# Aniwa - Coding Standards & Patterns Guide

Bu dosya Aniwa projesinin kod yazım standartlarını ve patternlerini tanımlar. Yeni özellik eklerken bu standartlara uygun kod yazılmalıdır.

## 📁 Dosya Organizasyonu

### Import Sırası
```typescript
// 1. External libraries
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// 2. Internal services (business → db → api)
import { registerUser } from '@/services/business/auth.service'
import { createUser } from '@/services/db/user.db'
import { sendEmail } from '@/services/api/email.service'

// 3. Utils, constants, schemas
import { withAuthRateLimit } from '@/lib/rate-limit/middleware'
import { AUTH_RATE_LIMIT_TYPES } from '@/constants'
import { signupSchema } from '@/schemas/auth'

// 4. Types (always last)
import type { ApiResponse, ServiceResult } from '@/types'
```

### Export Patterns
```typescript
// Named exports (preferred)
export async function createUser() {}
export const AUTH_CONSTANTS = {}

// Default exports (only for main entry points)
export default NextAuth(authOptions)

// Re-exports (index files)
export * from './auth'
export { AUTH_CONSTANTS } from './auth'
```

## 🏗️ API Endpoint Patterns

### Route Handler Structure
```typescript
// /src/app/api/auth/signup/route.ts

// Türkçe açıklama ile handler function
async function signupHandler(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ user: UserResponse }>>> {
  try {
    // 1. Request body parsing
    const body = await request.json()
    
    // 2. Zod validation
    const validation = signupSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Geçersiz veri formatı.',
          details: validation.error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      )
    }

    // 3. Business service call
    const result = await registerUser(validation.data)
    
    // 4. Error handling
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    // 5. Success response
    return NextResponse.json({
      success: true,
      message: 'İşlem başarılı!',
      data: { user: result.data }
    })

  } catch (error) {
    console.error('signupHandler hatası:', error)
    
    return NextResponse.json(
      { success: false, error: 'Beklenmedik bir hata oluştu.' },
      { status: 500 }
    )
  }
}

// Rate limit ile export
export const POST = withAuthRateLimit(AUTH_RATE_LIMIT_TYPES.SIGNUP, signupHandler)
```

### Error Response Format
```typescript
// Başarısız yanıt
{
  success: false,
  error: 'Türkçe hata mesajı',
  details?: Array<{ path: string, message: string }> // Validation errors için
}

// Başarılı yanıt
{
  success: true,
  message: 'İşlem başarılı!',
  data: { /* response data */ }
}
```

## 💼 Business Service Patterns

### Service Function Structure
```typescript
// /src/services/business/auth.service.ts

// Kullanıcı kaydı
export async function registerUser(
  params: CreateUserParams
): Promise<ServiceResult<UserWithSettings>> {
  try {
    const { email, password, username } = params

    // İş kuralı validasyonları
    const existingEmail = await findUserByEmail(email.toLowerCase())
    if (existingEmail) {
      return { success: false, error: 'Bu e-posta adresi zaten kullanımda.' }
    }

    const existingUsername = await findUserByUsername(username)
    if (existingUsername) {
      return { success: false, error: 'Bu kullanıcı adı zaten kullanımda.' }
    }

    // Ana iş mantığı
    const uniqueSlug = generateUserSlug(username)
    const passwordHash = await bcrypt.hash(password, AUTH.BCRYPT_SALT_ROUNDS)

    // Transaction kullanımı
    const result = await prisma.$transaction(async (tx) => {
      const user = await createUser({
        email: email.toLowerCase(),
        passwordHash,
        username,
        slug: uniqueSlug,
        roles: [USER_ROLES.USER],
      }, tx)

      const userSettings = await createUserSettings({
        user: { connect: { id: user.id } },
      }, tx)

      return { user, userSettings }
    })

    // Başarı loglaması
    logInfo({
      event: LOG_EVENTS.USER_REGISTERED,
      message: `Yeni kullanıcı kaydoldu: ${result.user.email}`,
      metadata: { email: result.user.email, username: result.user.username },
      userId: result.user.id
    })

    return { success: true, data: { ...result.user, userSettings: result.userSettings } }

  } catch (error) {
    // Hata loglaması
    logError({
      event: LOG_EVENTS.USER_REGISTRATION_FAILED,
      message: `Kullanıcı kaydı başarısız: ${params.email}`,
      metadata: { 
        email: params.email,
        username: params.username,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      }
    })
    return { success: false, error: 'Kullanıcı kaydı gerçekleştirilemedi.' }
  }
}
```

### ServiceResult Pattern
```typescript
// Her business function ServiceResult döner
type ServiceResult<T> = {
  success: true
  data: T
} | {
  success: false
  error: string
}

// Kullanım
const result = await registerUser(params)
if (!result.success) {
  return { success: false, error: result.error }
}
// result.data artık güvenli şekilde kullanılabilir
```

## 🗄️ Database CRUD Patterns

### Repository Function Structure
```typescript
// /src/services/db/user.db.ts

// Yeni kullanıcı oluştur
export async function createUser(
  userData: Prisma.UserCreateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<User> {
  return client.user.create({ data: userData })
}

// ID ile kullanıcı bul
export async function findUserById(
  id: string,
  client: PrismaClientOrTransaction = prisma
): Promise<User | null> {
  return client.user.findUnique({ where: { id } })
}

// Admin paneli için kullanıcıları listele
export async function findUsersForAdmin(
  params: {
    page?: number
    limit?: number
    sort?: string
    search?: string
  },
  client: PrismaClientOrTransaction = prisma
) {
  const { page = 1, limit = 10, sort = 'createdAt-desc', search } = params

  const [sortField, sortOrder] = sort.split('-') as [string, 'asc' | 'desc']

  const where: Prisma.UserWhereInput = search
    ? {
        OR: [
          { username: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {}

  return client.user.findMany({
    where,
    take: limit,
    skip: (page - 1) * limit,
    orderBy: { [sortField]: sortOrder },
    include: { userSettings: true },
  })
}
```

### Transaction Support
```typescript
// Her DB function transaction desteği olmalı
export async function updateUser(
  id: string,
  userData: Prisma.UserUpdateInput,
  client: PrismaClientOrTransaction = prisma
): Promise<User> {
  return client.user.update({
    where: { id },
    data: userData,
  })
}

// Kullanım
await prisma.$transaction(async (tx) => {
  await updateUser(userId, userData, tx)
  await createLog(logData, tx)
})
```

## 🎯 Type Definition Patterns

### Interface Naming
```typescript
// /src/types/auth.ts

// Params interfaces (işlem parametreleri)
export interface LoginParams {
  username: string
  password: string
}

export interface CreateUserParams {
  email: string
  password: string
  username: string
}

// Response interfaces (API yanıtları)
export interface UserResponse {
  id: string
  email: string
  username: string
}

// Extended types (ilişkili veriler)
export interface UserWithSettings extends User {
  userSettings: UserProfileSettings | null
}

// Hook return types
export interface UseAuthReturn {
  user: SessionUser | null
  isLoading: boolean
  login: (params: LoginParams) => Promise<AuthResult>
  logout: () => Promise<void>
}
```

### Generic Types
```typescript
// API response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  error?: string
  data?: T
  details?: Array<{ path: string, message: string }>
}

// Paginated response
export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Service result pattern
export type ServiceResult<T> = {
  success: true
  data: T
} | {
  success: false
  error: string
}
```

## 📋 Constants Structure

### Grouping Pattern
```typescript
// /src/constants/auth.ts

export const AUTH = {
  // Session ayarları
  SESSION_MAX_AGE: 30 * 24 * 60 * 60, // 30 gün (saniye)
  JWT_MAX_AGE: 30 * 24 * 60 * 60, // 30 gün (saniye)

  // Şifre güvenliği
  BCRYPT_SALT_ROUNDS: 12,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,

  // Username kuralları
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 20,
  USERNAME_REGEX: /^[a-zA-Z0-9_]+$/,
  USERNAME_CHANGE_LIMIT_DAYS: 30,

  // Token süreleri
  PASSWORD_RESET_TOKEN_EXPIRY_HOURS: 1,

  // OAuth sağlayıcıları
  OAUTH_PROVIDERS: {
    GOOGLE: 'google',
  } as const,

  // Verification token türleri
  VERIFICATION_TOKEN_TYPES: {
    PASSWORD_RESET: 'PASSWORD_RESET',
  } as const,
} as const
```

### Re-export Pattern
```typescript
// /src/constants/index.ts
export * from './core'
export * from './auth'
export * from './logging'
export * from './rate-limits'
export * from './admin'
```

## ✅ Validation Schema Patterns

### Zod Schema Structure
```typescript
// /src/schemas/auth.ts

// Temel şemalar
const emailSchema = z.string()
  .email('Geçerli bir e-posta adresi giriniz.')
  .toLowerCase()

const passwordSchema = z.string()
  .min(AUTH.MIN_PASSWORD_LENGTH, `Şifre en az ${AUTH.MIN_PASSWORD_LENGTH} karakter olmalıdır.`)
  .max(AUTH.MAX_PASSWORD_LENGTH, `Şifre en fazla ${AUTH.MAX_PASSWORD_LENGTH} karakter olmalıdır.`)

const usernameSchema = z.string()
  .min(AUTH.MIN_USERNAME_LENGTH, `Kullanıcı adı en az ${AUTH.MIN_USERNAME_LENGTH} karakter olmalıdır.`)
  .max(AUTH.MAX_USERNAME_LENGTH, `Kullanıcı adı en fazla ${AUTH.MAX_USERNAME_LENGTH} karakter olmalıdır.`)
  .regex(AUTH.USERNAME_REGEX, 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir.')

// Composite şemalar
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
  confirmPassword: passwordSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor.',
  path: ['confirmPassword'],
})

export const loginSchema = z.object({
  username: z.string().min(1, 'Kullanıcı adı gereklidir.'),
  password: z.string().min(1, 'Şifre gereklidir.'),
})

// Type inference
export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>
```

### Error Message Standards
```typescript
// Türkçe hata mesajları
const errorMessages = {
  required: 'Bu alan zorunludur.',
  email: 'Geçerli bir e-posta adresi giriniz.',
  minLength: (min: number) => `En az ${min} karakter olmalıdır.`,
  maxLength: (max: number) => `En fazla ${max} karakter olmalıdır.`,
  passwordMismatch: 'Şifreler eşleşmiyor.',
  invalidFormat: 'Geçersiz format.',
}
```

## 🏷️ Naming Conventions

### Variables & Functions
```typescript
// camelCase
const userName = 'john_doe'
const isUserActive = true
const getUserById = () => {}
const handleFormSubmit = () => {}

// Boolean variables
const isLoading = false
const hasPermission = true
const canEdit = false
const shouldUpdate = true
```

### Constants
```typescript
// UPPER_SNAKE_CASE for constants
const MAX_RETRY_COUNT = 3
const API_BASE_URL = 'https://api.example.com'
const DEFAULT_PAGE_SIZE = 10

// Object constants with nested structure
const AUTH_CONSTANTS = {
  SESSION_MAX_AGE: 30 * 24 * 60 * 60,
  BCRYPT_SALT_ROUNDS: 12,
} as const
```

### Types & Interfaces
```typescript
// PascalCase
interface UserProfile {}
type ServiceResult<T> = {}
enum UserRole {}

// Suffix patterns
interface CreateUserParams {} // Parameters
interface UserResponse {} // API responses
interface UseAuthReturn {} // Hook returns
type UserWithSettings = {} // Extended types
```

### Files & Directories
```typescript
// kebab-case for files
user-profile.component.tsx
auth-service.ts
password-reset.schema.ts

// camelCase for directories
src/components/userProfile/
src/services/businessLogic/
```

## 💬 Comment Standards

### Function Comments
```typescript
// Kullanıcı girişi
export async function loginUser(params: LoginParams) {}

// Şifre sıfırlama token oluştur
export async function createPasswordResetToken(params: CreatePasswordResetTokenParams) {}

// Admin paneli için kullanıcıları listele (arama, sıralama, sayfalama ile)
export async function findUsersForAdmin(params: AdminUserSearchParams) {}
```

### Inline Comments
```typescript
async function signupHandler(request: NextRequest) {
  try {
    // 1. Request body parsing
    const body = await request.json()
    
    // 2. Zod ile veri formatının validasyonu
    const validation = signupSchema.safeParse(body)
    
    // 3. Business service ile kullanıcı oluşturma
    const result = await registerUser(validation.data)
    
    // 4. Başarılı yanıt gönder
    return NextResponse.json({ success: true, data: result.data })
    
  } catch (error) {
    // Hata loglaması ve yanıt
    console.error('signupHandler hatası:', error)
    return NextResponse.json({ success: false, error: 'Beklenmedik hata' })
  }
}
```

### Section Comments
```typescript
export const AUTH = {
  // Session ayarları
  SESSION_MAX_AGE: 30 * 24 * 60 * 60,
  JWT_MAX_AGE: 30 * 24 * 60 * 60,

  // Şifre güvenliği
  BCRYPT_SALT_ROUNDS: 12,
  MIN_PASSWORD_LENGTH: 8,

  // Username kuralları
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 20,
} as const
```

## 🔄 Error Handling Patterns

### Try-Catch Structure
```typescript
export async function businessFunction(params: Params): Promise<ServiceResult<Data>> {
  try {
    // İş kuralı validasyonları
    const validation = await validateBusinessRules(params)
    if (!validation.success) {
      return { success: false, error: validation.error }
    }

    // Ana iş mantığı
    const result = await performBusinessLogic(params)
    
    // Başarı loglaması
    logInfo({
      event: LOG_EVENTS.OPERATION_SUCCESS,
      message: 'İşlem başarılı',
      metadata: { /* relevant data */ }
    })

    return { success: true, data: result }

  } catch (error) {
    // Hata loglaması
    logError({
      event: LOG_EVENTS.OPERATION_FAILED,
      message: 'İşlem başarısız',
      metadata: { error: error instanceof Error ? error.message : 'Bilinmeyen hata' }
    })
    
    return { success: false, error: 'İşlem gerçekleştirilemedi.' }
  }
}
```

### Validation Error Handling
```typescript
// Zod validation
const validation = schema.safeParse(data)
if (!validation.success) {
  return {
    success: false,
    error: 'Geçersiz veri formatı.',
    details: validation.error.errors.map(err => ({
      path: err.path.join('.'),
      message: err.message
    }))
  }
}

// Business rule validation
if (existingUser) {
  return { success: false, error: 'Bu kullanıcı zaten mevcut.' }
}
```

## 📦 Export/Import Best Practices

### Barrel Exports
```typescript
// /src/services/index.ts
export * from './business'
export * from './db'
export * from './api'

// /src/types/index.ts
export * from './auth'
export * from './user'
export * from './common'
```

### Selective Imports
```typescript
// Preferred - specific imports
import { loginUser, registerUser } from '@/services/business/auth.service'
import { AUTH_CONSTANTS, LOG_EVENTS } from '@/constants'

// Avoid - namespace imports (unless necessary)
import * as AuthService from '@/services/business/auth.service'
```

Bu standartlara uygun kod yazarak projenin tutarlılığını ve okunabilirliğini koruyun.
