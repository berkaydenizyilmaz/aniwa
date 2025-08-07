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
import { Card } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
import { updateNotificationSettingsAction } from '@/lib/actions/user/settings.actions';
import { 
  updateNotificationSettingsSchema,
  type UpdateNotificationSettingsInput
} from '@/lib/schemas/settings.schema';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSettings } from '@/lib/hooks/use-settings';
import { useSettingsStore } from '@/lib/stores/settings.store';
import { useSession } from 'next-auth/react';

export function NotificationSettings() {
  // Settings hook'u kullan
  const { data: userData } = useSettings();
  const { settings, updateSetting } = useSettingsStore();
  const { data: session } = useSession();
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
      queryClient.invalidateQueries({ queryKey: ['user', session?.user?.id, 'settings'] });
    },
    onError: (error) => {
      console.error('Notification settings update error:', error);
      toast.error(error.message || 'Bildirim ayarları güncellenemedi');
    },
  });

  // Auto-save handlers
  const handleNewFollowNotificationChange = (checked: boolean) => {
    const currentValues = notificationForm.getValues();
    updateNotificationMutation.mutate(
      {
        ...currentValues,
        receiveNotificationOnNewFollow: checked,
      },
      {
        onSuccess: () => {
          updateSetting('receiveNotificationOnNewFollow', checked);
        }
      }
    );
  };

  const handleEpisodeAiringNotificationChange = (checked: boolean) => {
    const currentValues = notificationForm.getValues();
    updateNotificationMutation.mutate(
      {
        ...currentValues,
        receiveNotificationOnEpisodeAiring: checked,
      },
      {
        onSuccess: () => {
          updateSetting('receiveNotificationOnEpisodeAiring', checked);
        }
      }
    );
  };

  const handleNewMediaPartNotificationChange = (checked: boolean) => {
    const currentValues = notificationForm.getValues();
    updateNotificationMutation.mutate(
      {
        ...currentValues,
        receiveNotificationOnNewMediaPart: checked,
      },
      {
        onSuccess: () => {
          updateSetting('receiveNotificationOnNewMediaPart', checked);
        }
      }
    );
  };

  if (!settings) return <Loading variant="card" lines={3} />;

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h4 className="text-sm font-medium mb-2">Bildirim Tercihleri</h4>
        <p className="text-xs text-muted-foreground mb-3">Hangi olaylarda bildirim almak istersiniz?</p>
        <Form {...notificationForm}>
          <FormField
            control={notificationForm.control}
            name="receiveNotificationOnNewFollow"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row items-center justify-between rounded-md border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">Yeni takipçi</FormLabel>
                    <div className="text-xs text-muted-foreground">Biri sizi takip ettiğinde</div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={handleNewFollowNotificationChange} disabled={updateNotificationMutation.isPending} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={notificationForm.control}
            name="receiveNotificationOnEpisodeAiring"
            render={({ field }) => (
              <FormItem>
                <div className="mt-3 flex flex-row items-center justify-between rounded-md border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">Bölüm yayını</FormLabel>
                    <div className="text-xs text-muted-foreground">Takip edilen anime yeni bölüm</div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={handleEpisodeAiringNotificationChange} disabled={updateNotificationMutation.isPending} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={notificationForm.control}
            name="receiveNotificationOnNewMediaPart"
            render={({ field }) => (
              <FormItem>
                <div className="mt-3 flex flex-row items-center justify-between rounded-md border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">Yeni medya parçası</FormLabel>
                    <div className="text-xs text-muted-foreground">Takip edilen animeye yeni parça</div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={handleNewMediaPartNotificationChange} disabled={updateNotificationMutation.isPending} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        </Form>
      </Card>
    </div>
  );
} 