// Auth iş mantığı katmanı

import bcrypt from 'bcryptjs';
import { 
  BusinessError, 
  ConflictError, 
  UnauthorizedError
} from '@/lib/errors';
import { createUser, findUserByUsername, findUserByEmail, findUserBySlug, updateUser } from '@/lib/services/db/user.db';
import { createUserSettings } from '@/lib/services/db/userProfileSettings.db';
import { createVerificationToken, findVerificationTokenByToken, deleteVerificationTokenByToken } from '@/lib/services/db/verificationToken.db';
import { prisma } from '@/lib/prisma';
import { createSlug } from '@/lib/utils/slug.utils';
import { sendPasswordResetEmail } from '@/lib/utils/email.utils';
import { logger } from '@/lib/utils/logger';
import { EVENTS } from '@/lib/constants/events.constants';
import { ApiResponse } from '@/lib/types/api';
import { RegisterResponse, RegisterRequest } from '@/lib/types/api/auth.api';
import { AUTH } from '@/lib/constants/auth.constants';
import crypto from 'crypto';

// Kullanıcı kaydı
export async function registerUser(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
  try {
    // Username benzersizlik kontrolü
    const existingUser = await findUserByUsername(data.username);
    if (existingUser) {
      throw new ConflictError('Bu kullanıcı adı zaten kullanımda');
    }

    // Email benzersizlik kontrolü
    const existingEmail = await findUserByEmail(data.email);
    if (existingEmail) {
      throw new ConflictError('Bu e-posta adresi zaten kullanımda');
    }

    // Slug benzersizlik kontrolü
    const slug = createSlug(data.username);
    const existingSlug = await findUserBySlug(slug);
    if (existingSlug) {
      throw new ConflictError('Bu kullanıcı adı zaten kullanımda');
    }

    // Şifreyi hashle
    const passwordHash = await bcrypt.hash(data.password, AUTH.BCRYPT_SALT_ROUNDS);

    // Transaction ile kullanıcı ve ayarları oluştur
    const result = await prisma.$transaction(async (tx) => {
      // Kullanıcı oluştur
      const user = await createUser({
        username: data.username,
        email: data.email,
        passwordHash,
        slug,
      }, tx);

      // Varsayılan kullanıcı ayarlarını oluştur
      await createUserSettings({
        user: { connect: { id: user.id } },
      }, tx);

      return user;
    });

    // Başarılı kayıt logu
    await logger.info(
      EVENTS.AUTH.USER_REGISTERED,
      'Kullanıcı başarıyla kayıt oldu',
      { userId: result.id, username: result.username, email: result.email }
    );

    return {
      success: true,
      data: {
        id: result.id,
        username: result.username,
        email: result.email
      }
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Kullanıcı kaydı sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata' }
    );
    
    throw new BusinessError('Kullanıcı kaydı başarısız');
  }
}

// Kullanıcı çıkışı (NextAuth ile entegre)
export async function logoutUser(): Promise<ApiResponse<void>> {
  try {
    return {
      success: true
    };
  } catch {
    throw new BusinessError('Çıkış başarısız');
  }
}

// Şifre sıfırlama isteği
export async function forgotPassword(email: string): Promise<ApiResponse<void>> {
  try {
    // Kullanıcıyı bul
    const user = await findUserByEmail(email);
    if (!user) {
      // Güvenlik için kullanıcı bulunamasa bile başarılı döner
      return { success: true };
    }

    // Rastgele token oluştur
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + AUTH.TOKEN_EXPIRES.PASSWORD_RESET);

    // Token'ı veritabanına kaydet
    await createVerificationToken({
      email,
      token,
      type: AUTH.TOKEN_TYPES.PASSWORD_RESET,
      expiresAt
    });

    // Email gönder
    const emailSent = await sendPasswordResetEmail(email, token, user.username);
    if (!emailSent) {
      // Email gönderimi başarısız logu
      await logger.error(
        EVENTS.SYSTEM.EMAIL_SEND_FAILED,
        'Şifre sıfırlama emaili gönderilemedi',
        { email, userId: user.id }
      );
      throw new BusinessError('Email gönderilemedi');
    }

    return { success: true };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Şifre sıfırlama isteği sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', email }
    );
    
    throw new BusinessError('Şifre sıfırlama isteği başarısız');
  }
}

// Şifre sıfırlama
export async function resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
  try {
    // Token'ı bul ve doğrula
    const verificationToken = await findVerificationTokenByToken(token);
    if (!verificationToken) {
      throw new UnauthorizedError('Geçersiz veya süresi dolmuş token');
    }

    if (verificationToken.type !== AUTH.TOKEN_TYPES.PASSWORD_RESET) {
      throw new UnauthorizedError('Geçersiz token tipi');
    }

    if (verificationToken.expiresAt < new Date()) {
      throw new UnauthorizedError('Token süresi dolmuş');
    }

    // Kullanıcıyı bul
    const user = await findUserByEmail(verificationToken.email);
    if (!user) {
      throw new UnauthorizedError('Kullanıcı bulunamadı');
    }

    // Yeni şifreyi hashle
    const passwordHash = await bcrypt.hash(newPassword, AUTH.BCRYPT_SALT_ROUNDS);

    // Transaction ile şifre güncelle ve token sil
    await prisma.$transaction(async (tx) => {
      // Şifreyi güncelle
      await updateUser({ id: user.id }, { passwordHash }, tx);

      // Token'ı sil
      await deleteVerificationTokenByToken(token, tx);
    });

    return { success: true };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.API_ERROR,
      'Şifre sıfırlama sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', token }
    );
    
    throw new BusinessError('Şifre sıfırlama başarısız');
  }
} 