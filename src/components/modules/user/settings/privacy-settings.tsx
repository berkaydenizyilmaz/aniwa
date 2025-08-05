'use client';

import { useForm } from 'react-hook-form';
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
  getUserSettingsAction
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
import { useMutation, useQuery } from '@tanstack/react-query';
import { GetUserSettingsResponse } from '@/lib/types/api/settings.api';
import { ProfileVisibility } from '@prisma/client';

export function PrivacySettings() {
  // Kullanıcı ayarlarını getir
  const { data: userData, refetch } = useQuery({
    queryKey: ['userSettings'],
    queryFn: getUserSettingsAction,
  });

  const user = userData?.success ? (userData.data as GetUserSettingsResponse)?.user : null;
  const settings = userData?.success ? (userData.data as GetUserSettingsResponse)?.settings : null;

  // Profile visibility form
  const profileVisibilityForm = useForm<UpdateProfileVisibilityInput>({
    resolver: zodResolver(updateProfileVisibilitySchema),
    defaultValues: {
      profileVisibility: settings?.profileVisibility || ProfileVisibility.PUBLIC,
    },
  });

  // Allow follows form
  const allowFollowsForm = useForm<UpdateAllowFollowsInput>({
    resolver: zodResolver(updateAllowFollowsSchema),
    defaultValues: {
      allowFollows: settings?.allowFollows ?? true,
    },
  });

  // Show anime list form
  const showAnimeListForm = useForm<UpdateShowAnimeListInput>({
    resolver: zodResolver(updateShowAnimeListSchema),
    defaultValues: {
      showAnimeList: settings?.showAnimeList ?? true,
    },
  });

  // Show favourite anime series form
  const showFavouriteAnimeSeriesForm = useForm<UpdateShowFavouriteAnimeSeriesInput>({
    resolver: zodResolver(updateShowFavouriteAnimeSeriesSchema),
    defaultValues: {
      showFavouriteAnimeSeries: settings?.showFavouriteAnimeSeries ?? true,
    },
  });

  // Show custom lists form
  const showCustomListsForm = useForm<UpdateShowCustomListsInput>({
    resolver: zodResolver(updateShowCustomListsSchema),
    defaultValues: {
      showCustomLists: settings?.showCustomLists ?? true,
    },
  });

  // Mutations
  const updateProfileVisibilityMutation = useMutation({
    mutationFn: updateProfileVisibilityAction,
    onSuccess: () => {
      toast.success('Profil görünürlüğü güncellendi');
      refetch();
    },
    onError: (error) => {
      console.error('Profile visibility update error:', error);
      toast.error('Profil görünürlüğü güncellenemedi');
    },
  });

  const updateAllowFollowsMutation = useMutation({
    mutationFn: updateAllowFollowsAction,
    onSuccess: () => {
      toast.success('Takip izinleri güncellendi');
      refetch();
    },
    onError: (error) => {
      console.error('Allow follows update error:', error);
      toast.error('Takip izinleri güncellenemedi');
    },
  });

  const updateShowAnimeListMutation = useMutation({
    mutationFn: updateShowAnimeListAction,
    onSuccess: () => {
      toast.success('Anime listesi gösterme ayarı güncellendi');
      refetch();
    },
    onError: (error) => {
      console.error('Show anime list update error:', error);
      toast.error('Anime listesi gösterme ayarı güncellenemedi');
    },
  });

  const updateShowFavouriteAnimeSeriesMutation = useMutation({
    mutationFn: updateShowFavouriteAnimeSeriesAction,
    onSuccess: () => {
      toast.success('Favori animeleri gösterme ayarı güncellendi');
      refetch();
    },
    onError: (error) => {
      console.error('Show favourite anime series update error:', error);
      toast.error('Favori animeleri gösterme ayarı güncellenemedi');
    },
  });

  const updateShowCustomListsMutation = useMutation({
    mutationFn: updateShowCustomListsAction,
    onSuccess: () => {
      toast.success('Özel listeleri gösterme ayarı güncellendi');
      refetch();
    },
    onError: (error) => {
      console.error('Show custom lists update error:', error);
      toast.error('Özel listeleri gösterme ayarı güncellenemedi');
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
                      Takip İzinleri
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
              Takip İzinlerini Güncelle
            </Button>
          </form>
        </Form>
      </div>

      <Separator />

      {/* Show Anime List */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Anime Listesi Gösterimi</h3>
          <p className="text-sm text-muted-foreground">
            Anime listenizin diğer kullanıcılar tarafından görülüp görülmeyeceğini belirleyin
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
                      Anime Listesi Göster
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Anime listenizi diğer kullanıcılara göster
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
          <h3 className="text-lg font-medium">Favori Animeleri Gösterimi</h3>
          <p className="text-sm text-muted-foreground">
            Favori anime serilerinizin diğer kullanıcılar tarafından görülüp görülmeyeceğini belirleyin
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
                      Favori anime serilerinizi diğer kullanıcılara göster
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
              Favori Animeleri Ayarını Güncelle
            </Button>
          </form>
        </Form>
      </div>

      <Separator />

      {/* Show Custom Lists */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Özel Listeleri Gösterimi</h3>
          <p className="text-sm text-muted-foreground">
            Özel listelerinizin diğer kullanıcılar tarafından görülüp görülmeyeceğini belirleyin
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
                      Özel listelerinizi diğer kullanıcılara göster
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
              Özel Listeleri Ayarını Güncelle
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
} 