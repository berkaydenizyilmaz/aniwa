'use client';

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
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

export function PrivacySettings() {
  // Settings hook'u kullan
  const { data: userData } = useSettings();
  const { settings } = useSettingsStore();
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
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
    },
    onError: (error) => {
      console.error('Profile visibility update error:', error);
      toast.error('Profil görünürlüğü güncellenemedi');
    },
  });

  const updateAllowFollowsMutation = useMutation({
    mutationFn: updateAllowFollowsAction,
    onSuccess: () => {
      toast.success('Takip ayarı güncellendi');
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
    },
    onError: (error) => {
      console.error('Allow follows update error:', error);
      toast.error('Takip ayarı güncellenemedi');
    },
  });

  const updateShowAnimeListMutation = useMutation({
    mutationFn: updateShowAnimeListAction,
    onSuccess: () => {
      toast.success('Anime listesi görünürlüğü güncellendi');
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
    },
    onError: (error) => {
      console.error('Show anime list update error:', error);
      toast.error('Anime listesi görünürlüğü güncellenemedi');
    },
  });

  const updateShowFavouriteAnimeSeriesMutation = useMutation({
    mutationFn: updateShowFavouriteAnimeSeriesAction,
    onSuccess: () => {
      toast.success('Favori anime görünürlüğü güncellendi');
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
    },
    onError: (error) => {
      console.error('Show favourite anime series update error:', error);
      toast.error('Favori anime görünürlüğü güncellenemedi');
    },
  });

  const updateShowCustomListsMutation = useMutation({
    mutationFn: updateShowCustomListsAction,
    onSuccess: () => {
      toast.success('Özel listeler görünürlüğü güncellendi');
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
    },
    onError: (error) => {
      console.error('Show custom lists update error:', error);
      toast.error('Özel listeler görünürlüğü güncellenemedi');
    },
  });

  // Form submit handlers
  const onProfileVisibilitySubmit = async (data: UpdateProfileVisibilityInput) => {
    updateProfileVisibilityMutation.mutate(data);
  };

  const onAllowFollowsSubmit = async (data: UpdateAllowFollowsInput) => {
    updateAllowFollowsMutation.mutate(data);
  };

  const onShowAnimeListSubmit = async (data: UpdateShowAnimeListInput) => {
    updateShowAnimeListMutation.mutate(data);
  };

  const onShowFavouriteAnimeSeriesSubmit = async (data: UpdateShowFavouriteAnimeSeriesInput) => {
    updateShowFavouriteAnimeSeriesMutation.mutate(data);
  };

  const onShowCustomListsSubmit = async (data: UpdateShowCustomListsInput) => {
    updateShowCustomListsMutation.mutate(data);
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
          <form onSubmit={profileVisibilityForm.handleSubmit(onProfileVisibilitySubmit)} className="space-y-4">
            <FormField
              control={profileVisibilityForm.control}
              name="profileVisibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profil Görünürlüğü</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={updateProfileVisibilityMutation.isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Görünürlük seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={ProfileVisibility.PUBLIC}>Herkese Açık</SelectItem>
                      <SelectItem value={ProfileVisibility.FOLLOWERS_ONLY}>Sadece Takipçiler</SelectItem>
                      <SelectItem value={ProfileVisibility.PRIVATE}>Gizli</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={updateProfileVisibilityMutation.isPending}
            >
              Görünürlüğü Güncelle
            </Button>
          </form>
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
          <form onSubmit={allowFollowsForm.handleSubmit(onAllowFollowsSubmit)} className="space-y-4">
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
                      onCheckedChange={field.onChange}
                      disabled={updateAllowFollowsMutation.isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={updateAllowFollowsMutation.isPending}
            >
              Takip Ayarını Güncelle
            </Button>
          </form>
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
          <form onSubmit={showAnimeListForm.handleSubmit(onShowAnimeListSubmit)} className="space-y-4">
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
                      onCheckedChange={field.onChange}
                      disabled={updateShowAnimeListMutation.isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={updateShowAnimeListMutation.isPending}
            >
              Anime Listesi Ayarını Güncelle
            </Button>
          </form>
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
          <form onSubmit={showFavouriteAnimeSeriesForm.handleSubmit(onShowFavouriteAnimeSeriesSubmit)} className="space-y-4">
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
                      onCheckedChange={field.onChange}
                      disabled={updateShowFavouriteAnimeSeriesMutation.isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={updateShowFavouriteAnimeSeriesMutation.isPending}
            >
              Favori Anime Ayarını Güncelle
            </Button>
          </form>
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
          <form onSubmit={showCustomListsForm.handleSubmit(onShowCustomListsSubmit)} className="space-y-4">
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
                      onCheckedChange={field.onChange}
                      disabled={updateShowCustomListsMutation.isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={updateShowCustomListsMutation.isPending}
            >
              Özel Listeler Ayarını Güncelle
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
} 