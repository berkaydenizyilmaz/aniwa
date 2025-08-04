// Settings Server Actions

'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { 
  updateProfileBusiness,
  updateGeneralSettingsBusiness,
  updatePrivacySettingsBusiness,
  updateNotificationSettingsBusiness,
  getUserSettingsBusiness
} from '@/lib/services/business/user/settings.business';
import { 
  updateProfileSchema,
  updateGeneralSettingsSchema,
  updatePrivacySettingsSchema,
  updateNotificationSettingsSchema
} from '@/lib/schemas/settings.schema';
import { handleServerActionError, type ServerActionResponse } from '@/lib/utils/server-action-error-handler';
import { ROUTES } from '@/lib/constants/routes.constants';

// Profil güncelleme action
export async function updateProfileAction(formData: FormData): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Form verilerini parse et
    const rawData = {
      username: formData.get('username') as string | null,
      bio: formData.get('bio') as string | null,
      profilePicture: formData.get('profilePicture') as File | null,
      profileBanner: formData.get('profileBanner') as File | null,
    };

    // Zod validasyonu
    const validatedData = updateProfileSchema.parse(rawData);

    // Business logic çağır
    const result = await updateProfileBusiness(session!.user.id, validatedData);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.SETTINGS);

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'updateProfileAction',
      userId: session?.user.id
    });
  }
}

// Genel ayarlar güncelleme action
export async function updateGeneralSettingsAction(formData: FormData): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Form verilerini parse et
    const rawData = {
      themePreference: formData.get('themePreference') as string | null,
      titleLanguagePreference: formData.get('titleLanguagePreference') as string | null,
      displayAdultContent: formData.get('displayAdultContent') === 'true',
      scoreFormat: formData.get('scoreFormat') as string | null,
      autoTrackOnAniwaListAdd: formData.get('autoTrackOnAniwaListAdd') === 'true',
    };

    // Zod validasyonu
    const validatedData = updateGeneralSettingsSchema.parse(rawData);

    // Business logic çağır
    const result = await updateGeneralSettingsBusiness(session!.user.id, validatedData);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.SETTINGS);

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'updateGeneralSettingsAction',
      userId: session?.user.id
    });
  }
}

// Gizlilik ayarları güncelleme action
export async function updatePrivacySettingsAction(formData: FormData): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Form verilerini parse et
    const rawData = {
      profileVisibility: formData.get('profileVisibility') as string | null,
      allowFollows: formData.get('allowFollows') === 'true',
      showAnimeList: formData.get('showAnimeList') === 'true',
      showFavouriteAnimeSeries: formData.get('showFavouriteAnimeSeries') === 'true',
      showCustomLists: formData.get('showCustomLists') === 'true',
    };

    // Zod validasyonu
    const validatedData = updatePrivacySettingsSchema.parse(rawData);

    // Business logic çağır
    const result = await updatePrivacySettingsBusiness(session!.user.id, validatedData);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.SETTINGS);

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'updatePrivacySettingsAction',
      userId: session?.user.id
    });
  }
}

// Bildirim ayarları güncelleme action
export async function updateNotificationSettingsAction(formData: FormData): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Form verilerini parse et
    const rawData = {
      receiveNotificationOnNewFollow: formData.get('receiveNotificationOnNewFollow') === 'true',
      receiveNotificationOnEpisodeAiring: formData.get('receiveNotificationOnEpisodeAiring') === 'true',
      receiveNotificationOnNewMediaPart: formData.get('receiveNotificationOnNewMediaPart') === 'true',
    };

    // Zod validasyonu
    const validatedData = updateNotificationSettingsSchema.parse(rawData);

    // Business logic çağır
    const result = await updateNotificationSettingsBusiness(session!.user.id, validatedData);

    // Cache'i temizle
    revalidatePath(ROUTES.PAGES.SETTINGS);

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'updateNotificationSettingsAction',
      userId: session?.user.id
    });
  }
}

// Kullanıcı ayarlarını getirme action
export async function getUserSettingsAction(): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Business logic çağır
    const result = await getUserSettingsBusiness(session!.user.id);

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    return handleServerActionError(error, {
      actionName: 'getUserSettingsAction',
      userId: session?.user.id
    });
  }
} 