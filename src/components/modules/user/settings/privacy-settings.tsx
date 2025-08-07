'use client';

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  updateProfileVisibilityAction,
  updateAllowFollowsAction,
  updateShowAnimeListAction,
  updateShowFavouriteAnimeSeriesAction,
  updateShowCustomListsAction,
} from '@/lib/actions/user/settings.actions';
import { 
  updateProfileVisibilitySchema,
  updateAllowFollowsSchema,
  updateShowAnimeListSchema,
  updateShowFavouriteAnimeSeriesSchema,
  updateShowCustomListsSchema,
  type UpdateProfileVisibilityInput,
  type UpdateAllowFollowsInput,
  type UpdateShowAnimeListInput,
  type UpdateShowFavouriteAnimeSeriesInput,
  type UpdateShowCustomListsInput
} from '@/lib/schemas/settings.schema';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileVisibility } from '@prisma/client';
import { useSettings } from '@/lib/hooks/use-settings';
import { useSettingsStore } from '@/lib/stores/settings.store';
import { useSession } from 'next-auth/react';
import { USER } from '@/lib/constants/user.constants';

export function PrivacySettings() {
  // Settings hook'u kullan
  const { data: userData } = useSettings();
  const { settings, updateSetting } = useSettingsStore();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Profile visibility form
  const profileVisibilityForm = useForm<UpdateProfileVisibilityInput>({
    resolver: zodResolver(updateProfileVisibilitySchema),
    defaultValues: {
      profileVisibility: ProfileVisibility.PUBLIC,
    },
  });

  // Allow follows form
  const allowFollowsForm = useForm<UpdateAllowFollowsInput>({
    resolver: zodResolver(updateAllowFollowsSchema),
    defaultValues: {
      allowFollows: true,
    },
  });

  // Show anime list form
  const showAnimeListForm = useForm<UpdateShowAnimeListInput>({
    resolver: zodResolver(updateShowAnimeListSchema),
    defaultValues: {
      showAnimeList: true,
    },
  });

  // Show favourite anime series form
  const showFavouriteAnimeSeriesForm = useForm<UpdateShowFavouriteAnimeSeriesInput>({
    resolver: zodResolver(updateShowFavouriteAnimeSeriesSchema),
    defaultValues: {
      showFavouriteAnimeSeries: true,
    },
  });

  // Show custom lists form
  const showCustomListsForm = useForm<UpdateShowCustomListsInput>({
    resolver: zodResolver(updateShowCustomListsSchema),
    defaultValues: {
      showCustomLists: true,
    },
  });

  // Form'ları settings data yüklendikten sonra güncelle
  useEffect(() => {
    if (settings) {
      profileVisibilityForm.reset({ profileVisibility: settings.profileVisibility || ProfileVisibility.PUBLIC });
      allowFollowsForm.reset({ allowFollows: settings.allowFollows ?? true });
      showAnimeListForm.reset({ showAnimeList: settings.showAnimeList ?? true });
      showFavouriteAnimeSeriesForm.reset({ showFavouriteAnimeSeries: settings.showFavouriteAnimeSeries ?? true });
      showCustomListsForm.reset({ showCustomLists: settings.showCustomLists ?? true });
    }
  }, [settings, profileVisibilityForm, allowFollowsForm, showAnimeListForm, showFavouriteAnimeSeriesForm, showCustomListsForm]);

  // Mutations
  const updateProfileVisibilityMutation = useMutation({
    mutationFn: updateProfileVisibilityAction,
    onSuccess: () => {
      toast.success('Profil görünürlüğü güncellendi');
      queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'settings'] });
    },
    onError: (error) => {
      console.error('Profile visibility update error:', error);
      toast.error(error.message || 'Profil görünürlüğü güncellenemedi');
    },
  });

  const updateAllowFollowsMutation = useMutation({
    mutationFn: updateAllowFollowsAction,
    onSuccess: () => {
      toast.success('Takip ayarı güncellendi');
      queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'settings'] });
    },
    onError: (error) => {
      console.error('Allow follows update error:', error);
      toast.error(error.message || 'Takip ayarı güncellenemedi');
    },
  });

  const updateShowAnimeListMutation = useMutation({
    mutationFn: updateShowAnimeListAction,
    onSuccess: () => {
      toast.success('Anime listesi görünürlüğü güncellendi');
      queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'settings'] });
    },
    onError: (error) => {
      console.error('Show anime list update error:', error);
      toast.error(error.message || 'Anime listesi görünürlüğü güncellenemedi');
    },
  });

  const updateShowFavouriteAnimeSeriesMutation = useMutation({
    mutationFn: updateShowFavouriteAnimeSeriesAction,
    onSuccess: () => {
      toast.success('Favori anime görünürlüğü güncellendi');
      queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'settings'] });
    },
    onError: (error) => {
      console.error('Show favourite anime series update error:', error);
      toast.error(error.message || 'Favori anime görünürlüğü güncellenemedi');
    },
  });

  const updateShowCustomListsMutation = useMutation({
    mutationFn: updateShowCustomListsAction,
    onSuccess: () => {
      toast.success('Özel listeler görünürlüğü güncellendi');
      queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'settings'] });
    },
    onError: (error) => {
      console.error('Show custom lists update error:', error);
      toast.error(error.message || 'Özel listeler görünürlüğü güncellenemedi');
    },
  });

  // Auto-save handlers
  const handleProfileVisibilityChange = (value: string) => {
    updateProfileVisibilityMutation.mutate(
      { profileVisibility: value as ProfileVisibility },
      {
        onSuccess: () => {
          updateSetting('profileVisibility', value as ProfileVisibility);
        }
      }
    );
  };

  const handleAllowFollowsChange = (checked: boolean) => {
    updateAllowFollowsMutation.mutate(
      { allowFollows: checked },
      {
        onSuccess: () => {
          updateSetting('allowFollows', checked);
        }
      }
    );
  };

  const handleShowAnimeListChange = (checked: boolean) => {
    updateShowAnimeListMutation.mutate(
      { showAnimeList: checked },
      {
        onSuccess: () => {
          updateSetting('showAnimeList', checked);
        }
      }
    );
  };

  const handleShowFavouriteAnimeSeriesChange = (checked: boolean) => {
    updateShowFavouriteAnimeSeriesMutation.mutate(
      { showFavouriteAnimeSeries: checked },
      {
        onSuccess: () => {
          updateSetting('showFavouriteAnimeSeries', checked);
        }
      }
    );
  };

  const handleShowCustomListsChange = (checked: boolean) => {
    updateShowCustomListsMutation.mutate(
      { showCustomLists: checked },
      {
        onSuccess: () => {
          updateSetting('showCustomLists', checked);
        }
      }
    );
  };

  if (!settings) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Profile Visibility */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Profil Görünürlüğü</h3>
          <p className="text-sm text-muted-foreground">
            Profilinizin kimler tarafından görülebileceğini belirleyin
          </p>
        </div>
        <Form {...profileVisibilityForm}>
          <FormField
            control={profileVisibilityForm.control}
            name="profileVisibility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profil Görünürlüğü</FormLabel>
                <Select
                  onValueChange={handleProfileVisibilityChange}
                  defaultValue={field.value}
                  disabled={updateProfileVisibilityMutation.isPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Görünürlük seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={ProfileVisibility.PUBLIC}>{USER.PROFILE_VISIBILITY_LABELS[ProfileVisibility.PUBLIC]}</SelectItem>
                    <SelectItem value={ProfileVisibility.FOLLOWERS_ONLY}>{USER.PROFILE_VISIBILITY_LABELS[ProfileVisibility.FOLLOWERS_ONLY]}</SelectItem>
                    <SelectItem value={ProfileVisibility.PRIVATE}>{USER.PROFILE_VISIBILITY_LABELS[ProfileVisibility.PRIVATE]}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      </div>

      <Separator />

      {/* Allow Follows */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Takip İzinleri</h3>
          <p className="text-sm text-muted-foreground">
            Kullanıcıların sizi takip edip edemeyeceğini belirleyin
          </p>
        </div>
        <Form {...allowFollowsForm}>
          <FormField
            control={allowFollowsForm.control}
            name="allowFollows"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Takip İzni Ver
                  </FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Kullanıcıların sizi takip etmesine izin ver
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={handleAllowFollowsChange}
                    disabled={updateAllowFollowsMutation.isPending}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </Form>
      </div>

      <Separator />

      {/* Show Anime List */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Anime Listesi Görünürlüğü</h3>
          <p className="text-sm text-muted-foreground">
            Anime listenizin başkaları tarafından görülüp görülmeyeceğini belirleyin
          </p>
        </div>
        <Form {...showAnimeListForm}>
          <FormField
            control={showAnimeListForm.control}
            name="showAnimeList"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Anime Listesini Göster
                  </FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Anime listenizi başkalarına göster
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={handleShowAnimeListChange}
                    disabled={updateShowAnimeListMutation.isPending}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </Form>
      </div>

      <Separator />

      {/* Show Favourite Anime Series */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Favori Anime Görünürlüğü</h3>
          <p className="text-sm text-muted-foreground">
            Favori anime serilerinizin başkaları tarafından görülüp görülmeyeceğini belirleyin
          </p>
        </div>
        <Form {...showFavouriteAnimeSeriesForm}>
          <FormField
            control={showFavouriteAnimeSeriesForm.control}
            name="showFavouriteAnimeSeries"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Favori Animeleri Göster
                  </FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Favori anime serilerinizi başkalarına göster
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={handleShowFavouriteAnimeSeriesChange}
                    disabled={updateShowFavouriteAnimeSeriesMutation.isPending}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </Form>
      </div>

      <Separator />

      {/* Show Custom Lists */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Özel Listeler Görünürlüğü</h3>
          <p className="text-sm text-muted-foreground">
            Özel listelerinizin başkaları tarafından görülüp görülmeyeceğini belirleyin
          </p>
        </div>
        <Form {...showCustomListsForm}>
          <FormField
            control={showCustomListsForm.control}
            name="showCustomLists"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Özel Listeleri Göster
                  </FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Özel listelerinizi başkalarına göster
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={handleShowCustomListsChange}
                    disabled={updateShowCustomListsMutation.isPending}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </Form>
      </div>
    </div>
  );
} 