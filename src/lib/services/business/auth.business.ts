// Auth iş mantığı katmanı

import bcrypt from 'bcryptjs';
import { 
  BusinessError, 
  ConflictError, 
  UnauthorizedError,
  DatabaseError
} from '@/lib/errors';
import { createUserDB, findUserByUsernameDB, findUserByEmailDB, findUserBySlugDB, updateUserDB } from '@/lib/services/db/user.db';
import { createUserSettingsDB } from '@/lib/services/db/userProfileSettings.db';
import { createVerificationTokenDB, findVerificationTokenByTokenDB, deleteVerificationTokenByTokenDB } from '@/lib/services/db/verificationToken.db';
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
export async function registerUserBusiness(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
  try {
    // Username benzersizlik kontrolü
    const existingUser = await findUserByUsernameDB(data.username);
    if (existingUser) {
      throw new ConflictError('Bu kullanıcı adı zaten kullanımda');
    }

    // Email benzersizlik kontrolü
    const existingEmail = await findUserByEmailDB(data.email);
    if (existingEmail) {
      throw new ConflictError('Bu e-posta adresi zaten kullanımda');
    }

    // Slug benzersizlik kontrolü
    const slug = createSlug(data.username);
    const existingSlug = await findUserBySlugDB(slug);
    if (existingSlug) {
      throw new ConflictError('Bu kullanıcı adı zaten kullanımda');
    }

    // Şifreyi hashle
    const passwordHash = await bcrypt.hash(data.password, AUTH.BCRYPT_SALT_ROUNDS);

    // Transaction ile kullanıcı ve ayarları oluştur
    const result = await prisma.$transaction(async (tx) => {
      // Kullanıcı oluştur
      const user = await createUserDB({
        username: data.username,
        email: data.email,
        passwordHash,
        slug,
      }, tx);

      // Varsayılan kullanıcı ayarlarını oluştur
      await createUserSettingsDB({
        user: { connect: { id: user.id } },
      }, tx);

      return user;
    });

    // Başarılı kayıt logu
    await logger.info(
      EVENTS.AUTH.USER_REGISTERED,
      'Kullanıcı başarıyla kayıt oldu',
      { username: result.username, email: result.email },
      result.id
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
    if (!(error instanceof BusinessError)) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Kullanıcı kaydı sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata' }
    );
    
    throw new BusinessError('Kullanıcı kaydı başarısız');
  }
}

// Şifre sıfırlama isteği
export async function forgotPasswordBusiness(email: string): Promise<ApiResponse<void>> {
  try {
    // Kullanıcıyı bul
    const user = await findUserByEmailDB(email);
    if (!user) {
      // Güvenlik için kullanıcı bulunamasa da başarılı döndür
      return { success: true };
    }

    // Yeni token oluştur
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 saat

    await createVerificationTokenDB({
      token,
      email,
      type: 'password-reset',
      expiresAt,
    });

    // E-posta gönder
    await sendPasswordResetEmail(email, token, user.username);

    // Başarılı istek logu
    await logger.info(
      EVENTS.AUTH.PASSWORD_RESET_REQUESTED,
      'Şifre sıfırlama isteği gönderildi',
      { email },
      user.id
    );

    return { success: true };
  } catch (error) {
    if (!(error instanceof BusinessError)) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Şifre sıfırlama isteği sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', email }
    );
    
    throw new BusinessError('Şifre sıfırlama isteği başarısız');
  }
}

// Şifre sıfırlama
export async function resetPasswordBusiness(token: string, newPassword: string): Promise<ApiResponse<void>> {
  try {
    // Token'ı bul ve kontrol et
    const verificationToken = await findVerificationTokenByTokenDB(token);
    if (!verificationToken || verificationToken.type !== 'password-reset') {
      throw new UnauthorizedError('Geçersiz veya süresi dolmuş token');
    }

    if (verificationToken.expiresAt && verificationToken.expiresAt < new Date()) {
      throw new UnauthorizedError('Token süresi dolmuş');
    }

    // Kullanıcıyı bul
    const user = await findUserByEmailDB(verificationToken.email);
    if (!user) {
      throw new UnauthorizedError('Kullanıcı bulunamadı');
    }

    // Yeni şifreyi hashle
    const passwordHash = await bcrypt.hash(newPassword, AUTH.BCRYPT_SALT_ROUNDS);

    // Şifreyi güncelle ve token'ı sil
    await prisma.$transaction(async (tx) => {
      await updateUserDB({ id: user.id }, { passwordHash }, tx);
      await deleteVerificationTokenByTokenDB(token);
    });

    // Başarılı sıfırlama logu
    await logger.info(
      EVENTS.AUTH.PASSWORD_RESET_COMPLETED,
      'Şifre başarıyla sıfırlandı',
      { email: user.email },
      user.id
    );

    return { success: true };
  } catch (error) {
    if (!(error instanceof BusinessError)) {
      // DB hatası zaten loglanmış, direkt fırlat
      throw error;
    }
    
    // Beklenmedik hata logu
    await logger.error(
      EVENTS.SYSTEM.BUSINESS_ERROR,
      'Şifre sıfırlama sırasında beklenmedik hata',
      { error: error instanceof Error ? error.message : 'Bilinmeyen hata', token }
    );
    
    throw new BusinessError('Şifre sıfırlama başarısız');
  }
} 