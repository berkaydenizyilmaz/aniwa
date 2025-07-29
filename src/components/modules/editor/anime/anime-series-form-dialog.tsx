'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createAnimeSeriesAction, updateAnimeSeriesAction } from '@/lib/actions/editor/anime-series.action';
import { createAnimeSeriesSchema, updateAnimeSeriesSchema, type CreateAnimeSeriesInput, type UpdateAnimeSeriesInput } from '@/lib/schemas/anime.schema';
import { toast } from 'sonner';
import { AnimeSeries, AnimeType, AnimeStatus, Season, Source, CountryOfOrigin } from '@prisma/client';
import { useLoadingStore } from '@/lib/stores/loading.store';
import { LOADING_KEYS } from '@/lib/constants/loading.constants';
import { ANIME } from '@/lib/constants/anime.constants';

interface AnimeSeriesFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animeSeries?: AnimeSeries | null;
  onSuccess?: () => void;
}

export function AnimeSeriesFormDialog({ open, onOpenChange, animeSeries, onSuccess }: AnimeSeriesFormDialogProps) {
  const { setLoading: setLoadingStore, isLoading } = useLoadingStore();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors }
  } = useForm<CreateAnimeSeriesInput | UpdateAnimeSeriesInput>({
    resolver: zodResolver(animeSeries ? updateAnimeSeriesSchema : createAnimeSeriesSchema),
    defaultValues: {
      title: '',
      englishTitle: '',
      japaneseTitle: '',
      synopsis: '',
      type: AnimeType.TV,
      status: AnimeStatus.RELEASING,
      season: undefined,
      year: undefined,
      source: undefined,
      countryOfOrigin: undefined,
      isAdult: false,
      trailer: '',
      synonyms: [],
      genres: [],
      studios: [],
      tags: [],
    },
  });

  // Form'u anime series verisi ile doldur (edit mode)
  useEffect(() => {
    if (animeSeries) {
      reset({
        title: animeSeries.title,
        englishTitle: animeSeries.englishTitle || '',
        japaneseTitle: animeSeries.japaneseTitle || '',
        synopsis: animeSeries.synopsis || '',
        type: animeSeries.type,
        status: animeSeries.status,
        startDate: animeSeries.releaseDate || undefined,
        endDate: undefined, // AnimeSeries'de endDate yok
        season: animeSeries.season || undefined,
        year: animeSeries.seasonYear || undefined,
        source: animeSeries.source || undefined,
        countryOfOrigin: animeSeries.countryOfOrigin || undefined,
        isAdult: animeSeries.isAdult || false,
        trailer: animeSeries.trailer || '',
        synonyms: animeSeries.synonyms || [],
        genres: [],
        studios: [],
        tags: [],
      });
    } else {
      reset({
        title: '',
        englishTitle: '',
        japaneseTitle: '',
        synopsis: '',
        type: AnimeType.TV,
        status: AnimeStatus.RELEASING,
        season: undefined,
        year: undefined,
        source: undefined,
        genres: [],
        studios: [],
        tags: [],
      });
    }
  }, [animeSeries, reset]);

  const onSubmit = async (data: CreateAnimeSeriesInput | UpdateAnimeSeriesInput) => {
    if (isLoading(animeSeries ? LOADING_KEYS.FORMS.UPDATE_ANIME_SERIES : LOADING_KEYS.FORMS.CREATE_ANIME_SERIES)) return;

    setLoadingStore(animeSeries ? LOADING_KEYS.FORMS.UPDATE_ANIME_SERIES : LOADING_KEYS.FORMS.CREATE_ANIME_SERIES, true);

    try {
      let result;

      if (animeSeries) {
        // Güncelleme
        result = await updateAnimeSeriesAction(animeSeries.id, data as UpdateAnimeSeriesInput);
      } else {
        // Oluşturma
        result = await createAnimeSeriesAction(data as CreateAnimeSeriesInput);
      }

      if (!result.success) {
        toast.error(result.error || `${animeSeries ? 'Güncelleme' : 'Oluşturma'} başarısız oldu`);
        return;
      }

      // Başarılı
      toast.success(`Anime serisi başarıyla ${animeSeries ? 'güncellendi' : 'oluşturuldu'}!`);

      // Dialog'u kapat ve callback çağır
      onOpenChange(false);
      onSuccess?.();

    } catch (error) {
      console.error('Anime series form error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoadingStore(animeSeries ? LOADING_KEYS.FORMS.UPDATE_ANIME_SERIES : LOADING_KEYS.FORMS.CREATE_ANIME_SERIES, false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {animeSeries ? 'Anime Serisini Düzenle' : 'Yeni Anime Serisi Oluştur'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Başlık */}
          <div className="space-y-2">
            <Label htmlFor="title">Başlık *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Anime başlığı"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* İngilizce Başlık */}
          <div className="space-y-2">
            <Label htmlFor="englishTitle">İngilizce Başlık</Label>
            <Input
              id="englishTitle"
              {...register('englishTitle')}
              placeholder="English title"
            />
            {errors.englishTitle && (
              <p className="text-sm text-destructive">{errors.englishTitle.message}</p>
            )}
          </div>

          {/* Japonca Başlık */}
          <div className="space-y-2">
            <Label htmlFor="japaneseTitle">Japonca Başlık</Label>
            <Input
              id="japaneseTitle"
              {...register('japaneseTitle')}
              placeholder="日本語タイトル"
            />
            {errors.japaneseTitle && (
              <p className="text-sm text-destructive">{errors.japaneseTitle.message}</p>
            )}
          </div>

          {/* Özet */}
          <div className="space-y-2">
            <Label htmlFor="synopsis">Özet</Label>
            <Textarea
              id="synopsis"
              {...register('synopsis')}
              placeholder="Anime özeti..."
              rows={4}
            />
            {errors.synopsis && (
              <p className="text-sm text-destructive">{errors.synopsis.message}</p>
            )}
          </div>

          {/* Tip ve Durum */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tip *</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tip seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(AnimeType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {ANIME.TYPE_LABELS[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && (
                <p className="text-sm text-destructive">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Durum *</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Durum seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(AnimeStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {ANIME.STATUS_LABELS[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-sm text-destructive">{errors.status.message}</p>
              )}
            </div>
          </div>

          {/* Sezon ve Yıl */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="season">Sezon</Label>
              <Controller
                name="season"
                control={control}
                render={({ field }) => (
                  <Select value={field.value || 'none'} onValueChange={(value) => field.onChange(value === 'none' ? undefined : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sezon seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sezon yok</SelectItem>
                      {Object.values(Season).map((season) => (
                        <SelectItem key={season} value={season}>
                          {ANIME.SEASON_LABELS[season]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.season && (
                <p className="text-sm text-destructive">{errors.season.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Yıl</Label>
              <Input
                id="year"
                type="number"
                {...register('year', { valueAsNumber: true })}
                placeholder="2024"
                min={1900}
                max={2100}
              />
              {errors.year && (
                <p className="text-sm text-destructive">{errors.year.message}</p>
              )}
            </div>
          </div>

          {/* Kaynak */}
          <div className="space-y-2">
            <Label htmlFor="source">Kaynak</Label>
            <Controller
              name="source"
              control={control}
              render={({ field }) => (
                <Select value={field.value || 'none'} onValueChange={(value) => field.onChange(value === 'none' ? undefined : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kaynak seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Kaynak yok</SelectItem>
                    {Object.values(Source).map((source) => (
                      <SelectItem key={source} value={source}>
                        {ANIME.SOURCE_LABELS[source]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.source && (
              <p className="text-sm text-destructive">{errors.source.message}</p>
            )}
          </div>

          {/* Ülke ve Yetişkin İçerik */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="countryOfOrigin">Köken Ülke</Label>
              <Controller
                name="countryOfOrigin"
                control={control}
                render={({ field }) => (
                  <Select value={field.value || 'none'} onValueChange={(value) => field.onChange(value === 'none' ? undefined : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Ülke seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Ülke yok</SelectItem>
                      {Object.values(CountryOfOrigin).map((country) => (
                        <SelectItem key={country} value={country}>
                          {ANIME.COUNTRY_OF_ORIGIN_LABELS[country]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.countryOfOrigin && (
                <p className="text-sm text-destructive">{errors.countryOfOrigin.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="isAdult">Yetişkin İçerik</Label>
              <Controller
                name="isAdult"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isAdult"
                      checked={field.value || false}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="isAdult" className="text-sm">18+ içerik</Label>
                  </div>
                )}
              />
              {errors.isAdult && (
                <p className="text-sm text-destructive">{errors.isAdult.message}</p>
              )}
            </div>
          </div>

          {/* Trailer URL */}
          <div className="space-y-2">
            <Label htmlFor="trailer">Trailer URL</Label>
            <Input
              id="trailer"
              {...register('trailer')}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            {errors.trailer && (
              <p className="text-sm text-destructive">{errors.trailer.message}</p>
            )}
          </div>

          {/* Alternatif Başlıklar */}
          <div className="space-y-2">
            <Label htmlFor="synonyms">Alternatif Başlıklar</Label>
            <Textarea
              id="synonyms"
              {...register('synonyms')}
              placeholder="Her satıra bir başlık yazın..."
              rows={3}
              onChange={(e) => {
                const lines = e.target.value.split('\n').filter(line => line.trim() !== '');
                setValue('synonyms', lines);
              }}
            />
            {errors.synonyms && (
              <p className="text-sm text-destructive">{errors.synonyms.message}</p>
            )}
          </div>

          {/* Butonlar */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME_SERIES) || isLoading(LOADING_KEYS.FORMS.UPDATE_ANIME_SERIES)}
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME_SERIES) || isLoading(LOADING_KEYS.FORMS.UPDATE_ANIME_SERIES)}
            >
              {animeSeries ? 'Güncelle' : 'Oluştur'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 