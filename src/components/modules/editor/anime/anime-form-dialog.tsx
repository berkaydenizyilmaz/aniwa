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
import { createAnimeSeriesAction, updateAnimeSeriesAction } from '@/lib/actions/editor/anime.action';
import { createAnimeSeriesSchema, updateAnimeSeriesSchema, type CreateAnimeSeriesInput, type UpdateAnimeSeriesInput } from '@/lib/schemas/anime.schema';
import { toast } from 'sonner';
import { AnimeSeries } from '@prisma/client';
import { useLoadingStore } from '@/lib/stores/loading.store';
import { LOADING_KEYS } from '@/lib/constants/loading.constants';

interface AnimeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anime?: AnimeSeries | null;
  onSuccess?: () => void;
}

export function AnimeFormDialog({ open, onOpenChange, anime, onSuccess }: AnimeFormDialogProps) {
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
        season: anime.season || 'SPRING',
        seasonYear: anime.seasonYear || new Date().getFullYear(),
        source: anime.source || 'ORIGINAL',
        countryOfOrigin: anime.countryOfOrigin || 'Japan',
        description: anime.description || '',
        isMultiPart: anime.isMultiPart,
      });
    } else {
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
      });
    }
  }, [anime, reset]);

  const onSubmit = async (data: CreateAnimeSeriesInput | UpdateAnimeSeriesInput) => {
    if (isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)) return;

    setLoadingStore(LOADING_KEYS.FORMS.CREATE_ANIME, true);

    try {
      let result;

      if (isEdit && anime) {
        result = await updateAnimeSeriesAction(anime.id, data as UpdateAnimeSeriesInput);
      } else {
        result = await createAnimeSeriesAction(data as CreateAnimeSeriesInput);
      }

      if (!result.success) {
        toast.error(result.error || `${isEdit ? 'Güncelleme' : 'Oluşturma'} başarısız oldu`);
        return;
      }

      toast.success(`Anime serisi başarıyla ${isEdit ? 'güncellendi' : 'oluşturuldu'}!`);
      onOpenChange(false);
      onSuccess?.();

    } catch (error) {
      console.error('Anime form error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoadingStore(LOADING_KEYS.FORMS.CREATE_ANIME, false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Anime Serisi Düzenle' : 'Yeni Anime Serisi Ekle'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Başlık */}
          <div className="space-y-2">
            <Label htmlFor="title">Başlık (Türkçe) *</Label>
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

          {/* İngilizce Başlık */}
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

          {/* Japonca Başlık */}
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

          {/* Tür */}
          <div className="space-y-2">
            <Label htmlFor="type">Tür *</Label>
            <Select
              value={watchedType}
              onValueChange={(value) => setValue('type', value as 'TV' | 'MOVIE' | 'OVA' | 'ONA')}
              disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tür seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TV">TV Series</SelectItem>
                <SelectItem value="MOVIE">Film</SelectItem>
                <SelectItem value="OVA">OVA</SelectItem>
                <SelectItem value="ONA">ONA</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          {/* Durum */}
          <div className="space-y-2">
            <Label htmlFor="status">Durum *</Label>
            <Select
              {...register('status')}
              onValueChange={(value) => setValue('status', value as 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED')}
              disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Durum seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FINISHED">Tamamlandı</SelectItem>
                <SelectItem value="RELEASING">Devam Ediyor</SelectItem>
                <SelectItem value="NOT_YET_RELEASED">Henüz Yayınlanmadı</SelectItem>
                <SelectItem value="CANCELLED">İptal Edildi</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-destructive">{errors.status.message}</p>
            )}
          </div>

          {/* Bölüm Sayısı */}
          <div className="space-y-2">
            <Label htmlFor="episodes">Bölüm Sayısı</Label>
            <Input
              id="episodes"
              type="number"
              placeholder="0"
              {...register('episodes', { valueAsNumber: true })}
              disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
            />
            {errors.episodes && (
              <p className="text-sm text-destructive">{errors.episodes.message}</p>
            )}
          </div>

          {/* Süre */}
          <div className="space-y-2">
            <Label htmlFor="duration">Süre (dakika)</Label>
            <Input
              id="duration"
              type="number"
              placeholder="0"
              {...register('duration', { valueAsNumber: true })}
              disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
            />
            {errors.duration && (
              <p className="text-sm text-destructive">{errors.duration.message}</p>
            )}
          </div>

          {/* Yetişkin İçerik */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isAdult"
              {...register('isAdult')}
              disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
            />
            <Label htmlFor="isAdult">Yetişkin İçerik</Label>
          </div>
          {errors.isAdult && (
            <p className="text-sm text-destructive">{errors.isAdult.message}</p>
          )}

          {/* Çok Parçalı (sadece TV Series için) */}
          {watchedType === 'TV' && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isMultiPart"
                {...register('isMultiPart')}
                disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
              />
              <Label htmlFor="isMultiPart">Çok Parçalı (Sezonlar)</Label>
            </div>
          )}
          {errors.isMultiPart && (
            <p className="text-sm text-destructive">{errors.isMultiPart.message}</p>
          )}

          {/* Sezon */}
          <div className="space-y-2">
            <Label htmlFor="season">Sezon</Label>
            <Select
              {...register('season')}
              onValueChange={(value) => setValue('season', value as 'SPRING' | 'SUMMER' | 'FALL' | 'WINTER')}
              disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sezon seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SPRING">İlkbahar</SelectItem>
                <SelectItem value="SUMMER">Yaz</SelectItem>
                <SelectItem value="FALL">Sonbahar</SelectItem>
                <SelectItem value="WINTER">Kış</SelectItem>
              </SelectContent>
            </Select>
            {errors.season && (
              <p className="text-sm text-destructive">{errors.season.message}</p>
            )}
          </div>

          {/* Yıl */}
          <div className="space-y-2">
            <Label htmlFor="seasonYear">Yıl</Label>
            <Input
              id="seasonYear"
              type="number"
              placeholder="2024"
              {...register('seasonYear', { valueAsNumber: true })}
              disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
            />
            {errors.seasonYear && (
              <p className="text-sm text-destructive">{errors.seasonYear.message}</p>
            )}
          </div>

          {/* Kaynak */}
          <div className="space-y-2">
            <Label htmlFor="source">Kaynak</Label>
            <Select
              {...register('source')}
              onValueChange={(value) => setValue('source', value as 'ORIGINAL' | 'MANGA' | 'LIGHT_NOVEL' | 'VISUAL_NOVEL' | 'GAME' | 'NOVEL' | 'OTHER')}
              disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Kaynak seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ORIGINAL">Original</SelectItem>
                <SelectItem value="MANGA">Manga</SelectItem>
                <SelectItem value="LIGHT_NOVEL">Light Novel</SelectItem>
                <SelectItem value="VISUAL_NOVEL">Visual Novel</SelectItem>
                <SelectItem value="GAME">Game</SelectItem>
                <SelectItem value="NOVEL">Novel</SelectItem>
                <SelectItem value="OTHER">Diğer</SelectItem>
              </SelectContent>
            </Select>
            {errors.source && (
              <p className="text-sm text-destructive">{errors.source.message}</p>
            )}
          </div>

          {/* Ülke */}
          <div className="space-y-2">
            <Label htmlFor="countryOfOrigin">Ülke</Label>
            <Input
              id="countryOfOrigin"
              type="text"
              placeholder="Japan"
              {...register('countryOfOrigin')}
              disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
            />
            {errors.countryOfOrigin && (
              <p className="text-sm text-destructive">{errors.countryOfOrigin.message}</p>
            )}
          </div>

          {/* Açıklama */}
          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              placeholder="Anime açıklaması..."
              {...register('description')}
              disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

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
              {isEdit ? 'Güncelle' : 'Oluştur'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 