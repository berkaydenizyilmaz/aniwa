'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
} from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createAnimeSeriesAction, updateAnimeSeriesAction, getAnimeSeriesRelationsAction, getAnimeSeriesWithRelationsAction } from '@/lib/actions/editor/anime-series.action';
import { createAnimeSeriesSchema, updateAnimeSeriesSchema, type CreateAnimeSeriesInput, type UpdateAnimeSeriesInput } from '@/lib/schemas/anime.schema';
import { toast } from 'sonner';
import { AnimeSeries } from '@prisma/client';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { AnimeSeriesBasicInfo } from './anime-series-form-components/anime-series-basic-info';
import { AnimeSeriesMedia } from './anime-series-form-components/anime-series-media';
import { AnimeSeriesRelations } from './anime-series-form-components/anime-series-relations';

interface AnimeSeriesFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animeSeries?: AnimeSeries | null;
  onSuccess?: () => void;
}

export function AnimeSeriesFormDialog({ open, onOpenChange, animeSeries, onSuccess }: AnimeSeriesFormDialogProps) {
  const queryClient = useQueryClient();

  // İlişkileri getir (genres, studios, tags)
  const { data: relations } = useQuery({
    queryKey: ['anime-series-relations'],
    queryFn: async () => {
      const result = await getAnimeSeriesRelationsAction();
      if (!result.success) {
        throw new Error(result.error || 'İlişkiler yüklenirken bir hata oluştu');
      }
      return result.data as {
        genres: Array<{ id: string; name: string }>;
        studios: Array<{ id: string; name: string }>;
        tags: Array<{ id: string; name: string }>;
      };
    },
    staleTime: 5 * 60 * 1000, // 5 dakika
  });

  // Edit mode'da anime detaylarını getir
  const { data: animeSeriesWithRelations, isLoading: isLoadingAnimeSeries } = useQuery({
    queryKey: ['anime-series-with-relations', animeSeries?.id],
    queryFn: async () => {
      if (!animeSeries?.id) return null;
      const result = await getAnimeSeriesWithRelationsAction(animeSeries.id);
      if (!result.success) {
        throw new Error(result.error || 'Anime detayları yüklenirken bir hata oluştu');
      }
      return result.data as {
        id: string;
        title: string;
        englishTitle?: string;
        japaneseTitle?: string;
        synopsis?: string;
        type: any;
        status: any;
        releaseDate?: Date;
        season?: any;
        seasonYear?: number;
        source?: any;
        countryOfOrigin?: any;
        isAdult?: boolean;
        trailer?: string;
        synonyms: string[];
        animeGenres?: Array<{ genre: { id: string } }>;
        animeStudios?: Array<{ studio: { id: string } }>;
        animeTags?: Array<{ tag: { id: string } }>;
      };
    },
    enabled: !!animeSeries?.id,
    staleTime: 5 * 60 * 1000, // 5 dakika
  });

  const form = useForm<CreateAnimeSeriesInput | UpdateAnimeSeriesInput>({
    resolver: zodResolver(animeSeries ? updateAnimeSeriesSchema : createAnimeSeriesSchema),
    defaultValues: {
      title: '',
      englishTitle: '',
      japaneseTitle: '',
      synopsis: '',
      type: undefined,
      status: undefined,
      season: undefined,
      year: undefined,
      source: undefined,
      countryOfOrigin: undefined,
      isAdult: false,
      trailer: '',
      synonyms: [],
      coverImageFile: null,
      bannerImageFile: null,
      genres: [],
      studios: [],
      tags: [],
    },
  });

  // Form'u anime series verisi ile doldur (edit mode)
  useEffect(() => {
    if (animeSeriesWithRelations) {
      form.reset({
        title: animeSeriesWithRelations.title,
        englishTitle: animeSeriesWithRelations.englishTitle || '',
        japaneseTitle: animeSeriesWithRelations.japaneseTitle || '',
        synopsis: animeSeriesWithRelations.synopsis || '',
        type: animeSeriesWithRelations.type,
        status: animeSeriesWithRelations.status,
        releaseDate: animeSeriesWithRelations.releaseDate || undefined,
        season: animeSeriesWithRelations.season || undefined,
        year: animeSeriesWithRelations.seasonYear || undefined,
        source: animeSeriesWithRelations.source || undefined,
        countryOfOrigin: animeSeriesWithRelations.countryOfOrigin || undefined,
        isAdult: animeSeriesWithRelations.isAdult || false,
        trailer: animeSeriesWithRelations.trailer || '',
        synonyms: animeSeriesWithRelations.synonyms || [],
        // İlişkileri doldur
        genres: animeSeriesWithRelations.animeGenres?.map(ag => ag.genre.id) || [],
        studios: animeSeriesWithRelations.animeStudios?.map(as => as.studio.id) || [],
        tags: animeSeriesWithRelations.animeTags?.map(at => at.tag.id) || [],
      });
    } else if (!animeSeries) {
      form.reset({
        title: '',
        englishTitle: '',
        japaneseTitle: '',
        synopsis: '',
        type: undefined,
        status: undefined,
        releaseDate: undefined,
        season: undefined,
        year: undefined,
        source: undefined,
        countryOfOrigin: undefined,
        isAdult: false,
        trailer: '',
        synonyms: [],
        coverImageFile: null,
        bannerImageFile: null,
        genres: [],
        studios: [],
        tags: [],
      });
    }
  }, [animeSeriesWithRelations, animeSeries, form]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createAnimeSeriesAction,
    onSuccess: () => {
      toast.success('Anime serisi başarıyla oluşturuldu');
      onOpenChange(false);
      onSuccess?.();
      // Cache'i temizle
      queryClient.invalidateQueries({ queryKey: ['anime-series-list'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Anime serisi oluşturulurken bir hata oluştu');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: UpdateAnimeSeriesInput) => {
      return updateAnimeSeriesAction(animeSeries!.id, data);
    },
    onSuccess: () => {
      toast.success('Anime serisi başarıyla güncellendi');
      onOpenChange(false);
      onSuccess?.();
      // Cache'i temizle
      queryClient.invalidateQueries({ queryKey: ['anime-series-list'] });
      queryClient.invalidateQueries({ queryKey: ['anime-series-with-relations', animeSeries?.id] });
    },
    onError: (error) => {
      toast.error(error.message || 'Anime serisi güncellenirken bir hata oluştu');
    },
  });

  const onSubmit = async (data: CreateAnimeSeriesInput | UpdateAnimeSeriesInput) => {
    if (animeSeries) {
      // Güncelleme
      updateMutation.mutate(data as UpdateAnimeSeriesInput);
    } else {
      // Oluşturma
      createMutation.mutate(data as CreateAnimeSeriesInput);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {animeSeries ? 'Anime Serisini Düzenle' : 'Yeni Anime Serisi Oluştur'}
          </DialogTitle>
        </DialogHeader>

        {animeSeries && isLoadingAnimeSeries ? (
          <div className="space-y-6">
            <div className="text-center py-8">
              <Skeleton className="h-4 w-32 mx-auto mb-2" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Temel Bilgiler */}
              <AnimeSeriesBasicInfo />

              {/* Medya */}
              <AnimeSeriesMedia isPending={isPending} />

              {/* İlişkiler */}
              <AnimeSeriesRelations relations={relations} />

              {/* Butonlar */}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isPending}
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                >
                  {animeSeries ? 'Güncelle' : 'Oluştur'}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
} 