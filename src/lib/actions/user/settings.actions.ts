// Settings server actions

'use server';

import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/services/auth/auth.config';
import { revalidatePath } from 'next/cache';
import { 
  updateThemePreferenceBusiness,
  updateTitleLanguagePreferenceBusiness,
  updateScoreFormatBusiness,
  updateDisplayAdultContentBusiness,
  updateAutoTrackOnAniwaListAddBusiness,
  getUserSettingsBusiness
} from '@/lib/services/business/user/settings/general-settings.business';
import { 
  updateProfileVisibilityBusiness,
  updateAllowFollowsBusiness,
  updateShowAnimeListBusiness,
  updateShowFavouriteAnimeSeriesBusiness,
  updateShowCustomListsBusiness
} from '@/lib/services/business/user/settings/privacy-settings.business';
import { 
  updateNotificationSettingsBusiness
} from '@/lib/services/business/user/settings/notification-settings.business';
import { 
  updateUsernameBusiness,
  updateBioBusiness,
  updatePasswordBusiness,
  updateProfileImagesBusiness,
  getUserProfileBusiness
} from '@/lib/services/business/user/settings/profile-settings.business';
import { 
  updateThemePreferenceSchema,
  updateTitleLanguagePreferenceSchema,
  updateScoreFormatSchema,
  updateDisplayAdultContentSchema,
  updateAutoTrackOnAniwaListAddSchema,
  updateProfileVisibilitySchema,
  updateAllowFollowsSchema,
  updateShowAnimeListSchema,
  updateShowFavouriteAnimeSeriesSchema,
  updateShowCustomListsSchema,
  updateNotificationSettingsSchema,
  updateUsernameSchema,
  updateBioSchema,
  updatePasswordSchema,
  updateProfileImagesSchema,
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
  type UpdateNotificationSettingsInput,
  type UpdateUsernameInput,
  type UpdateBioInput,
  type UpdatePasswordInput,
  type UpdateProfileImagesInput
} from '@/lib/schemas/settings.schema';
import { handleServerActionError, type ServerActionResponse } from '@/lib/utils/server-action-error-handler';
import { ROUTES } from '@/lib/constants/routes.constants';

// ===== GENERAL SETTINGS ACTIONS =====

export async function updateThemePreferenceAction(
  data: UpdateThemePreferenceInput
): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const validatedData = updateThemePreferenceSchema.parse(data);
    const result = await updateThemePreferenceBusiness(session.user.id, validatedData.themePreference);
    
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

export async function updateTitleLanguagePreferenceAction(
  data: UpdateTitleLanguagePreferenceInput
): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const validatedData = updateTitleLanguagePreferenceSchema.parse(data);
    const result = await updateTitleLanguagePreferenceBusiness(session.user.id, validatedData.titleLanguagePreference);
    
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

export async function updateScoreFormatAction(
  data: UpdateScoreFormatInput
): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try { 
    const validatedData = updateScoreFormatSchema.parse(data);
    const result = await updateScoreFormatBusiness(session.user.id, validatedData.scoreFormat);
    
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

export async function updateDisplayAdultContentAction(
  data: UpdateDisplayAdultContentInput
): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const validatedData = updateDisplayAdultContentSchema.parse(data);
    const result = await updateDisplayAdultContentBusiness(session.user.id, validatedData.displayAdultContent);
    
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

export async function updateAutoTrackOnAniwaListAddAction(
  data: UpdateAutoTrackOnAniwaListAddInput
): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const validatedData = updateAutoTrackOnAniwaListAddSchema.parse(data);
    const result = await updateAutoTrackOnAniwaListAddBusiness(session.user.id, validatedData.autoTrackOnAniwaListAdd);
    
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

export async function updateProfileVisibilityAction(
  data: UpdateProfileVisibilityInput
): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const validatedData = updateProfileVisibilitySchema.parse(data);
    const result = await updateProfileVisibilityBusiness(session.user.id, validatedData.profileVisibility);
    
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

export async function updateAllowFollowsAction(
  data: UpdateAllowFollowsInput
): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const validatedData = updateAllowFollowsSchema.parse(data);
    const result = await updateAllowFollowsBusiness(session.user.id, validatedData.allowFollows);
    
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

export async function updateShowAnimeListAction(
  data: UpdateShowAnimeListInput
): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const validatedData = updateShowAnimeListSchema.parse(data);
    const result = await updateShowAnimeListBusiness(session.user.id, validatedData.showAnimeList);
    
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

export async function updateShowFavouriteAnimeSeriesAction(
  data: UpdateShowFavouriteAnimeSeriesInput
): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const validatedData = updateShowFavouriteAnimeSeriesSchema.parse(data);
    const result = await updateShowFavouriteAnimeSeriesBusiness(session.user.id, validatedData.showFavouriteAnimeSeries);
    
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

export async function updateShowCustomListsAction(
  data: UpdateShowCustomListsInput
): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const validatedData = updateShowCustomListsSchema.parse(data);
    const result = await updateShowCustomListsBusiness(session.user.id, validatedData.showCustomLists);
    
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

export async function updateNotificationSettingsAction(
  data: UpdateNotificationSettingsInput
): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const validatedData = updateNotificationSettingsSchema.parse(data);
    const result = await updateNotificationSettingsBusiness(session.user.id, {
      receiveNotificationOnNewFollow: validatedData.receiveNotificationOnNewFollow,
      receiveNotificationOnEpisodeAiring: validatedData.receiveNotificationOnEpisodeAiring,
      receiveNotificationOnNewMediaPart: validatedData.receiveNotificationOnNewMediaPart
    });
    
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

// ===== PROFILE SETTINGS ACTIONS =====

export async function updateUsernameAction(
  data: UpdateUsernameInput
): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const validatedData = updateUsernameSchema.parse(data);
    const result = await updateUsernameBusiness(session.user.id, validatedData.username);
    
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

export async function updateBioAction(
  data: UpdateBioInput
): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const validatedData = updateBioSchema.parse(data);
    const result = await updateBioBusiness(session.user.id, validatedData.bio);
    
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

export async function updatePasswordAction(
  data: UpdatePasswordInput
): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const validatedData = updatePasswordSchema.parse(data);
    const result = await updatePasswordBusiness(session.user.id, validatedData.newPassword);
    
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

export async function updateProfileImagesAction(
  data: UpdateProfileImagesInput
): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const validatedData = updateProfileImagesSchema.parse(data);
    const result = await updateProfileImagesBusiness(session.user.id, validatedData.profilePicture, validatedData.profileBanner);
    
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

// ===== GET ACTIONS =====

export async function getUserSettingsAction(): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const result = await getUserSettingsBusiness(session.user.id);
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

export async function getUserProfileAction(): Promise<ServerActionResponse> {
  const session = await getServerSession(authConfig);
  
  try {
    const result = await getUserProfileBusiness(session.user.id);
    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    handleServerActionError(error, {
      actionName: 'getUserProfileAction',
      userId: session?.user.id
    });
  }
}
