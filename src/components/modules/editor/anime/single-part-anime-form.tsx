'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createAnimeSeriesAction, updateAnimeSeriesAction } from '@/lib/actions/editor/anime.action';
import { createAnimeSeriesSchema, updateAnimeSeriesSchema, type CreateAnimeSeriesInput, type UpdateAnimeSeriesInput } from '@/lib/schemas/anime.schema';
import { toast } from 'sonner';
import { AnimeSeries, AnimeStatus, Season } from '@prisma/client';
import { useLoadingStore } from '@/lib/stores/loading.store';
import { LOADING_KEYS } from '@/lib/constants/loading.constants';

interface SinglePartAnimeFormProps {
  anime?: AnimeSeries | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function SinglePartAnimeForm({ 
  anime, 
  onSuccess,
  onCancel
}: SinglePartAnimeFormProps) {
  const isEdit = !!anime;
  const { setLoading: setLoadingStore, isLoading } = useLoadingStore();

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
      type: 'MOVIE',
      title: '',
      status: AnimeStatus.RELEASING,
      isAdult: false,
      episodes: 1,
    },
  });

  // Form'u anime verisi ile doldur (edit mode)
  useEffect(() => {
    if (anime) {
      reset({
        type: 'MOVIE',
        title: anime.title,
        englishTitle: anime.englishTitle || '',
        japaneseTitle: anime.japaneseTitle || '',
        synonyms: anime.synonyms || [],
        synopsis: anime.synopsis || '',
        episodes: 1,
        duration: anime.duration || undefined,
        status: anime.status,
        isAdult: anime.isAdult || false,
        season: anime.season || undefined,
        seasonYear: anime.seasonYear || undefined,
        releaseDate: anime.releaseDate || undefined,
        source: anime.source || undefined,
        countryOfOrigin: anime.countryOfOrigin || '',
        anilistAverageScore: anime.anilistAverageScore || undefined,
        anilistPopularity: anime.anilistPopularity || undefined,
        anilistId: anime.anilistId || undefined,
        malId: anime.malId || undefined,
        trailer: anime.trailer || '',
      });
    } else {
      reset({
        type: 'MOVIE',
        title: '',
        englishTitle: '',
        japaneseTitle: '',
        synonyms: [],
        synopsis: '',
        episodes: 1,
        duration: undefined,
        status: AnimeStatus.RELEASING,
        isAdult: false,
        season: undefined,
        seasonYear: undefined,
        releaseDate: undefined,
        source: undefined,
        countryOfOrigin: '',
        anilistAverageScore: undefined,
        anilistPopularity: undefined,
        anilistId: undefined,
        malId: undefined,
        trailer: '',
      });
    }
  }, [anime, reset]);

  const onSubmit = async (data: CreateAnimeSeriesInput | UpdateAnimeSeriesInput) => {
    if (isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)) return;

    setLoadingStore(LOADING_KEYS.FORMS.CREATE_ANIME, true);

    try {
      let result;

      if (isEdit && anime) {
        result = await updateAnimeSeriesAction(anime.id, data);
      } else {
        result = await createAnimeSeriesAction(data);
      }

      if (!result.success) {
        toast.error('error' in result ? result.error : `${isEdit ? 'Güncelleme' : 'Oluşturma'} başarısız oldu`);
        return;
      }

      toast.success(`Film başarıyla ${isEdit ? 'güncellendi' : 'oluşturuldu'}!`);
      onSuccess?.();

    } catch (error) {
      console.error('Film form error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoadingStore(LOADING_KEYS.FORMS.CREATE_ANIME, false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Temel Bilgiler */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Durum */}
        <div className="space-y-2">
          <Label htmlFor="status">Durum *</Label>
          <Select
            value={watch('status')}
            onValueChange={(value) => setValue('status', value as AnimeStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Durum seçin" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(AnimeStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-destructive">{errors.status.message}</p>
          )}
        </div>

        {/* Süre */}
        <div className="space-y-2">
          <Label htmlFor="duration">Süre (dakika)</Label>
          <Input
            id="duration"
            type="number"
            placeholder="Film süresi"
            {...register('duration')}
            disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
          />
          {errors.duration && (
            <p className="text-sm text-destructive">{errors.duration.message}</p>
          )}
        </div>
      </div>

      {/* Başlık */}
      <div className="space-y-2">
        <Label htmlFor="title">Başlık *</Label>
        <Input
          id="title"
          type="text"
          placeholder="Film başlığını girin"
          {...register('title')}
          disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* İngilizce ve Japonca Başlık */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="englishTitle">İngilizce Başlık</Label>
          <Input
            id="englishTitle"
            type="text"
            placeholder="İngilizce başlık"
            {...register('englishTitle')}
            disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
          />
          {errors.englishTitle && (
            <p className="text-sm text-destructive">{errors.englishTitle.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="japaneseTitle">Japonca Başlık</Label>
          <Input
            id="japaneseTitle"
            type="text"
            placeholder="Japonca başlık"
            {...register('japaneseTitle')}
            disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
          />
          {errors.japaneseTitle && (
            <p className="text-sm text-destructive">{errors.japaneseTitle.message}</p>
          )}
        </div>
      </div>

      {/* Sezon ve Yıl */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="season">Sezon</Label>
          <Select
            value={watch('season')}
            onValueChange={(value) => setValue('season', value as Season)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sezon seçin" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Season).map((season) => (
                <SelectItem key={season} value={season}>
                  {season}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.season && (
            <p className="text-sm text-destructive">{errors.season.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="seasonYear">Yıl</Label>
          <Input
            id="seasonYear"
            type="number"
            placeholder="Yıl"
            {...register('seasonYear')}
            disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
          />
          {errors.seasonYear && (
            <p className="text-sm text-destructive">{errors.seasonYear.message}</p>
          )}
        </div>
      </div>

      {/* Synopsis */}
      <div className="space-y-2">
        <Label htmlFor="synopsis">Özet</Label>
        <Textarea
          id="synopsis"
          placeholder="Film özetini girin"
          {...register('synopsis')}
          disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
          rows={3}
        />
        {errors.synopsis && (
          <p className="text-sm text-destructive">{errors.synopsis.message}</p>
        )}
      </div>

      {/* AniList ID (Zorunlu) */}
      <div className="space-y-2">
        <Label htmlFor="anilistId">AniList ID *</Label>
        <Input
          id="anilistId"
          type="number"
          placeholder="AniList ID"
          {...register('anilistId')}
          disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
        />
        {errors.anilistId && (
          <p className="text-sm text-destructive">{errors.anilistId.message}</p>
        )}
      </div>

      {/* Yetişkin İçerik */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isAdult"
          checked={watch('isAdult')}
          onCheckedChange={(checked) => setValue('isAdult', checked as boolean)}
          disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
        />
        <Label htmlFor="isAdult">Yetişkin İçerik</Label>
        {errors.isAdult && (
          <p className="text-sm text-destructive">{errors.isAdult.message}</p>
        )}
      </div>

      {/* Butonlar */}
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
        >
          İptal
        </Button>
        <Button
          type="submit"
          disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
        >
          {isEdit ? 'Güncelle' : 'Oluştur'}
        </Button>
      </div>
    </form>
  );
} 