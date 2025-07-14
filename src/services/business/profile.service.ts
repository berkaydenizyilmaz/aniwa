import { User, ProfileVisibility } from '@prisma/client'
import { 
  findUserById,
  updateUser,
  findUserByUsername,
  findUserByUsernameWithSettings,
  findUserWithSettings
} from '@/services/db/user.db'
import { 
  updateUserSettings,
  findUserSettingsByUserId 
} from '@/services/db/user-settings.db'
import { checkIfUserFollows } from '@/services/db/user-follow.db'
import { logError } from '@/services/business/logger.service'
import { LOG_EVENTS } from '@/constants/logging'
import { AUTH } from '@/constants/auth'
import { generateUserSlug } from '@/lib/utils'
import type { 
  UpdateUserParams,
  UpdateUserSettingsParams,
  UserWithSettings,
  ServiceResult 
} from '@/types'

// Kullanıcı profil bilgilerini getir
export async function getUserProfile(
  userId: string
): Promise<ServiceResult<UserWithSettings | null>> {
  try {
    // 1. Kullanıcıyı ayarlarıyla birlikte getir
    const user = await findUserWithSettings(userId)
    
    if (!user) {
      return { 
        success: false, 
        error: 'Kullanıcı bulunamadı' 
      }
    }

    return { 
      success: true, 
      data: user 
    }
  } catch (error) {
    logError({
      event: LOG_EVENTS.SYSTEM_ERROR,
      message: 'Profil bilgileri getirme hatası',
      metadata: {
        userId,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      }
    })

    return { 
      success: false, 
      error: 'Profil bilgileri alınamadı' 
    }
  }
}

// Username ile kullanıcı profil bilgilerini getir (public görünüm)
export async function getUserProfileByUsername(
  username: string,
  viewerId?: string
): Promise<ServiceResult<UserWithSettings | null>> {
  try {
    // 1. Kullanıcıyı username ile bul
    const user = await findUserByUsernameWithSettings(username)
    
    if (!user) {
      return { 
        success: false, 
        error: 'Kullanıcı bulunamadı' 
      }
    }

    // 2. Gizlilik kontrolü
    if (user.userSettings?.profileVisibility === ProfileVisibility.PRIVATE) {
      return { 
        success: false, 
        error: 'Bu profil gizli' 
      }
    }

    if (user.userSettings?.profileVisibility === ProfileVisibility.FOLLOWERS_ONLY) {
      if (!viewerId || viewerId === user.id) {
        // Giriş yapmamış veya kendi profili
        return viewerId === user.id 
          ? { success: true, data: user }  // Kendi profilini görebilir
          : { success: false, error: 'Bu profil sadece takipçilere açık' }
      }
      
      // Takipçi kontrolü
      const isFollowing = await checkIfUserFollows(viewerId, user.id)
      if (!isFollowing) {
        return { 
          success: false, 
          error: 'Bu profil sadece takipçilere açık' 
        }
      }
    }

    return { 
      success: true, 
      data: user 
    }
  } catch (error) {
    logError({
      event: LOG_EVENTS.SYSTEM_ERROR,
      message: 'Username ile profil getirme hatası',
      metadata: {
        username,
        viewerId,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      }
    })

    return { 
      success: false, 
      error: 'Profil bilgileri alınamadı' 
    }
  }
}

// Kullanıcı profil bilgilerini güncelle
export async function updateUserProfile(
  userId: string,
  profileData: UpdateUserParams
): Promise<ServiceResult<UserWithSettings>> {
  try {
    // 1. Kullanıcının varlığını kontrol et
    const existingUser = await findUserById(userId)
    if (!existingUser) {
      return { 
        success: false, 
        error: 'Kullanıcı bulunamadı' 
      }
    }

    // 2. Profil bilgilerini doğrudan güncelle
    await updateUser(userId, profileData)

    // 3. Güncellenmiş kullanıcıyı ayarlarıyla birlikte getir
    const userWithSettings = await findUserWithSettings(userId)

    if (!userWithSettings) {
      return { 
        success: false, 
        error: 'Güncellenmiş kullanıcı bulunamadı' 
      }
    }

    return { 
      success: true, 
      data: userWithSettings 
    }
  } catch (error) {
    logError({
      event: LOG_EVENTS.SYSTEM_ERROR,
      message: 'Profil güncelleme hatası',
      metadata: {
        userId,
        profileData,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      }
    })

    return { 
      success: false, 
      error: 'Profil güncellenemedi' 
    }
  }
}

// Kullanıcı adını değiştir
export async function changeUsername(
  userId: string,
  newUsername: string
): Promise<ServiceResult<User>> {
  try {
    // 1. Kullanıcıyı bul
    const existingUser = await findUserById(userId);
    if (!existingUser) {
      return { 
        success: false, 
        error: 'Kullanıcı bulunamadı.' 
      }
    }

    // 2. Yeni kullanıcı adının mevcut olup olmadığını kontrol et
    const usernameTaken = await findUserByUsername(newUsername);
    if (usernameTaken && usernameTaken.id !== userId) {
      return { 
        success: false, 
        error: 'Bu kullanıcı adı zaten alınmış.' 
      }
    }

    // 3. Kullanıcı adı değiştirme süresi limitini kontrol et
    if (existingUser.usernameChangedAt) {
      const daysSinceLastChange = Math.floor(
        (Date.now() - existingUser.usernameChangedAt.getTime()) / (1000 * 60 * 60 * 24)
      )
      if (daysSinceLastChange < AUTH.USERNAME_CHANGE_LIMIT_DAYS) {
        const remainingDays = AUTH.USERNAME_CHANGE_LIMIT_DAYS - daysSinceLastChange;
        return {
          success: false,
          error: `Kullanıcı adınızı değiştirmek için ${remainingDays} gün daha beklemelisiniz.`,
        }
      }
    }

    // 4. Yeni slug oluştur ve veritabanını güncelle
    const newSlug = generateUserSlug(newUsername);
    const updatedUser = await updateUser(userId, {
      username: newUsername,
      slug: newSlug,
      usernameChangedAt: new Date(),
    })

    return { 
      success: true, 
      data: updatedUser 
    }
  } catch (error) {
    logError({
      event: LOG_EVENTS.SYSTEM_ERROR,
      message: 'Kullanıcı adı değiştirme hatası',
      metadata: {
        userId,
        newUsername,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      },
    })

    return {
      success: false,
      error: 'Kullanıcı adı değiştirilirken bir hata oluştu.',
    }
  }
}


// Kullanıcı ayarlarını güncelle
export async function updateUserProfileSettings(
  userId: string,
  settingsData: UpdateUserSettingsParams
): Promise<ServiceResult<UserWithSettings>> {
  try {
    // 1. Kullanıcının varlığını kontrol et
    const existingUser = await findUserById(userId)
    if (!existingUser) {
      return { 
        success: false, 
        error: 'Kullanıcı bulunamadı' 
      }
    }

    // 2. Mevcut ayarları kontrol et
    const existingSettings = await findUserSettingsByUserId(userId)
    if (!existingSettings) {
      return { 
        success: false, 
        error: 'Kullanıcı ayarları bulunamadı' 
      }
    }

    // 3. Ayarları güncelle
    await updateUserSettings(userId, settingsData)

    // 4. Güncellenmiş kullanıcıyı ayarlarıyla birlikte getir
    const userWithSettings = await findUserWithSettings(userId)

    if (!userWithSettings) {
      return { 
        success: false, 
        error: 'Güncellenmiş kullanıcı bulunamadı' 
      }
    }

    return { 
      success: true, 
      data: userWithSettings 
    }
  } catch (error) {
    logError({
      event: LOG_EVENTS.SYSTEM_ERROR,
      message: 'Ayarlar güncelleme hatası',
      metadata: {
        userId,
        settingsData,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      }
    })

    return { 
      success: false, 
      error: 'Ayarlar güncellenemedi' 
    }
  }
}

// TODO: Cloudinary entegrasyonu için resim yükleme fonksiyonları
// export async function uploadProfilePicture(userId: string, imageFile: File): Promise<ServiceResult<string>>
// export async function uploadProfileBanner(userId: string, imageFile: File): Promise<ServiceResult<string>> 