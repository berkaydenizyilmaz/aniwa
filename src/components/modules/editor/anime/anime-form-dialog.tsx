'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AnimeSeries, Genre, Tag, Studio } from '@prisma/client';
import { useLoadingStore } from '@/lib/stores/loading.store';
import { LOADING_KEYS } from '@/lib/constants/loading.constants';
import { toast } from 'sonner';
import { createAnimeSeriesAction, updateAnimeSeriesAction, getAllGenresAction, getAllTagsAction, getAllStudiosAction } from '@/lib/actions/editor/anime.action';
import { CreateAnimeSeriesInput, UpdateAnimeSeriesInput, createAnimeSeriesSchema, updateAnimeSeriesSchema } from '@/lib/schemas/anime.schema';
import { AnimeBasicInfoSection } from './anime-basic-info-section';
import { AnimeMediaSection } from './anime-media-section';
import { AnimeRelationsSection } from './anime-relations-section';

interface AnimeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anime?: AnimeSeries & { genres?: Genre[]; tags?: Tag[]; studios?: Studio[] } | null;
  onSuccess?: () => void;
}

export function AnimeFormDialog({ open, onOpenChange, anime, onSuccess }: AnimeFormDialogProps) {
  const isEdit = !!anime;
  const { setLoading: setLoadingStore, isLoading } = useLoadingStore();

  // İlişki verileri için state'ler
  const [genres, setGenres] = useState<Genre[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [studios, setStudios] = useState<Studio[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CreateAnimeSeriesInput | UpdateAnimeSeriesInput>({
    resolver: zodResolver(isEdit ? updateAnimeSeriesSchema : createAnimeSeriesSchema),
    defaultValues: {
      title: '',
      englishTitle: '',
      japaneseTitle: '',
      synonyms: [],
      type: 'TV',
      status: 'FINISHED',
      episodes: 0,
      duration: 0,
      isAdult: false,
      season: 'SPRING',
      seasonYear: new Date().getFullYear(),
      source: 'ORIGINAL',
      countryOfOrigin: 'Japan',
      description: '',
      isMultiPart: false,
    },
  });

  const watchedType = watch('type');

  // Tür değiştiğinde sezon, yıl ve bölüm sayısı alanlarını güncelle
  useEffect(() => {
    if (watchedType === 'MOVIE') {
      setValue('season', undefined);
      setValue('seasonYear', undefined);
      setValue('episodes', 1); // Film için bölüm sayısı 1
    } else if (watchedType && !watch('season')) {
      setValue('season', 'SPRING');
      setValue('seasonYear', new Date().getFullYear());
    }
  }, [watchedType, setValue, watch]);

  // Form'u anime verisi ile doldur (edit mode)
  useEffect(() => {
    if (anime) {
      reset({
        title: anime.title,
        englishTitle: anime.englishTitle || '',
        japaneseTitle: anime.japaneseTitle || '',
        synonyms: anime.synonyms || [],
        type: anime.type,
        status: anime.status,
        episodes: anime.episodes || 0,
        duration: anime.duration || 0,
        isAdult: anime.isAdult || false,
        season: anime.season || (anime.type !== 'MOVIE' ? 'SPRING' : undefined),
        seasonYear: anime.seasonYear || (anime.type !== 'MOVIE' ? new Date().getFullYear() : undefined),
        releaseDate: anime.releaseDate ? new Date(anime.releaseDate) : undefined,
        source: anime.source || 'ORIGINAL',
        countryOfOrigin: anime.countryOfOrigin || 'Japan',
        description: anime.description || '',
        isMultiPart: anime.isMultiPart,
        coverImage: anime.coverImage || '',
        bannerImage: anime.bannerImage || '',
        trailer: anime.trailer || '',
        genreIds: anime.genres?.map(g => g.id) || [],
        tagIds: anime.tags?.map(t => t.id) || [],
        studioIds: anime.studios?.map(s => s.id) || [],
      });
    } else {
      // Yeni anime için form'u sıfırla
      reset({
        title: '',
        englishTitle: '',
        japaneseTitle: '',
        synonyms: [],
        type: 'TV',
        status: 'FINISHED',
        episodes: 0,
        duration: 0,
        isAdult: false,
        season: 'SPRING',
        seasonYear: new Date().getFullYear(),
        source: 'ORIGINAL',
        countryOfOrigin: 'Japan',
        description: '',
        isMultiPart: false,
        coverImage: '',
        bannerImage: '',
        trailer: '',
        genreIds: [],
        tagIds: [],
        studioIds: [],
      });
    }
  }, [anime, reset]);

  // İlişki verilerini yükle
  useEffect(() => {
    const loadRelationData = async () => {
      try {
        const [genresData, tagsData, studiosData] = await Promise.all([
          getAllGenresAction(),
          getAllTagsAction(),
          getAllStudiosAction(),
        ]);

        if (genresData.success && genresData.data) setGenres(genresData.data.genres);
        if (tagsData.success && tagsData.data) setTags(tagsData.data.tags);
        if (studiosData.success && studiosData.data) setStudios(studiosData.data.studios);
      } catch (error) {
        console.error('İlişki verileri yüklenirken hata:', error);
        toast.error('İlişki verileri yüklenemedi');
      }
    };

    if (open) {
      loadRelationData();
    }
  }, [open]);

  const onSubmit = async (data: CreateAnimeSeriesInput | UpdateAnimeSeriesInput) => {
    try {
      setLoadingStore(LOADING_KEYS.FORMS.CREATE_ANIME, true);

      if (isEdit && anime) {
        const result = await updateAnimeSeriesAction(anime.id, data);
        if (result.success) {
          toast.success('Anime başarıyla güncellendi');
          onSuccess?.();
          onOpenChange(false);
        } else {
          toast.error(result.error || 'Anime güncellenirken hata oluştu');
        }
      } else {
        const result = await createAnimeSeriesAction(data);
        if (result.success) {
          toast.success('Anime başarıyla oluşturuldu');
          onSuccess?.();
          onOpenChange(false);
        } else {
          toast.error(result.error || 'Anime oluşturulurken hata oluştu');
        }
      }
    } catch (error) {
      console.error('Form gönderilirken hata:', error);
      toast.error('Beklenmedik bir hata oluştu');
    } finally {
      setLoadingStore(LOADING_KEYS.FORMS.CREATE_ANIME, false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Anime Düzenle' : 'Yeni Anime Ekle'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Temel Bilgiler */}
          <AnimeBasicInfoSection 
            form={{ register, watch, setValue, formState: { errors } }} 
            isLoading={isLoading} 
          />

          {/* Görsel İçerik */}
          <AnimeMediaSection 
            form={{ register, formState: { errors } }} 
            isLoading={isLoading} 
          />

          {/* İlişkiler */}
          <AnimeRelationsSection 
            form={{ watch, setValue, formState: { errors } }}
            isLoading={isLoading}
            genres={genres}
            tags={tags}
            studios={studios}
          />

          {/* Butonlar */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
            >
              {isLoading(LOADING_KEYS.FORMS.CREATE_ANIME) ? 'Kaydediliyor...' : (isEdit ? 'Güncelle' : 'Oluştur')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 