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
import { AnimeSeries, AnimeType, AnimeStatus, Season, Source } from '@prisma/client';
import { useLoadingStore } from '@/lib/stores/loading.store';
import { LOADING_KEYS } from '@/lib/constants/loading.constants';

interface MultiPartAnimeFormProps {
  anime?: AnimeSeries | null;
  selectedType: AnimeType;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function MultiPartAnimeForm({ 
  anime, 
  selectedType,
  onSuccess,
  onCancel
}: MultiPartAnimeFormProps) {
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
      type: selectedType,
      title: '',
      status: AnimeStatus.RELEASING,
      isAdult: false,
    },
  });

  // Form'u anime verisi ile doldur (edit mode)
  useEffect(() => {
    if (anime) {
      reset({
        type: anime.type,
        title: anime.title,
        englishTitle: anime.englishTitle || '',
        japaneseTitle: anime.japaneseTitle || '',
        synonyms: anime.synonyms || [],
        synopsis: anime.synopsis || '',
        episodes: anime.episodes || undefined,
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
        type: selectedType,
        title: '',
        englishTitle: '',
        japaneseTitle: '',
        synonyms: [],
        synopsis: '',
        episodes: undefined,
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
  }, [anime, selectedType, reset]);

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

      toast.success(`Anime serisi başarıyla ${isEdit ? 'güncellendi' : 'oluşturuldu'}!`);
      onSuccess?.();

    } catch (error) {
      console.error('Anime form error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoadingStore(LOADING_KEYS.FORMS.CREATE_ANIME, false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Temel Bilgiler */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tür (Edit mode'da göster) */}
        {isEdit && (
          <div className="space-y-2">
            <Label htmlFor="type">Tür *</Label>
            <Select
              value={watch('type')}
              onValueChange={(value) => setValue('type', value as AnimeType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tür seçin" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(AnimeType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>
        )}

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
      </div>

      {/* Başlık */}
      <div className="space-y-2">
        <Label htmlFor="title">Başlık *</Label>
        <Input
          id="title"
          type="text"
          placeholder="Anime başlığını girin"
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

      {/* Bölüm Sayısı ve Süre */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="episodes">Bölüm Sayısı</Label>
          <Input
            id="episodes"
            type="number"
            placeholder="Bölüm sayısı"
            {...register('episodes')}
            disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
          />
          {errors.episodes && (
            <p className="text-sm text-destructive">{errors.episodes.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Süre (dakika)</Label>
          <Input
            id="duration"
            type="number"
            placeholder="Bölüm süresi"
            {...register('duration')}
            disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
          />
          {errors.duration && (
            <p className="text-sm text-destructive">{errors.duration.message}</p>
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

      {/* Synonyms */}
      <div className="space-y-2">
        <Label htmlFor="synonyms">Alternatif Başlıklar</Label>
        <Input
          id="synonyms"
          type="text"
          placeholder="Virgülle ayrılmış alternatif başlıklar"
          {...register('synonyms')}
          disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
        />
        {errors.synonyms && (
          <p className="text-sm text-destructive">{errors.synonyms.message}</p>
        )}
      </div>

      {/* Synopsis */}
      <div className="space-y-2">
        <Label htmlFor="synopsis">Özet</Label>
        <Textarea
          id="synopsis"
          placeholder="Anime özetini girin"
          {...register('synopsis')}
          disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
          rows={3}
        />
        {errors.synopsis && (
          <p className="text-sm text-destructive">{errors.synopsis.message}</p>
        )}
      </div>

      {/* Release Date */}
      <div className="space-y-2">
        <Label htmlFor="releaseDate">Yayın Tarihi</Label>
        <Input
          id="releaseDate"
          type="date"
          {...register('releaseDate')}
          disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
        />
        {errors.releaseDate && (
          <p className="text-sm text-destructive">{errors.releaseDate.message}</p>
        )}
      </div>

      {/* Source */}
      <div className="space-y-2">
        <Label htmlFor="source">Kaynak Materyal</Label>
        <Select
          value={watch('source')}
          onValueChange={(value) => setValue('source', value as Source)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Kaynak seçin" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(Source).map((source) => (
              <SelectItem key={source} value={source}>
                {source}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.source && (
          <p className="text-sm text-destructive">{errors.source.message}</p>
        )}
      </div>

      {/* Country of Origin */}
      <div className="space-y-2">
        <Label htmlFor="countryOfOrigin">Köken Ülke</Label>
        <Input
          id="countryOfOrigin"
          type="text"
          placeholder="Köken ülke"
          {...register('countryOfOrigin')}
          disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
        />
        {errors.countryOfOrigin && (
          <p className="text-sm text-destructive">{errors.countryOfOrigin.message}</p>
        )}
      </div>

      {/* AniList Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="anilistAverageScore">AniList Ortalama Puan</Label>
          <Input
            id="anilistAverageScore"
            type="number"
            step="0.01"
            placeholder="Ortalama puan"
            {...register('anilistAverageScore')}
            disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
          />
          {errors.anilistAverageScore && (
            <p className="text-sm text-destructive">{errors.anilistAverageScore.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="anilistPopularity">AniList Popülerlik</Label>
          <Input
            id="anilistPopularity"
            type="number"
            placeholder="Popülerlik"
            {...register('anilistPopularity')}
            disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
          />
          {errors.anilistPopularity && (
            <p className="text-sm text-destructive">{errors.anilistPopularity.message}</p>
          )}
        </div>
      </div>

      {/* Trailer */}
      <div className="space-y-2">
        <Label htmlFor="trailer">Tanıtım Videosu URL</Label>
        <Input
          id="trailer"
          type="url"
          placeholder="Trailer URL'si"
          {...register('trailer')}
          disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
        />
        {errors.trailer && (
          <p className="text-sm text-destructive">{errors.trailer.message}</p>
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