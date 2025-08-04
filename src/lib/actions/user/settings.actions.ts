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
  updateNotificationSettingsSchema,
  type UpdateProfileInput,
  type UpdateGeneralSettingsInput,
  type UpdatePrivacySettingsInput,
  type UpdateNotificationSettingsInput
} from '@/lib/schemas/settings.schema';
import { handleServerActionError, type ServerActionResponse } from '@/lib/utils/server-action-error-handler';
import { ROUTES } from '@/lib/constants/routes.constants';

// Profil güncelleme action
export async function updateProfileAction(data: UpdateProfileInput): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Zod validasyonu
    const validatedData = updateProfileSchema.parse(data);

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
export async function updateGeneralSettingsAction(data: UpdateGeneralSettingsInput): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Zod validasyonu
    const validatedData = updateGeneralSettingsSchema.parse(data);

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
export async function updatePrivacySettingsAction(data: UpdatePrivacySettingsInput): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Zod validasyonu
    const validatedData = updatePrivacySettingsSchema.parse(data);

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
  export async function updateNotificationSettingsAction(data: UpdateNotificationSettingsInput): Promise<ServerActionResponse> {
  // Session'dan user bilgisini al
  const session = await getServerSession(authConfig);
  
  try {
    // Zod validasyonu
    const validatedData = updateNotificationSettingsSchema.parse(data);

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