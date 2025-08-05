// Settings Server Actions

'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import { 
  // Profile Settings
  updateUsernameBusiness,
  updateBioBusiness,
  updatePasswordBusiness,
  updateProfileImagesBusiness,
  // General Settings
  updateThemePreferenceBusiness,
  updateTitleLanguagePreferenceBusiness,
  updateScoreFormatBusiness,
  updateDisplayAdultContentBusiness,
  updateAutoTrackOnAniwaListAddBusiness,
  // Privacy Settings
  updateProfileVisibilityBusiness,
  updateAllowFollowsBusiness,
  updateShowAnimeListBusiness,
  updateShowFavouriteAnimeSeriesBusiness,
  updateShowCustomListsBusiness,
  // Notification Settings
  updateNotificationSettingsBusiness,
  // Get Settings
  getUserSettingsBusiness
} from '@/lib/services/business/user/settings.business';
import { 
  // Profile Settings
  updateUsernameSchema,
  updateBioSchema,
  updatePasswordSchema,
  updateProfileImagesSchema,
  // General Settings
  updateThemePreferenceSchema,
  updateTitleLanguagePreferenceSchema,
  updateScoreFormatSchema,
  updateDisplayAdultContentSchema,
  updateAutoTrackOnAniwaListAddSchema,
  // Privacy Settings
  updateProfileVisibilitySchema,
  updateAllowFollowsSchema,
  updateShowAnimeListSchema,
  updateShowFavouriteAnimeSeriesSchema,
  updateShowCustomListsSchema,
  // Notification Settings
  updateNotificationSettingsSchema,
  // Types
  type UpdateUsernameInput,
  type UpdateBioInput,
  type UpdatePasswordInput,
  type UpdateProfileImagesInput,
  type UpdateThemePreferenceInput,
  type UpdateTitleLanguagePreferenceInput,
  type UpdateScoreFormatInput,
  type UpdateDisplayAdultContentInput,
  type UpdateAutoTrackOnAniwaListAddInput,
  type UpdateProfileVisibilityInput,
  type UpdateAllowFollowsInput,
  type UpdateShowAnimeListInput,
  type UpdateShowFavouriteAnimeSeriesInput,
  type UpdateShowCustomListsInput,
  type UpdateNotificationSettingsInput
} from '@/lib/schemas/settings.schema';
import { handleServerActionError, type ServerActionResponse } from '@/lib/utils/server-action-error-handler';
import { ROUTES } from '@/lib/constants/routes.constants';

// ===== PROFILE SETTINGS ACTIONS =====

// Username güncelleme action
export async function updateUsernameAction(data: UpdateUsernameInput): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const validatedData = updateUsernameSchema.parse(data);
    const result = await updateUsernameBusiness(session!.user.id, validatedData);
    revalidatePath(ROUTES.PAGES.SETTINGS);

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    handleServerActionError(error, {
      actionName: 'updateUsernameAction',
      userId: session?.user.id
    });
  }
}

// Bio güncelleme action
export async function updateBioAction(data: UpdateBioInput): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const validatedData = updateBioSchema.parse(data);
    const result = await updateBioBusiness(session!.user.id, validatedData);
    revalidatePath(ROUTES.PAGES.SETTINGS);

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    handleServerActionError(error, {
      actionName: 'updateBioAction',
      userId: session?.user.id
    });
  }
}

// Password güncelleme action
export async function updatePasswordAction(data: UpdatePasswordInput): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const validatedData = updatePasswordSchema.parse(data);
    const result = await updatePasswordBusiness(session!.user.id, validatedData);
    revalidatePath(ROUTES.PAGES.SETTINGS);

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    handleServerActionError(error, {
      actionName: 'updatePasswordAction',
      userId: session?.user.id
    });
  }
}

// Profile images güncelleme action
export async function updateProfileImagesAction(data: UpdateProfileImagesInput): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const validatedData = updateProfileImagesSchema.parse(data);
    const result = await updateProfileImagesBusiness(session!.user.id, validatedData);
    revalidatePath(ROUTES.PAGES.SETTINGS);

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    handleServerActionError(error, {
      actionName: 'updateProfileImagesAction',
      userId: session?.user.id
    });
  }
}

// ===== GENERAL SETTINGS ACTIONS =====

// Theme preference güncelleme action
export async function updateThemePreferenceAction(data: UpdateThemePreferenceInput): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const validatedData = updateThemePreferenceSchema.parse(data);
    const result = await updateThemePreferenceBusiness(session!.user.id, validatedData);
    revalidatePath(ROUTES.PAGES.SETTINGS);

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    handleServerActionError(error, {
      actionName: 'updateThemePreferenceAction',
      userId: session?.user.id
    });
  }
}

// Title language preference güncelleme action
export async function updateTitleLanguagePreferenceAction(data: UpdateTitleLanguagePreferenceInput): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const validatedData = updateTitleLanguagePreferenceSchema.parse(data);
    const result = await updateTitleLanguagePreferenceBusiness(session!.user.id, validatedData);
    revalidatePath(ROUTES.PAGES.SETTINGS);

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    handleServerActionError(error, {
      actionName: 'updateTitleLanguagePreferenceAction',
      userId: session?.user.id
    });
  }
}

// Score format güncelleme action
export async function updateScoreFormatAction(data: UpdateScoreFormatInput): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const validatedData = updateScoreFormatSchema.parse(data);
    const result = await updateScoreFormatBusiness(session!.user.id, validatedData);
    revalidatePath(ROUTES.PAGES.SETTINGS);

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    handleServerActionError(error, {
      actionName: 'updateScoreFormatAction',
      userId: session?.user.id
    });
  }
}

// Display adult content güncelleme action
export async function updateDisplayAdultContentAction(data: UpdateDisplayAdultContentInput): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const validatedData = updateDisplayAdultContentSchema.parse(data);
    const result = await updateDisplayAdultContentBusiness(session!.user.id, validatedData);
    revalidatePath(ROUTES.PAGES.SETTINGS);

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    handleServerActionError(error, {
      actionName: 'updateDisplayAdultContentAction',
      userId: session?.user.id
    });
  }
}

// Auto track on Aniwa list add güncelleme action
export async function updateAutoTrackOnAniwaListAddAction(data: UpdateAutoTrackOnAniwaListAddInput): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const validatedData = updateAutoTrackOnAniwaListAddSchema.parse(data);
    const result = await updateAutoTrackOnAniwaListAddBusiness(session!.user.id, validatedData);
    revalidatePath(ROUTES.PAGES.SETTINGS);

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    handleServerActionError(error, {
      actionName: 'updateAutoTrackOnAniwaListAddAction',
      userId: session?.user.id
    });
  }
}

// ===== PRIVACY SETTINGS ACTIONS =====

// Profile visibility güncelleme action
export async function updateProfileVisibilityAction(data: UpdateProfileVisibilityInput): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const validatedData = updateProfileVisibilitySchema.parse(data);
    const result = await updateProfileVisibilityBusiness(session!.user.id, validatedData);
    revalidatePath(ROUTES.PAGES.SETTINGS);

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    handleServerActionError(error, {
      actionName: 'updateProfileVisibilityAction',
      userId: session?.user.id
    });
  }
}

// Allow follows güncelleme action
export async function updateAllowFollowsAction(data: UpdateAllowFollowsInput): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const validatedData = updateAllowFollowsSchema.parse(data);
    const result = await updateAllowFollowsBusiness(session!.user.id, validatedData);
    revalidatePath(ROUTES.PAGES.SETTINGS);

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    handleServerActionError(error, {
      actionName: 'updateAllowFollowsAction',
      userId: session?.user.id
    });
  }
}

// Show anime list güncelleme action
export async function updateShowAnimeListAction(data: UpdateShowAnimeListInput): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const validatedData = updateShowAnimeListSchema.parse(data);
    const result = await updateShowAnimeListBusiness(session!.user.id, validatedData);
    revalidatePath(ROUTES.PAGES.SETTINGS);

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    handleServerActionError(error, {
      actionName: 'updateShowAnimeListAction',
      userId: session?.user.id
    });
  }
}

// Show favourite anime series güncelleme action
export async function updateShowFavouriteAnimeSeriesAction(data: UpdateShowFavouriteAnimeSeriesInput): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const validatedData = updateShowFavouriteAnimeSeriesSchema.parse(data);
    const result = await updateShowFavouriteAnimeSeriesBusiness(session!.user.id, validatedData);
    revalidatePath(ROUTES.PAGES.SETTINGS);

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    handleServerActionError(error, {
      actionName: 'updateShowFavouriteAnimeSeriesAction',
      userId: session?.user.id
    });
  }
}

// Show custom lists güncelleme action
export async function updateShowCustomListsAction(data: UpdateShowCustomListsInput): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const validatedData = updateShowCustomListsSchema.parse(data);
    const result = await updateShowCustomListsBusiness(session!.user.id, validatedData);
    revalidatePath(ROUTES.PAGES.SETTINGS);

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    handleServerActionError(error, {
      actionName: 'updateShowCustomListsAction',
      userId: session?.user.id
    });
  }
}

// ===== NOTIFICATION SETTINGS ACTIONS =====

// Notification settings güncelleme action (tek action)
export async function updateNotificationSettingsAction(data: UpdateNotificationSettingsInput): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const validatedData = updateNotificationSettingsSchema.parse(data);
    const result = await updateNotificationSettingsBusiness(session!.user.id, validatedData);
    revalidatePath(ROUTES.PAGES.SETTINGS);

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    handleServerActionError(error, {
      actionName: 'updateNotificationSettingsAction',
      userId: session?.user.id
    });
  }
}

// ===== GET SETTINGS ACTION =====

// Kullanıcı ayarlarını getirme action
export async function getUserSettingsAction(): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const result = await getUserSettingsBusiness(session!.user.id);

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    handleServerActionError(error, {
      actionName: 'getUserSettingsAction',
      userId: session?.user.id
    });
  }
} 