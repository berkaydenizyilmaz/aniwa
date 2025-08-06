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
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { updateNotificationSettingsAction } from '@/lib/actions/user/settings.actions';
import { 
  updateNotificationSettingsSchema,
  type UpdateNotificationSettingsInput
} from '@/lib/schemas/settings.schema';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSettings } from '@/lib/hooks/use-settings';
import { useSettingsStore } from '@/lib/stores/settings.store';

export function NotificationSettings() {
  // Settings hook'u kullan
  const { data: userData } = useSettings();
  const { settings } = useSettingsStore();
  const queryClient = useQueryClient();

  // Notification settings form
  const notificationForm = useForm<UpdateNotificationSettingsInput>({
    resolver: zodResolver(updateNotificationSettingsSchema),
    defaultValues: {
      receiveNotificationOnNewFollow: true,
      receiveNotificationOnEpisodeAiring: true,
      receiveNotificationOnNewMediaPart: true,
    },
  });

  // Form'u settings data yüklendikten sonra güncelle
  useEffect(() => {
    if (settings) {
      notificationForm.reset({
        receiveNotificationOnNewFollow: settings.receiveNotificationOnNewFollow ?? true,
        receiveNotificationOnEpisodeAiring: settings.receiveNotificationOnEpisodeAiring ?? true,
        receiveNotificationOnNewMediaPart: settings.receiveNotificationOnNewMediaPart ?? true,
      });
    }
  }, [settings, notificationForm]);

  // Mutation
  const updateNotificationMutation = useMutation({
    mutationFn: updateNotificationSettingsAction,
    onSuccess: () => {
      toast.success('Bildirim ayarları güncellendi');
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
    },
    onError: (error) => {
      console.error('Notification settings update error:', error);
      toast.error(error.message || 'Bildirim ayarları güncellenemedi');
    },
  });

  // Auto-save handlers
  const handleNewFollowNotificationChange = (checked: boolean) => {
    const currentValues = notificationForm.getValues();
    updateNotificationMutation.mutate({
      ...currentValues,
      receiveNotificationOnNewFollow: checked,
    });
  };

  const handleEpisodeAiringNotificationChange = (checked: boolean) => {
    const currentValues = notificationForm.getValues();
    updateNotificationMutation.mutate({
      ...currentValues,
      receiveNotificationOnEpisodeAiring: checked,
    });
  };

  const handleNewMediaPartNotificationChange = (checked: boolean) => {
    const currentValues = notificationForm.getValues();
    updateNotificationMutation.mutate({
      ...currentValues,
      receiveNotificationOnNewMediaPart: checked,
    });
  };

  if (!settings) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      {/* New Follow Notifications */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Takip Bildirimleri</h3>
          <p className="text-sm text-muted-foreground">
            Yeni takipçiler hakkında bildirim alın
          </p>
        </div>
        <Form {...notificationForm}>
          <FormField
            control={notificationForm.control}
            name="receiveNotificationOnNewFollow"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Yeni Takipçi Bildirimleri
                  </FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Biri sizi takip ettiğinde bildirim al
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={handleNewFollowNotificationChange}
                    disabled={updateNotificationMutation.isPending}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={notificationForm.control}
            name="receiveNotificationOnEpisodeAiring"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Bölüm Yayın Bildirimleri
                  </FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Takip ettiğiniz animelerin yeni bölümleri yayınlandığında bildirim al
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={handleEpisodeAiringNotificationChange}
                    disabled={updateNotificationMutation.isPending}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={notificationForm.control}
            name="receiveNotificationOnNewMediaPart"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Yeni Medya Parçası Bildirimleri
                  </FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Takip ettiğiniz animelerin yeni medya parçaları eklendiğinde bildirim al
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={handleNewMediaPartNotificationChange}
                    disabled={updateNotificationMutation.isPending}
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