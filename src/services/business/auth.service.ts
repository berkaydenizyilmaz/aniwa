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
import { logInfo, logError } from '@/services/business/logger.service'
import { AUTH, USER_ROLES } from '@/constants'
import { generateUserSlug } from '@/lib/utils'
import { prisma } from '@/lib/db/prisma'
import { randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'
import type { CreateUserParams, UserWithSettings, ServiceResult } from '@/types'

// Kullanıcı girişi
export async function loginUser(
  username: string,
  password: string
): Promise<ServiceResult<UserWithSettings | null>> {
  try {
    const user = await findUserByUsernameWithSettings(username)
    if (!user || !user.passwordHash) {
      return { success: true, data: null }
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return { success: true, data: null }
    }

    return { success: true, data: user }

  } catch (error) {
    logError(
      'LOGIN_SYSTEM_ERROR',
      `Giriş sırasında sistem hatası: ${username}`,
      { username, error: error instanceof Error ? error.message : 'Bilinmeyen hata' }
    )
    return { success: false, error: 'Giriş işlemi gerçekleştirilemedi.' }
  }
}

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

    logInfo(
      'USER_REGISTERED',
      `Yeni kullanıcı kaydoldu: ${result.user.email}`,
      { email: result.user.email, username: result.user.username },
      result.user.id
    )

    const data: UserWithSettings = {
      ...result.user,
      userSettings: result.userSettings,
    }

    return { success: true, data }

  } catch (error) {
    logError(
      'USER_REGISTRATION_FAILED',
      `Kullanıcı kaydı başarısız: ${params.email}`,
      { 
        email: params.email,
        username: params.username,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      }
    )
    return { success: false, error: 'Kullanıcı kaydı gerçekleştirilemedi.' }
  }
}

// Şifre güncelleme
export async function updateUserPassword(
  userId: string,
  newPassword: string
): Promise<ServiceResult<void>> {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, AUTH.BCRYPT_SALT_ROUNDS)
    await updateUser(userId, { passwordHash: hashedPassword })
    return { success: true, data: undefined }
  } catch (error) {
    logError(
      'PASSWORD_UPDATE_FAILED',
      'Şifre güncelleme hatası',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata' },
      userId
    )
    return { success: false, error: 'Şifre güncellenemedi.' }
  }
}

// Şifre sıfırlama token oluştur
export async function createPasswordResetToken(
  email: string,
  baseUrl: string
): Promise<ServiceResult<{ token: string }>> {
  try {
    // İş kuralı: Kullanıcı kontrolü
    const user = await findUserByEmail(email)
    if (!user) {
      return { success: false, error: 'Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı.' }
    }

    await deleteVerificationTokensByEmailAndType(
      email, 
      AUTH.VERIFICATION_TOKEN_TYPES.PASSWORD_RESET
    )

    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + AUTH.PASSWORD_RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000)

    await createVerificationToken({
      token,
      email,
      type: AUTH.VERIFICATION_TOKEN_TYPES.PASSWORD_RESET,
      expiresAt
    })

    const resetUrl = `${baseUrl}/sifre-sifirlama?token=${token}`
    const emailResult = await sendPasswordResetEmail({
      to: email,
      username: user.username || user.email.split('@')[0],
      resetUrl
    })

    if (!emailResult.success) {
      await deleteVerificationTokenByToken(token)
      return { success: false, error: 'Şifre sıfırlama e-postası gönderilemedi.' }
    }

    return { success: true, data: { token } }

  } catch (error) {
    logError(
      'PASSWORD_RESET_REQUEST_FAILED',
      `Şifre sıfırlama token oluşturma hatası: ${email}`,
      { email, error: error instanceof Error ? error.message : 'Bilinmeyen hata' }
    )
    return { success: false, error: 'Şifre sıfırlama işlemi başlatılamadı.' }
  }
}

// Token doğrula
export async function verifyPasswordResetToken(
  token: string
): Promise<ServiceResult<{ email: string }>> {
  try {
    // İş kuralı: Token kontrolü
    const verificationToken = await findVerificationTokenByToken(token)

    if (!verificationToken || 
        verificationToken.type !== AUTH.VERIFICATION_TOKEN_TYPES.PASSWORD_RESET ||
        verificationToken.expiresAt < new Date()) {
      return { success: false, error: 'Geçersiz veya süresi dolmuş token.' }
    }

    return { success: true, data: { email: verificationToken.email } }

  } catch (error) {
    logError(
      'PASSWORD_RESET_TOKEN_VERIFICATION_FAILED',
      'Şifre sıfırlama token doğrulama hatası',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata' }
    )
    return { success: false, error: 'Token doğrulaması başarısız.' }
  }
}

// Şifre sıfırla
export async function resetPasswordWithToken(
  token: string,
  newPassword: string
): Promise<ServiceResult<void>> {
  try {
    // İş kuralı: Token kontrolü
    const verificationToken = await findVerificationTokenByToken(token)

    if (!verificationToken || 
        verificationToken.type !== AUTH.VERIFICATION_TOKEN_TYPES.PASSWORD_RESET ||
        verificationToken.expiresAt < new Date()) {
      return { success: false, error: 'Geçersiz veya süresi dolmuş token.' }
    }

    // İş kuralı: Kullanıcı kontrolü
    const user = await findUserByEmail(verificationToken.email)
    if (!user) {
      return { success: false, error: 'Kullanıcı bulunamadı.' }
    }

    await prisma.$transaction(async (tx) => {
      const hashedPassword = await bcrypt.hash(newPassword, AUTH.BCRYPT_SALT_ROUNDS)
      await updateUser(user.id, { passwordHash: hashedPassword }, tx)
      await deleteVerificationTokenByToken(token, tx)
    })

    return { success: true, data: undefined }

  } catch (error) {
    logError(
      'PASSWORD_RESET_FAILED',
      'Şifre sıfırlama hatası',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata' }
    )
    return { success: false, error: 'Şifre sıfırlanamadı.' }
  }
} 