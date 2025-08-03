'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createStreamingLinkAction, updateStreamingLinkAction, getStreamingLinkAction, getStreamingPlatformsAction } from '@/lib/actions/editor/streaming-link.action';
import { createStreamingLinkSchema, updateStreamingLinkSchema, type CreateStreamingLinkInput, type UpdateStreamingLinkInput } from '@/lib/schemas/anime.schema';
import { toast } from 'sonner';
import { StreamingLink } from '@prisma/client';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GetStreamingPlatformsResponse } from '@/lib/types/api/anime.api';

interface StreamingLinkFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  episodeId: string;
  streamingLink?: StreamingLink | null;
  onSuccess?: () => void;
}

export function StreamingLinkFormDialog({ open, onOpenChange, episodeId, streamingLink, onSuccess }: StreamingLinkFormDialogProps) {
  const queryClient = useQueryClient();

  // Edit mode'da streaming link detaylarını getir
  const { data: streamingLinkData, isLoading: isLoadingStreamingLink } = useQuery({
    queryKey: ['streaming-link', streamingLink?.id],
    queryFn: async () => {
      if (!streamingLink?.id) return null;
      const result = await getStreamingLinkAction(streamingLink.id);
      if (!result.success) {
        throw new Error(result.error || 'Streaming link detayları yüklenirken bir hata oluştu');
      }
      return result.data as StreamingLink;
    },
    enabled: !!streamingLink?.id,
    staleTime: 5 * 60 * 1000, // 5 dakika
  });

  // Platform'ları getir
  const { data: platformsData, isLoading: isLoadingPlatforms } = useQuery({
    queryKey: ['streaming-platforms'],
    queryFn: async () => {
      const result = await getStreamingPlatformsAction();
      if (!result.success) {
        throw new Error(result.error || 'Platform\'lar yüklenirken bir hata oluştu');
      }
      return result.data as GetStreamingPlatformsResponse;
    },
    staleTime: 5 * 60 * 1000, // 5 dakika
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors }
  } = useForm<CreateStreamingLinkInput | UpdateStreamingLinkInput>({
    resolver: zodResolver(streamingLink ? updateStreamingLinkSchema : createStreamingLinkSchema),
    defaultValues: {
      episodeId: episodeId,
      platformId: '',
      url: '',
    }
  });

  // Edit mode'da form'u doldur
  useEffect(() => {
    if (streamingLinkData && streamingLink) {
      setValue('platformId', streamingLinkData.platformId);
      setValue('url', streamingLinkData.url);
    } else {
      // Create mode'da form'u temizle
      reset({
        episodeId: episodeId,
        platformId: '',
        url: '',
      });
    }
  }, [streamingLinkData, streamingLink, setValue, reset, episodeId]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createStreamingLinkAction,
    onSuccess: () => {
      toast.success('Streaming link başarıyla oluşturuldu!');
      onSuccess?.();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ['streaming-links'] });
    },
    onError: (error) => {
      console.error('Create streaming link error:', error);
      toast.error('Oluşturma işlemi sırasında bir hata oluştu');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStreamingLinkInput }) =>
      updateStreamingLinkAction(id, data),
    onSuccess: () => {
      toast.success('Streaming link başarıyla güncellendi!');
      onSuccess?.();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ['streaming-links'] });
    },
    onError: (error) => {
      console.error('Update streaming link error:', error);
      toast.error('Güncelleme işlemi sırasında bir hata oluştu');
    },
  });

  const onSubmit = async (data: CreateStreamingLinkInput | UpdateStreamingLinkInput) => {
    if (streamingLink) {
      // Update
      updateMutation.mutate({ id: streamingLink.id, data: data as UpdateStreamingLinkInput });
    } else {
      // Create
      createMutation.mutate(data as CreateStreamingLinkInput);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {streamingLink ? 'Streaming Link Düzenle' : 'Yeni Streaming Link Oluştur'}
          </DialogTitle>
        </DialogHeader>

        {streamingLink && isLoadingStreamingLink ? (
          <div className="space-y-6">
            <div className="text-center py-8">
              <Skeleton className="h-4 w-32 mx-auto mb-2" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Platform Seçimi */}
            <div className="space-y-2">
              <Label htmlFor="platformId">Platform</Label>
              <Controller
                name="platformId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoadingPlatforms}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Platform seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {platformsData?.platforms?.map((platform) => (
                        <SelectItem key={platform.id} value={platform.id}>
                          {platform.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.platformId && (
                <p className="text-sm text-destructive">{errors.platformId.message}</p>
              )}
            </div>

            {/* URL */}
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/episode"
                {...register('url')}
              />
              {errors.url && (
                <p className="text-sm text-destructive">{errors.url.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-2">
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
                {createMutation.isPending || updateMutation.isPending
                  ? 'Kaydediliyor...'
                  : streamingLink
                  ? 'Güncelle'
                  : 'Oluştur'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
} 