// Auth iş mantığı katmanı

import bcrypt from 'bcryptjs';
import { 
  BusinessError, 
  ConflictError, 
  UnauthorizedError
} from '@/lib/errors';
import { createUser, findUserByUsername, findUserByEmail, findUserBySlug, updateUserLastLogin } from '@/lib/services/db/user.db';
import { createUserSettings } from '@/lib/services/db/userProfileSettings.db';
import { createSlug } from '@/lib/utils/slug.utils';
import { RegisterInput, LoginInput } from '@/lib/schemas/auth.schema';
import { ApiResponse } from '@/lib/types/api';
import { RegisterResponse, LoginResponse } from '@/lib/types/api/auth.api';
import { AUTH } from '@/lib/constants/auth.constants';

// Kullanıcı kaydı
export async function registerUser(data: RegisterInput): Promise<ApiResponse<RegisterResponse>> {
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
    const user = await createUser({
      username: data.username,
      email: data.email,
      passwordHash,
      slug,
    });

    // Varsayılan kullanıcı ayarlarını oluştur
    await createUserSettings({
      user: { connect: { id: user.id } },
    });

    return {
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }
    throw new BusinessError('Kullanıcı kaydı başarısız');
  }
}

// Kullanıcı girişi (NextAuth ile entegre)
export async function loginUser(data: LoginInput): Promise<ApiResponse<LoginResponse>> {
  try {
    // Kullanıcıyı bul
    const user = await findUserByUsername(data.username);
    if (!user) {
      throw new UnauthorizedError('Geçersiz kullanıcı adı veya şifre');
    }

    // Şifre kontrolü
    if (!user.passwordHash) {
      throw new UnauthorizedError('Geçersiz kullanıcı adı veya şifre');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Geçersiz kullanıcı adı veya şifre');
    }

    // Son giriş zamanını güncelle
    await updateUserLastLogin(user.id);

    return {
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    };
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }
    throw new BusinessError('Giriş başarısız');
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