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
import { Card } from '@/components/ui/card';
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
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h4 className="text-sm font-medium mb-2">Profil Görünürlüğü</h4>
          <p className="text-xs text-muted-foreground mb-3">Kimler görebilir?</p>
          <Form {...profileVisibilityForm}>
            <FormField
              control={profileVisibilityForm.control}
              name="profileVisibility"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select onValueChange={handleProfileVisibilityChange} defaultValue={field.value} disabled={updateProfileVisibilityMutation.isPending}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Görünürlük" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={ProfileVisibility.PUBLIC}>{USER.PROFILE_VISIBILITY_LABELS[ProfileVisibility.PUBLIC]}</SelectItem>
                        <SelectItem value={ProfileVisibility.FOLLOWERS_ONLY}>{USER.PROFILE_VISIBILITY_LABELS[ProfileVisibility.FOLLOWERS_ONLY]}</SelectItem>
                        <SelectItem value={ProfileVisibility.PRIVATE}>{USER.PROFILE_VISIBILITY_LABELS[ProfileVisibility.PRIVATE]}</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        </Card>

        <Card className="p-4">
          <h4 className="text-sm font-medium mb-2">Takip İzni</h4>
          <p className="text-xs text-muted-foreground mb-3">Kullanıcılar sizi takip edebilsin</p>
          <Form {...allowFollowsForm}>
            <FormField
              control={allowFollowsForm.control}
              name="allowFollows"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">İzin ver</FormLabel>
                      <div className="text-xs text-muted-foreground">Takip etmeye izin ver</div>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={handleAllowFollowsChange} disabled={updateAllowFollowsMutation.isPending} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        </Card>

        <Card className="p-4">
          <h4 className="text-sm font-medium mb-2">Anime Listesi</h4>
          <p className="text-xs text-muted-foreground mb-3">Listenin görünürlüğü</p>
          <Form {...showAnimeListForm}>
            <FormField
              control={showAnimeListForm.control}
              name="showAnimeList"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Göster</FormLabel>
                      <div className="text-xs text-muted-foreground">Anime listeniz görünsün</div>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={handleShowAnimeListChange} disabled={updateShowAnimeListMutation.isPending} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        </Card>

        <Card className="p-4">
          <h4 className="text-sm font-medium mb-2">Favori Animeler</h4>
          <p className="text-xs text-muted-foreground mb-3">Favoriler görünürlüğü</p>
          <Form {...showFavouriteAnimeSeriesForm}>
            <FormField
              control={showFavouriteAnimeSeriesForm.control}
              name="showFavouriteAnimeSeries"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Göster</FormLabel>
                      <div className="text-xs text-muted-foreground">Favoriler görünür olsun</div>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={handleShowFavouriteAnimeSeriesChange} disabled={updateShowFavouriteAnimeSeriesMutation.isPending} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        </Card>
      </div>

      <Card className="p-4">
        <h4 className="text-sm font-medium mb-2">Özel Listeler</h4>
        <p className="text-xs text-muted-foreground mb-3">Özel listeler görünürlüğü</p>
        <Form {...showCustomListsForm}>
          <FormField
            control={showCustomListsForm.control}
            name="showCustomLists"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">Göster</FormLabel>
                    <div className="text-xs text-muted-foreground">Özel listeler görünsün</div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={handleShowCustomListsChange} disabled={updateShowCustomListsMutation.isPending} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      </Card>
    </div>
  );
} 