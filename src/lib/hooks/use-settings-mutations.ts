// Settings mutations hook - React Query mutations

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useSettingsStore } from '@/lib/stores/settings.store';
import { 
  updateThemePreferenceAction,
  updateTitleLanguagePreferenceAction,
  updateScoreFormatAction,
  updateDisplayAdultContentAction,
  updateAutoTrackOnAniwaListAddAction,
  updateProfileVisibilityAction,
  updateAllowFollowsAction,
  updateShowAnimeListAction,
  updateShowFavouriteAnimeSeriesAction,
  updateShowCustomListsAction,
  updateNotificationSettingsAction,
  updateUsernameAction,
  updateBioAction,
  updatePasswordAction,
  updateProfileImagesAction
} from '@/lib/actions/user/settings.actions';
import { 
  UpdateThemePreferenceInput,
  UpdateTitleLanguagePreferenceInput,
  UpdateScoreFormatInput,
  UpdateDisplayAdultContentInput,
  UpdateAutoTrackOnAniwaListAddInput,
  UpdateProfileVisibilityInput,
  UpdateAllowFollowsInput,
  UpdateShowAnimeListInput,
  UpdateShowFavouriteAnimeSeriesInput,
  UpdateShowCustomListsInput,
  UpdateNotificationSettingsInput,
  UpdateUsernameInput,
  UpdateBioInput,
  UpdatePasswordInput,
  UpdateProfileImagesInput
} from '@/lib/schemas/settings.schema';

export function useSettingsMutations() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { updateSetting, updateProfileField } = useSettingsStore();

  // ===== GENERAL SETTINGS MUTATIONS =====

  const updateThemeMutation = useMutation({
    mutationFn: (data: UpdateThemePreferenceInput) => updateThemePreferenceAction(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Tema tercihi güncellendi');
        // Store'u güncelle
        updateSetting('themePreference', response.data.themePreference);
        // Cache'i invalidate et
        queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'settings'] });
      }
    },
    onError: (error) => {
      console.error('Theme update error:', error);
      toast.error(error.message || 'Tema tercihi güncellenemedi');
    },
  });

  const updateTitleLanguageMutation = useMutation({
    mutationFn: (data: UpdateTitleLanguagePreferenceInput) => updateTitleLanguagePreferenceAction(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Başlık dili tercihi güncellendi');
        updateSetting('titleLanguagePreference', response.data.titleLanguagePreference);
        queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'settings'] });
      }
    },
    onError: (error) => {
      console.error('Title language update error:', error);
      toast.error(error.message || 'Başlık dili tercihi güncellenemedi');
    },
  });

  const updateScoreFormatMutation = useMutation({
    mutationFn: (data: UpdateScoreFormatInput) => updateScoreFormatAction(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Puanlama formatı güncellendi');
        updateSetting('scoreFormat', response.data.scoreFormat);
        queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'settings'] });
      }
    },
    onError: (error) => {
      console.error('Score format update error:', error);
      toast.error(error.message || 'Puanlama formatı güncellenemedi');
    },
  });

  const updateDisplayAdultContentMutation = useMutation({
    mutationFn: (data: UpdateDisplayAdultContentInput) => updateDisplayAdultContentAction(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Yetişkin içerik ayarı güncellendi');
        updateSetting('displayAdultContent', response.data.displayAdultContent);
        queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'settings'] });
      }
    },
    onError: (error) => {
      console.error('Display adult content update error:', error);
      toast.error(error.message || 'Yetişkin içerik ayarı güncellenemedi');
    },
  });

  const updateAutoTrackMutation = useMutation({
    mutationFn: (data: UpdateAutoTrackOnAniwaListAddInput) => updateAutoTrackOnAniwaListAddAction(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Otomatik takip ayarı güncellendi');
        updateSetting('autoTrackOnAniwaListAdd', response.data.autoTrackOnAniwaListAdd);
        queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'settings'] });
      }
    },
    onError: (error) => {
      console.error('Auto track update error:', error);
      toast.error(error.message || 'Otomatik takip ayarı güncellenemedi');
    },
  });

  // ===== PRIVACY SETTINGS MUTATIONS =====

  const updateProfileVisibilityMutation = useMutation({
    mutationFn: (data: UpdateProfileVisibilityInput) => updateProfileVisibilityAction(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Profil görünürlüğü güncellendi');
        updateSetting('profileVisibility', response.data.profileVisibility);
        queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'settings'] });
      }
    },
    onError: (error) => {
      console.error('Profile visibility update error:', error);
      toast.error(error.message || 'Profil görünürlüğü güncellenemedi');
    },
  });

  const updateAllowFollowsMutation = useMutation({
    mutationFn: (data: UpdateAllowFollowsInput) => updateAllowFollowsAction(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Takip izinleri güncellendi');
        updateSetting('allowFollows', response.data.allowFollows);
        queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'settings'] });
      }
    },
    onError: (error) => {
      console.error('Allow follows update error:', error);
      toast.error(error.message || 'Takip izinleri güncellenemedi');
    },
  });

  const updateShowAnimeListMutation = useMutation({
    mutationFn: (data: UpdateShowAnimeListInput) => updateShowAnimeListAction(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Anime listesi gösterme ayarı güncellendi');
        updateSetting('showAnimeList', response.data.showAnimeList);
        queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'settings'] });
      }
    },
    onError: (error) => {
      console.error('Show anime list update error:', error);
      toast.error(error.message || 'Anime listesi gösterme ayarı güncellenemedi');
    },
  });

  const updateShowFavouriteAnimeMutation = useMutation({
    mutationFn: (data: UpdateShowFavouriteAnimeSeriesInput) => updateShowFavouriteAnimeSeriesAction(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Favori animeleri gösterme ayarı güncellendi');
        updateSetting('showFavouriteAnimeSeries', response.data.showFavouriteAnimeSeries);
        queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'settings'] });
      }
    },
    onError: (error) => {
      console.error('Show favourite anime update error:', error);
      toast.error(error.message || 'Favori animeleri gösterme ayarı güncellenemedi');
    },
  });

  const updateShowCustomListsMutation = useMutation({
    mutationFn: (data: UpdateShowCustomListsInput) => updateShowCustomListsAction(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Özel listeleri gösterme ayarı güncellendi');
        updateSetting('showCustomLists', response.data.showCustomLists);
        queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'settings'] });
      }
    },
    onError: (error) => {
      console.error('Show custom lists update error:', error);
      toast.error(error.message || 'Özel listeleri gösterme ayarı güncellenemedi');
    },
  });

  // ===== NOTIFICATION SETTINGS MUTATIONS =====

  const updateNotificationSettingsMutation = useMutation({
    mutationFn: (data: UpdateNotificationSettingsInput) => updateNotificationSettingsAction(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Bildirim ayarları güncellendi');
        // Tüm notification settings'leri güncelle
        queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'settings'] });
      }
    },
    onError: (error) => {
      console.error('Notification settings update error:', error);
      toast.error(error.message || 'Bildirim ayarları güncellenemedi');
    },
  });

  // ===== PROFILE SETTINGS MUTATIONS =====

  const updateUsernameMutation = useMutation({
    mutationFn: (data: UpdateUsernameInput) => updateUsernameAction(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Kullanıcı adı güncellendi');
        queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'profile'] });
      }
    },
    onError: (error) => {
      console.error('Username update error:', error);
      toast.error(error.message || 'Kullanıcı adı güncellenemedi');
    },
  });

  const updateBioMutation = useMutation({
    mutationFn: (data: UpdateBioInput) => updateBioAction(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Biyografi güncellendi');
        updateProfileField('bio', response.data.bio);
        queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'profile'] });
      }
    },
    onError: (error) => {
      console.error('Bio update error:', error);
      toast.error(error.message || 'Biyografi güncellenemedi');
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (data: UpdatePasswordInput) => updatePasswordAction(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Parola güncellendi');
      }
    },
    onError: (error) => {
      console.error('Password update error:', error);
      toast.error(error.message || 'Parola güncellenemedi');
    },
  });

  const updateProfileImagesMutation = useMutation({
    mutationFn: (data: UpdateProfileImagesInput) => updateProfileImagesAction(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Profil görselleri güncellendi');
        queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'profile'] });
      }
    },
    onError: (error) => {
      console.error('Profile images update error:', error);
      toast.error(error.message || 'Profil görselleri güncellenemedi');
    },
  });

  return {
    // General Settings
    updateThemeMutation,
    updateTitleLanguageMutation,
    updateScoreFormatMutation,
    updateDisplayAdultContentMutation,
    updateAutoTrackMutation,
    
    // Privacy Settings
    updateProfileVisibilityMutation,
    updateAllowFollowsMutation,
    updateShowAnimeListMutation,
    updateShowFavouriteAnimeMutation,
    updateShowCustomListsMutation,
    
    // Notification Settings
    updateNotificationSettingsMutation,
    
    // Profile Settings
    updateUsernameMutation,
    updateBioMutation,
    updatePasswordMutation,
    updateProfileImagesMutation,
  };
}
