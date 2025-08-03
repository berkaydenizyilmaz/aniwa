'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createEpisodeAction, updateEpisodeAction, getEpisodeAction } from '@/lib/actions/editor/episode.action';
import { createEpisodeSchema, updateEpisodeSchema, type CreateEpisodeInput, type UpdateEpisodeInput } from '@/lib/schemas/anime.schema';
import { toast } from 'sonner';
import { Episode } from '@prisma/client';
import { UPLOAD_CONFIGS } from '@/lib/constants/cloudinary.constants';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

interface EpisodeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaPartId: string;
  episode?: Episode | null;
  onSuccess?: () => void;
}

export function EpisodeFormDialog({ open, onOpenChange, mediaPartId, episode, onSuccess }: EpisodeFormDialogProps) {
  const queryClient = useQueryClient();

  // Edit mode'da episode detaylarını getir
  const { data: episodeData } = useQuery({
    queryKey: ['episode', episode?.id],
    queryFn: async () => {
      if (!episode?.id) return null;
      const result = await getEpisodeAction(episode.id);
      if (!result.success) {
        throw new Error(result.error || 'Episode detayları yüklenirken bir hata oluştu');
      }
      return result.data as Episode;
    },
    enabled: !!episode?.id,
    staleTime: 5 * 60 * 1000, // 5 dakika
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors }
  } = useForm<CreateEpisodeInput | UpdateEpisodeInput>({
    resolver: zodResolver(episode ? updateEpisodeSchema : createEpisodeSchema),
    defaultValues: {
      mediaPartId: mediaPartId,
      episodeNumber: undefined,
      title: '',
      description: '',
      airDate: undefined,
      duration: undefined,
      isFiller: false,
      fillerNotes: '',
    }
  });

  // Edit mode'da form'u doldur
  useEffect(() => {
    if (episodeData && episode) {
      setValue('episodeNumber', episodeData.episodeNumber);
      setValue('title', episodeData.title || '');
      setValue('description', episodeData.description || '');
      setValue('airDate', episodeData.airDate || undefined);
      setValue('duration', episodeData.duration || undefined);
      setValue('isFiller', episodeData.isFiller);
      setValue('fillerNotes', episodeData.fillerNotes || '');
    } else {
      // Create mode'da form'u temizle
      reset({
        mediaPartId: mediaPartId,
        episodeNumber: undefined,
        title: '',
        description: '',
        airDate: undefined,
        duration: undefined,
        isFiller: false,
        fillerNotes: '',
      });
    }
  }, [episodeData, episode, setValue, reset, mediaPartId]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createEpisodeAction,
    onSuccess: () => {
      toast.success('Episode başarıyla oluşturuldu');
      onOpenChange(false);
      onSuccess?.();
      // Cache'i temizle
      queryClient.invalidateQueries({ queryKey: ['episodes'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Episode oluşturulurken bir hata oluştu');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: UpdateEpisodeInput) => {
      return updateEpisodeAction(episode!.id, data);
    },
    onSuccess: () => {
      toast.success('Episode başarıyla güncellendi');
      onOpenChange(false);
      onSuccess?.();
      // Cache'i temizle
      queryClient.invalidateQueries({ queryKey: ['episodes'] });
      queryClient.invalidateQueries({ queryKey: ['episode', episode?.id] });
    },
    onError: (error) => {
      toast.error(error.message || 'Episode güncellenirken bir hata oluştu');
    },
  });

  const onSubmit = async (data: CreateEpisodeInput | UpdateEpisodeInput) => {
    if (episode) {
      // Güncelleme
      updateMutation.mutate(data as UpdateEpisodeInput);
    } else {
      // Oluşturma
      createMutation.mutate(data as CreateEpisodeInput);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {episode ? 'Episode Düzenle' : 'Yeni Episode Oluştur'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Bölüm Numarası */}
          <div className="space-y-2">
            <Label htmlFor="episodeNumber">Bölüm Numarası *</Label>
            <Input
              id="episodeNumber"
              type="number"
              {...register('episodeNumber', { valueAsNumber: true })}
              placeholder="1"
              min="1"
            />
            {errors.episodeNumber && (
              <p className="text-sm text-destructive">{errors.episodeNumber.message}</p>
            )}
          </div>

          {/* Başlık */}
          <div className="space-y-2">
            <Label htmlFor="title">Başlık</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Episode başlığı"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Açıklama */}
          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Episode açıklaması..."
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Thumbnail Image */}
          <div className="space-y-2">
            <Label>Thumbnail</Label>
            <Controller
              name="thumbnailImageFile"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  id="thumbnailImage"
                  label="Episode thumbnail"
                  accept="image/*"
                  maxSize={UPLOAD_CONFIGS.EPISODE_THUMBNAIL.maxSize}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          {/* Yayın Tarihi ve Süre */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="airDate">Yayın Tarihi</Label>
              <Input
                id="airDate"
                type="date"
                {...register('airDate', { valueAsDate: true })}
              />
              {errors.airDate && (
                <p className="text-sm text-destructive">{errors.airDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Süre (dakika)</Label>
              <Input
                id="duration"
                type="number"
                {...register('duration', { valueAsNumber: true })}
                placeholder="24"
                min="1"
              />
              {errors.duration && (
                <p className="text-sm text-destructive">{errors.duration.message}</p>
              )}
            </div>
          </div>

          {/* Filler */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Controller
                name="isFiller"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="isFiller"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="isFiller">Filler Episode</Label>
            </div>
            {errors.isFiller && (
              <p className="text-sm text-destructive">{errors.isFiller.message}</p>
            )}
          </div>

          {/* Filler Notları */}
          <div className="space-y-2">
            <Label htmlFor="fillerNotes">Filler Notları</Label>
            <Textarea
              id="fillerNotes"
              {...register('fillerNotes')}
              placeholder="Filler episode hakkında notlar..."
              rows={2}
            />
            {errors.fillerNotes && (
              <p className="text-sm text-destructive">{errors.fillerNotes.message}</p>
            )}
          </div>

          {/* Butonlar */}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? 'Kaydediliyor...' : (episode ? 'Güncelle' : 'Oluştur')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 