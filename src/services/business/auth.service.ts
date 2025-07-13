import { 
  createUser, 
  findUserByEmail, 
  findUserByUsername, 
  updateUser,
  findUserByUsernameWithSettings 
} from '@/services/db/user.db'
import { createUserSettings } from '@/services/db/user-settings.db'
import { 
  createVerificationToken, 
  findVerificationTokenByToken, 
  deleteVerificationTokenByToken, 
  deleteVerificationTokensByEmailAndType 
} from '@/services/db/verification-token.db'
import { sendPasswordResetEmail } from '@/services/api/email.service'
import { signupSchema, loginSchema } from '@/schemas/auth'
import { logInfo, logError } from '@/services/business/logger.service'
import { LOG_EVENTS, AUTH, USER_ROLES } from '@/constants'
import { generateUserSlug } from '@/lib/utils'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'
import { randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'
import type { ApiResponse, CreateUserParams, UserWithSettings } from '@/types'

// Kullanıcı girişi - Credential verification
export async function loginUser(
  username: string,
  password: string
): Promise<ApiResponse<UserWithSettings | null>> {
  try {
    // 1. Girdi validasyonu
    const validatedData = loginSchema.parse({ username, password })

    // 2. Kullanıcıyı bul
    const user = await findUserByUsernameWithSettings(validatedData.username)
    
    if (!user || !user.passwordHash) {
      return { success: true, data: null } // Güvenlik için false bilgi verme
    }

    // 3. Şifre kontrolü
    const isValid = await bcrypt.compare(validatedData.password, user.passwordHash)
    
    if (!isValid) {
      return { success: true, data: null }
    }

    return { success: true, data: user }

  } catch (error) {
    logError(LOG_EVENTS.AUTH_LOGIN_FAILED, 'Giriş işlemi hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      username: username
    })

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message
      }
    }

    return {
      success: false,
      error: 'Giriş işlemi gerçekleştirilemedi'
    }
  }
}

// Kullanıcı kaydı - Transaction ile user + settings oluştur
export async function registerUser(
  params: CreateUserParams
): Promise<ApiResponse<UserWithSettings>> {
  try {
    // 1. Girdi validasyonu
    const validatedParams = signupSchema.parse(params)
    const { email, password, username } = validatedParams

    // 2. Kullanıcı varlık kontrolü
    const existingUser = await findUserByEmail(email.toLowerCase())
    if (existingUser) {
      return { success: false, error: 'Bu email adresi zaten kullanımda' }
    }

    const existingUsername = await findUserByUsername(username)
    if (existingUsername) {
      return { success: false, error: 'Bu kullanıcı adı zaten kullanımda' }
    }

    // 3. Transaction ile kullanıcı + ayarları oluştur
    const uniqueSlug = generateUserSlug(username)
    const passwordHash = await bcrypt.hash(password, AUTH.BCRYPT_SALT_ROUNDS)

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

    // 4. Business log
    logInfo(LOG_EVENTS.AUTH_SIGNUP_SUCCESS, 'Yeni kullanıcı kaydı tamamlandı', {
      userId: result.user.id,
      email: result.user.email,
      username: result.user.username
    }, result.user.id)

    // 5. Başarılı yanıt
    const data: UserWithSettings = {
      ...result.user,
      userSettings: result.userSettings,
    }

    return { success: true, data }

  } catch (error) {
    logError(LOG_EVENTS.AUTH_SIGNUP_FAILED, 'Kullanıcı kaydı hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      email: params.email
    })

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message
      }
    }

    return {
      success: false,
      error: 'Kullanıcı kaydı gerçekleştirilemedi'
    }
  }
}

// Şifre güncelleme business logic
export async function updateUserPassword(
  userId: string,
  newPassword: string
): Promise<ApiResponse<void>> {
  try {
    // 1. Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(newPassword, AUTH.BCRYPT_SALT_ROUNDS)

    // 2. Kullanıcıyı güncelle
    await updateUser(userId, { passwordHash: hashedPassword })

    return { success: true, data: undefined }

  } catch (error) {
    logError(LOG_EVENTS.AUTH_PASSWORD_RESET_FAILED, 'Şifre güncelleme hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      userId
    })

    return {
      success: false,
      error: 'Şifre güncellenemedi'
    }
  }
} 

// Şifre sıfırlama token'ı oluştur ve email gönder
export async function createPasswordResetToken(
  email: string,
  baseUrl: string
): Promise<ApiResponse<{ token: string }>> {
  try {
    // 1. Email validasyonu
    const validatedEmail = z.string().email().parse(email)

    // 2. Kullanıcının varlığını kontrol et
    const user = await findUserByEmail(validatedEmail)
    
    if (!user) {
      return {
        success: false,
        error: 'Bu email adresi ile kayıtlı kullanıcı bulunamadı'
      }
    }

    // 3. Mevcut token'ları temizle
    await deleteVerificationTokensByEmailAndType(
      validatedEmail, 
      AUTH.VERIFICATION_TOKEN_TYPES.PASSWORD_RESET
    )

    // 4. Yeni token oluştur
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + AUTH.PASSWORD_RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000)

    await createVerificationToken({
      token,
      email: validatedEmail,
      type: AUTH.VERIFICATION_TOKEN_TYPES.PASSWORD_RESET,
      expiresAt
    })

    // 5. Email gönder
    const resetUrl = `${baseUrl}/sifre-sifirlama?token=${token}`
    const emailResult = await sendPasswordResetEmail({
      to: validatedEmail,
      username: user.username || user.email.split('@')[0],
      resetUrl
    })

    if (!emailResult.success) {
      // Email gönderilemezse token'ı sil
      await deleteVerificationTokenByToken(token)
      
      return {
        success: false,
        error: 'Şifre sıfırlama emaili gönderilemedi'
      }
    }

    return {
      success: true,
      data: { token }
    }

  } catch (error) {
    logError(LOG_EVENTS.AUTH_PASSWORD_RESET_FAILED, 'Şifre sıfırlama token oluşturma hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      email
    })

    return {
      success: false,
      error: 'Şifre sıfırlama işlemi başlatılamadı'
    }
  }
}

// Şifre sıfırlama token'ını doğrula
export async function verifyPasswordResetToken(
  token: string
): Promise<ApiResponse<{ email: string }>> {
  try {
    // Token'ı bul
    const verificationToken = await findVerificationTokenByToken(token)

    if (!verificationToken || 
        verificationToken.type !== AUTH.VERIFICATION_TOKEN_TYPES.PASSWORD_RESET ||
        verificationToken.expiresAt < new Date()) {
      return {
        success: false,
        error: 'Geçersiz veya süresi dolmuş token'
      }
    }

    return {
      success: true,
      data: { email: verificationToken.email }
    }

  } catch (error) {
    logError(LOG_EVENTS.AUTH_PASSWORD_RESET_FAILED, 'Şifre sıfırlama token doğrulama hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    })

    return {
      success: false,
      error: 'Token doğrulaması başarısız'
    }
  }
}

// Şifre sıfırlama token'ı ile şifreyi güncelle
export async function resetPasswordWithToken(
  token: string,
  newPassword: string
): Promise<ApiResponse<void>> {
  try {
    // 1. Token'ı bul ve doğrula
    const verificationToken = await findVerificationTokenByToken(token)

    if (!verificationToken || 
        verificationToken.type !== AUTH.VERIFICATION_TOKEN_TYPES.PASSWORD_RESET ||
        verificationToken.expiresAt < new Date()) {
      return {
        success: false,
        error: 'Geçersiz veya süresi dolmuş token'
      }
    }

    // 2. Kullanıcıyı bul
    const user = await findUserByEmail(verificationToken.email)
    
    if (!user) {
      return {
        success: false,
        error: 'Kullanıcı bulunamadı'
      }
    }

    // 3. Transaction ile şifre güncelle ve token'ı sil
    await prisma.$transaction(async (tx) => {
      // Şifreyi güncelle
      const hashedPassword = await bcrypt.hash(newPassword, AUTH.BCRYPT_SALT_ROUNDS)
      await updateUser(user.id, { passwordHash: hashedPassword }, tx)

      // Token'ı sil
      await deleteVerificationTokenByToken(token, tx)
    })

    return { success: true, data: undefined }

  } catch (error) {
    logError(LOG_EVENTS.AUTH_PASSWORD_RESET_FAILED, 'Şifre sıfırlama hatası', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    })

    return {
      success: false,
      error: 'Şifre sıfırlanamadı'
    }
  }
} 