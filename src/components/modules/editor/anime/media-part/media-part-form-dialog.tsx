'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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

  const form = useForm<CreateAnimeMediaPartInput | UpdateAnimeMediaPartInput>({
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
      form.setValue('title', mediaPartData.title);
      form.setValue('displayOrder', mediaPartData.displayOrder || undefined);
      form.setValue('notes', mediaPartData.notes || '');
      form.setValue('episodes', mediaPartData.episodes || undefined);
      form.setValue('anilistId', mediaPartData.anilistId || undefined);
      form.setValue('malId', mediaPartData.malId || undefined);
      form.setValue('anilistAverageScore', mediaPartData.anilistAverageScore || undefined);
      form.setValue('anilistPopularity', mediaPartData.anilistPopularity || undefined);
    } else {
      // Create mode'da form'u temizle
      form.reset({
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
  }, [mediaPartData, mediaPart, form, seriesId]);

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Başlık */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Başlık *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Media part başlığı"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* İzleme Sırası */}
              <FormField
                control={form.control}
                name="displayOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İzleme Sırası *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notlar */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notlar</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ek notlar..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bölüm Sayısı */}
              <FormField
                control={form.control}
                name="episodes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bölüm Sayısı</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="12"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Anilist ve MAL ID */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="anilistId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Anilist ID</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="12345"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="malId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MAL ID</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="67890"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Anilist Puanları */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="anilistAverageScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Anilist Puanı</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="8.5"
                          min="0"
                          max="10"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="anilistPopularity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Anilist Popülerlik</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1000"
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
} 