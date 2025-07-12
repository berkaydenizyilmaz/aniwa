// Bu dosya kullanıcı CRUD işlemlerini yönetir

import { prisma } from '@/lib/db/prisma'
import { USER_ROLES, BCRYPT_SALT_ROUNDS } from '@/constants/auth'
import { generateUserSlug } from '@/lib/utils'
import { Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { 
  signupSchema, 
  emailSchema, 
  usernameSchema, 
  userIdSchema,
  userUpdateSchema,
  passwordSchema
} from '@/lib/schemas/auth.schemas'
import type { ApiResponse } from '@/types/api'
import type { 
  CreateUserParams, 
  UserWithSettings,
  UpdateUserParams
} from '@/types/auth'

// Kullanıcı oluştur (Transaction ile settings de oluştur)
export async function createUser(params: CreateUserParams): Promise<ApiResponse<UserWithSettings>> {
  try {
    // 1. Girdi validasyonu
    const validatedParams = signupSchema.parse(params)
    const { email, password, username } = validatedParams

    // 2. Guard clauses
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return { success: false, error: 'Bu email adresi zaten kullanımda' }
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username }
    })

    if (existingUsername) {
      return { success: false, error: 'Bu kullanıcı adı zaten kullanımda' }
    }

    // 3. Ana işlem - Transaction ile kullanıcı + ayarları oluştur
    const uniqueSlug = generateUserSlug(username)
    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          passwordHash,
          username,
          slug: uniqueSlug,
          roles: [USER_ROLES.USER],
        }
      })

      const userSettings = await tx.userProfileSettings.create({
        data: {
          userId: user.id,
        }
      })

      return { user, userSettings }
    })

    // 4. Başarılı yanıt
    const data: UserWithSettings = {
      ...result.user,
      userSettings: result.userSettings,
    }

    return { success: true, data }

  } catch {
    return { 
      success: false, 
      error: 'Kullanıcı kaydı gerçekleştirilemedi'
    }
  }
}

// ID ile kullanıcı bul
export async function findUserById(userId: string): Promise<ApiResponse<UserWithSettings | null>> {
  try {
    const validatedUserId = userIdSchema.parse(userId)

    const user = await prisma.user.findUnique({
      where: { id: validatedUserId },
      include: { userSettings: true }
    })

    return { success: true, data: user}
  } catch {
    return { success: false, error: 'Kullanıcı bulunamadı' }
  }
}

// Email ile kullanıcı bul (Auth için önemli)
export async function findUserByEmail(email: string): Promise<ApiResponse<UserWithSettings | null>> {
  try {
    const validatedEmail = emailSchema.parse(email)

    const user = await prisma.user.findUnique({
      where: { email: validatedEmail.toLowerCase() },
      include: { userSettings: true }
    })

    return { success: true, data: user }
  } catch {
    return { success: false, error: 'Email ile kullanıcı bulunamadı' }
  }
}

// Username ile kullanıcı bul (Auth için önemli)
export async function findUserByUsername(username: string): Promise<ApiResponse<UserWithSettings | null>> {
  try {
    const validatedUsername = usernameSchema.parse(username)

    const user = await prisma.user.findUnique({
      where: { username: validatedUsername },
      include: { userSettings: true }
    })

    return { success: true, data: user }
  } catch {
    return { success: false, error: 'Username ile kullanıcı bulunamadı' }
  }
}

// Kullanıcı güncelle
export async function updateUser(userId: string, params: UpdateUserParams): Promise<ApiResponse<UserWithSettings>> {
  try {
    const validatedUserId = userIdSchema.parse(userId)
    const validatedParams = userUpdateSchema.parse(params)

    const user = await prisma.user.update({
      where: { id: validatedUserId },
      data: validatedParams,
      include: { userSettings: true }
    })

    return { success: true, data: user }
  } catch {
    return { success: false, error: 'Kullanıcı güncellenemedi' }
  }
}

// Kullanıcı sil
export async function deleteUser(userId: string): Promise<ApiResponse<void>> {
  try {
    const validatedUserId = userIdSchema.parse(userId)

    await prisma.user.delete({
      where: { id: validatedUserId }
    })

    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Kullanıcı silinemedi' }
  }
}

// Kullanıcı şifresini güncelle
export async function updatePassword(userId: string, newPassword: string): Promise<ApiResponse<void>> {
  try {
    const validatedUserId = userIdSchema.parse(userId)
    const validatedPassword = passwordSchema.parse(newPassword)

    const hashedPassword = await bcrypt.hash(validatedPassword, BCRYPT_SALT_ROUNDS)

    await prisma.user.update({
      where: { id: validatedUserId },
      data: { passwordHash: hashedPassword }
    })

    return { success: true, data: undefined }
  } catch {
    return { success: false, error: 'Şifre güncellenemedi' }
  }
}

// Login credentials doğrula
export async function verifyCredentials(email: string, password: string): Promise<ApiResponse<UserWithSettings | null>> {
  try {
    const user = await findUserByEmail(email)
    
    if (!user.success || !user.data || !user.data.passwordHash) {
      return { success: true, data: null } // Güvenlik için false bilgi verme
    }

    const isValid = await bcrypt.compare(password, user.data.passwordHash)
    
    if (!isValid) {
      return { success: true, data: null }
    }

    return { success: true, data: user.data }
  } catch {
    return { success: false, error: 'Giriş doğrulaması yapılamadı' }
  }
}

// Generic CRUD operations
export async function findUsers(
  where?: Prisma.UserWhereInput,
  take?: number,
  skip?: number
): Promise<ApiResponse<UserWithSettings[]>> {
  try {
    const users = await prisma.user.findMany({
      where,
      take,
      skip,
      include: { userSettings: true }
    })

    return { success: true, data: users }
  } catch {
    return { success: false, error: 'Kullanıcılar listelenemedi' }
  }
}

// Kullanıcı sayısını hesapla
export async function countUsers(where?: Prisma.UserWhereInput): Promise<ApiResponse<number>> {
  try {
    const count = await prisma.user.count({ where })
    return { success: true, data: count }
  } catch {
    return { success: false, error: 'Kullanıcı sayısı hesaplanamadı' }
  }
}

// Kullanıcı varlığını kontrol et
export async function userExists(userId: string): Promise<ApiResponse<boolean>> {
  try {
    const validatedUserId = userIdSchema.parse(userId)
    const count = await prisma.user.count({
      where: { id: validatedUserId }
    })
    return { success: true, data: count > 0 }
  } catch {
    return { success: false, error: 'Kullanıcı varlığı kontrol edilemedi' }
  }
} 