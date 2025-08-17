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
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageUpload } from '@/components/ui/image-upload';

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
  const { data: episodeData, isLoading: isLoadingEpisode } = useQuery({
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

  const form = useForm<CreateEpisodeInput | UpdateEpisodeInput>({
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

  // Form'u güncelle
  useEffect(() => {
    if (!open) return;

    if (episodeData && episode) {
      // Edit mode - mevcut verileri doldur
      form.reset({
        mediaPartId: mediaPartId,
        episodeNumber: episodeData.episodeNumber,
        title: episodeData.title || '',
        description: episodeData.description || '',
        airDate: episodeData.airDate || undefined,
        duration: episodeData.duration || undefined,
        isFiller: episodeData.isFiller,
        fillerNotes: episodeData.fillerNotes || '',
      });
    } else {
      // Create mode - temiz form
      form.reset({
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
  }, [open, episodeData, episode, form, mediaPartId]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: CreateEpisodeInput) => {
      // File'ı direkt gönder - server action File objelerini handle edebilir
      return createEpisodeAction(data);
    },
    onSuccess: () => {
      toast.success('Bölüm başarıyla oluşturuldu');
      onOpenChange(false);
      onSuccess?.();
      // Cache'i temizle
      queryClient.invalidateQueries({ queryKey: ['episodes'] });
    },
    onError: (error) => {
      console.error('Episode create error:', error);
      toast.error(error.message || 'Episode oluşturulurken bir hata oluştu');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: UpdateEpisodeInput) => {
      // File'ı direkt gönder - server action File objelerini handle edebilir
      return updateEpisodeAction(episode!.id, data);
    },
    onSuccess: () => {
      toast.success('Bölüm başarıyla güncellendi');
      onOpenChange(false);
      onSuccess?.();
      // Cache'i temizle
      queryClient.invalidateQueries({ queryKey: ['episodes'] });
      queryClient.invalidateQueries({ queryKey: ['episode', episode?.id] });
    },
    onError: (error) => {
      console.error('Episode update error:', error);
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
            {episode ? 'Bölüm Düzenle' : 'Yeni Bölüm Oluştur'}
          </DialogTitle>
        </DialogHeader>

        {episode && isLoadingEpisode ? (
          <div className="space-y-6">
            <div className="text-center py-8">
              <Skeleton className="h-4 w-32 mx-auto mb-2" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Bölüm Numarası */}
              <FormField
                control={form.control}
                name="episodeNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bölüm Numarası *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1"
                        min="1"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Başlık */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Başlık</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Episode başlığı"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Açıklama */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Açıklama</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Episode açıklaması..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Thumbnail Image */}
              <FormField
                control={form.control}
                name="thumbnailImageFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <ImageUpload
                        category="EPISODE_THUMBNAIL"
                        value={field.value ? URL.createObjectURL(field.value) : undefined}
                        onChange={(file) => field.onChange(file)}
                        disabled={createMutation.isPending || updateMutation.isPending}
                        placeholder="Episode thumbnail seçin"
                        showProgress={createMutation.isPending || updateMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Yayın Tarihi ve Süre */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="airDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yayın Tarihi</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={field.value ? field.value.toISOString().split('T')[0] : ''}
                          onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Süre (dakika)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="24"
                          min="1"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Filler */}
              <FormField
                control={form.control}
                name="isFiller"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Filler Episode</FormLabel>
                  </FormItem>
                )}
              />

              {/* Filler Notları */}
              <FormField
                control={form.control}
                name="fillerNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Filler Notları</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Filler episode hakkında notlar..."
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                  {episode ? 'Güncelle' : 'Oluştur'}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
} 