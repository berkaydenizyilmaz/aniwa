'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createStreamingPlatformAction, updateStreamingPlatformAction } from '@/lib/actions/streaming-platform.action';
import { createStreamingPlatformSchema, updateStreamingPlatformSchema, type CreateStreamingPlatformInput, type UpdateStreamingPlatformInput } from '@/lib/schemas/streaming.schema';
import { toast } from 'sonner';
import { useLoadingStore } from '@/lib/stores/loading.store';
import { LOADING_KEYS } from '@/lib/constants/loading.constants';
import { StreamingPlatform } from '@prisma/client';

interface StreamingPlatformFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform?: StreamingPlatform | null;
  onSuccess?: () => void;
}

export function StreamingPlatformFormDialog({ open, onOpenChange, platform, onSuccess }: StreamingPlatformFormDialogProps) {
  const { setLoading: setLoadingStore, isLoading } = useLoadingStore();

  const isEditing = !!platform;
  const loadingKey = isEditing ? LOADING_KEYS.FORMS.UPDATE_STREAMING_PLATFORM : LOADING_KEYS.FORMS.CREATE_STREAMING_PLATFORM;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateStreamingPlatformInput | UpdateStreamingPlatformInput>({
    resolver: zodResolver(isEditing ? updateStreamingPlatformSchema : createStreamingPlatformSchema),
    defaultValues: {
      name: '',
      baseUrl: '',
    },
  });

  // Platform değiştiğinde form'u güncelle
  useEffect(() => {
    if (platform) {
      reset({
        name: platform.name,
        baseUrl: platform.baseUrl,
      });
    } else {
      reset({
        name: '',
        baseUrl: '',
      });
    }
  }, [platform, reset]);

  const onSubmit = async (data: CreateStreamingPlatformInput | UpdateStreamingPlatformInput) => {
    if (isLoading(loadingKey)) return;

    setLoadingStore(loadingKey, true);

    try {
      let result;

      if (isEditing && platform) {
        result = await updateStreamingPlatformAction(platform.id, data as UpdateStreamingPlatformInput);
      } else {
        result = await createStreamingPlatformAction(data as CreateStreamingPlatformInput);
      }

      if (!result.success) {
        toast.error(result.error || 'İşlem başarısız oldu');
        return;
      }

      toast.success(isEditing ? 'Platform başarıyla güncellendi!' : 'Platform başarıyla oluşturuldu!');
      onSuccess?.();
      onOpenChange(false);
      reset();

    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoadingStore(loadingKey, false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Platform Düzenle' : 'Yeni Platform Ekle'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Platform bilgilerini güncelleyin.' : 'Yeni bir streaming platformu ekleyin.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Platform Adı */}
          <div className="space-y-2">
            <Label htmlFor="name">Platform Adı</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Örn: Netflix, Crunchyroll"
              disabled={isLoading(loadingKey)}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Base URL */}
          <div className="space-y-2">
            <Label htmlFor="baseUrl">Base URL</Label>
            <Input
              id="baseUrl"
              {...register('baseUrl')}
              placeholder="https://www.example.com"
              disabled={isLoading(loadingKey)}
            />
            {errors.baseUrl && (
              <p className="text-sm text-destructive">{errors.baseUrl.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading(loadingKey)}
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={isLoading(loadingKey)}
            >
              {isEditing ? 'Güncelle' : 'Oluştur'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 