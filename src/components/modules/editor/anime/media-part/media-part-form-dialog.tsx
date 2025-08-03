'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createAnimeMediaPartAction, updateAnimeMediaPartAction, getAnimeMediaPartAction } from '@/lib/actions/editor/anime-media-part.action';
import { createAnimeMediaPartSchema, updateAnimeMediaPartSchema, type CreateAnimeMediaPartInput, type UpdateAnimeMediaPartInput } from '@/lib/schemas/anime.schema';
import { toast } from 'sonner';
import { AnimeMediaPart } from '@prisma/client';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

interface MediaPartFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seriesId: string;
  mediaPart?: AnimeMediaPart | null;
  onSuccess?: () => void;
}

export function MediaPartFormDialog({ open, onOpenChange, seriesId, mediaPart, onSuccess }: MediaPartFormDialogProps) {
  const queryClient = useQueryClient();

  // Edit mode'da media part detaylarını getir
  const { data: mediaPartData, isLoading: isLoadingMediaPart } = useQuery({
    queryKey: ['anime-media-part', mediaPart?.id],
    queryFn: async () => {
      if (!mediaPart?.id) return null;
      const result = await getAnimeMediaPartAction(mediaPart.id);
      if (!result.success) {
        throw new Error(result.error || 'Media part detayları yüklenirken bir hata oluştu');
      }
      return result.data as AnimeMediaPart;
    },
    enabled: !!mediaPart?.id,
    staleTime: 5 * 60 * 1000, // 5 dakika
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<CreateAnimeMediaPartInput | UpdateAnimeMediaPartInput>({
    resolver: zodResolver(mediaPart ? updateAnimeMediaPartSchema : createAnimeMediaPartSchema),
    defaultValues: {
      seriesId: seriesId,
      title: '',
      displayOrder: undefined,
      notes: '',
      episodes: undefined,
      anilistId: undefined,
      malId: undefined,
      anilistAverageScore: undefined,
      anilistPopularity: undefined,
    }
  });

  // Edit mode'da form'u doldur
  useEffect(() => {
    if (mediaPartData && mediaPart) {
      setValue('title', mediaPartData.title);
      setValue('displayOrder', mediaPartData.displayOrder || undefined);
      setValue('notes', mediaPartData.notes || '');
      setValue('episodes', mediaPartData.episodes || undefined);
      setValue('anilistId', mediaPartData.anilistId || undefined);
      setValue('malId', mediaPartData.malId || undefined);
      setValue('anilistAverageScore', mediaPartData.anilistAverageScore || undefined);
      setValue('anilistPopularity', mediaPartData.anilistPopularity || undefined);
    } else {
             // Create mode'da form'u temizle
       reset({
         seriesId: seriesId,
         title: '',
         displayOrder: undefined,
         notes: '',
         episodes: undefined,
         anilistId: undefined,
         malId: undefined,
         anilistAverageScore: undefined,
         anilistPopularity: undefined,
       });
    }
  }, [mediaPartData, mediaPart, setValue, reset, seriesId]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createAnimeMediaPartAction,
    onSuccess: () => {
      toast.success('Media part başarıyla oluşturuldu');
      onOpenChange(false);
      onSuccess?.();
      // Cache'i temizle
      queryClient.invalidateQueries({ queryKey: ['anime-media-parts'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Media part oluşturulurken bir hata oluştu');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: UpdateAnimeMediaPartInput) => {
      return updateAnimeMediaPartAction(mediaPart!.id, data);
    },
    onSuccess: () => {
      toast.success('Media part başarıyla güncellendi');
      onOpenChange(false);
      onSuccess?.();
      // Cache'i temizle
      queryClient.invalidateQueries({ queryKey: ['anime-media-parts'] });
      queryClient.invalidateQueries({ queryKey: ['anime-media-part', mediaPart?.id] });
    },
    onError: (error) => {
      toast.error(error.message || 'Media part güncellenirken bir hata oluştu');
    },
  });

  const onSubmit = async (data: CreateAnimeMediaPartInput | UpdateAnimeMediaPartInput) => {
    if (mediaPart) {
      // Güncelleme
      updateMutation.mutate(data as UpdateAnimeMediaPartInput);
    } else {
      // Oluşturma
      createMutation.mutate(data as CreateAnimeMediaPartInput);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mediaPart ? 'Media Part Düzenle' : 'Yeni Media Part Oluştur'}
          </DialogTitle>
        </DialogHeader>

        {mediaPart && isLoadingMediaPart ? (
          <div className="space-y-6">
            <div className="text-center py-8">
              <Skeleton className="h-4 w-32 mx-auto mb-2" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Başlık */}
          <div className="space-y-2">
            <Label htmlFor="title">Başlık *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Media part başlığı"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* İzleme Sırası */}
          <div className="space-y-2">
            <Label htmlFor="displayOrder">İzleme Sırası</Label>
            <Input
              id="displayOrder"
              type="number"
              {...register('displayOrder', { valueAsNumber: true })}
              placeholder="1"
              min="1"
            />
            {errors.displayOrder && (
              <p className="text-sm text-destructive">{errors.displayOrder.message}</p>
            )}
          </div>

          {/* Notlar */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notlar</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Ek notlar..."
              rows={3}
            />
            {errors.notes && (
              <p className="text-sm text-destructive">{errors.notes.message}</p>
            )}
          </div>

          {/* Bölüm Sayısı */}
          <div className="space-y-2">
            <Label htmlFor="episodes">Bölüm Sayısı</Label>
            <Input
              id="episodes"
              type="number"
              {...register('episodes', { valueAsNumber: true })}
              placeholder="12"
              min="1"
            />
            {errors.episodes && (
              <p className="text-sm text-destructive">{errors.episodes.message}</p>
            )}
          </div>

          {/* Anilist ve MAL ID */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="anilistId">Anilist ID</Label>
              <Input
                id="anilistId"
                type="number"
                {...register('anilistId', { valueAsNumber: true })}
                placeholder="12345"
              />
              {errors.anilistId && (
                <p className="text-sm text-destructive">{errors.anilistId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="malId">MAL ID</Label>
              <Input
                id="malId"
                type="number"
                {...register('malId', { valueAsNumber: true })}
                placeholder="67890"
              />
              {errors.malId && (
                <p className="text-sm text-destructive">{errors.malId.message}</p>
              )}
            </div>
          </div>

          {/* Anilist Puanları */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="anilistAverageScore">Anilist Puanı</Label>
              <Input
                id="anilistAverageScore"
                type="number"
                step="0.1"
                {...register('anilistAverageScore', { valueAsNumber: true })}
                placeholder="8.5"
                min="0"
                max="10"
              />
              {errors.anilistAverageScore && (
                <p className="text-sm text-destructive">{errors.anilistAverageScore.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="anilistPopularity">Anilist Popülerlik</Label>
              <Input
                id="anilistPopularity"
                type="number"
                {...register('anilistPopularity', { valueAsNumber: true })}
                placeholder="1000"
                min="0"
              />
              {errors.anilistPopularity && (
                <p className="text-sm text-destructive">{errors.anilistPopularity.message}</p>
              )}
            </div>
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
              {createMutation.isPending || updateMutation.isPending ? 'Kaydediliyor...' : (mediaPart ? 'Güncelle' : 'Oluştur')}
            </Button>
          </div>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
} 