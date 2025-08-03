'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelect } from '@/components/ui/multi-select';
import { ImageUpload } from '@/components/ui/image-upload';
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
import { createAnimeSeriesAction, updateAnimeSeriesAction, getAnimeSeriesRelationsAction, getAnimeSeriesWithRelationsAction } from '@/lib/actions/editor/anime-series.action';
import { createAnimeSeriesSchema, updateAnimeSeriesSchema, type CreateAnimeSeriesInput, type UpdateAnimeSeriesInput } from '@/lib/schemas/anime.schema';
import { toast } from 'sonner';
import { AnimeSeries, AnimeType, AnimeStatus, Season, Source, CountryOfOrigin } from '@prisma/client';
import { ANIME } from '@/lib/constants/anime.constants';
import { UPLOAD_CONFIGS } from '@/lib/constants/cloudinary.constants';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

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
  const { data: animeSeriesWithRelations } = useQuery({
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
        type: AnimeType;
        status: AnimeStatus;
        releaseDate?: Date;
        season?: Season;
        seasonYear?: number;
        source?: Source;
        countryOfOrigin?: CountryOfOrigin;
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
      type: undefined,
      status: undefined,
      season: undefined,
      year: undefined,
      source: undefined,
      countryOfOrigin: undefined,
      isAdult: false,
      trailer: '',
      synonyms: [],
      coverImageFile: undefined,
      bannerImageFile: undefined,
      genres: [],
      studios: [],
      tags: [],
    },
  });

  // Form'u anime series verisi ile doldur (edit mode)
  useEffect(() => {
    if (animeSeriesWithRelations) {
      reset({
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
      reset({
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
        coverImageFile: undefined,
        bannerImageFile: undefined,
        genres: [],
        studios: [],
        tags: [],
      });
    }
  }, [animeSeriesWithRelations, animeSeries, reset]);

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
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    onOpenChange={(open) => {
                      if (!open && !field.value) {
                        field.onBlur();
                      }
                    }}
                  >
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
                <p className="text-sm text-destructive">Tip seçin</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Durum *</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    onOpenChange={(open) => {
                      if (!open && !field.value) {
                        field.onBlur();
                      }
                    }}
                  >
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
                <p className="text-sm text-destructive">Durum seçin</p>
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
                {...register('year', {
                  setValueAs: (value) => value === '' ? undefined : Number(value)
                })}
                placeholder="2024"
                min={1900}
                max={2100}
              />
              {errors.year && (
                <p className="text-sm text-destructive">{errors.year.message}</p>
              )}
            </div>
          </div>

          {/* Yayın Tarihi */}
          <div className="space-y-2">
            <Label htmlFor="releaseDate">Yayın Tarihi</Label>
            <Input
              id="releaseDate"
              type="date"
              {...register('releaseDate', {
                setValueAs: (value) => value ? new Date(value) : undefined
              })}
            />
            {errors.releaseDate && (
              <p className="text-sm text-destructive">{errors.releaseDate.message}</p>
            )}
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

          {/* Kapak Görseli */}
          <div className="space-y-2">
            <Controller
              name="coverImageFile"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  id="coverImage"
                  label="Kapak Görseli"
                  accept={UPLOAD_CONFIGS.ANIME_COVER.accept}
                  maxSize={UPLOAD_CONFIGS.ANIME_COVER.maxSize}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={createMutation.isPending || updateMutation.isPending}
                />
              )}
            />
            {errors.coverImageFile && (
              <p className="text-sm text-destructive">{errors.coverImageFile.message}</p>
            )}
          </div>

          {/* Banner Görseli */}
          <div className="space-y-2">
            <Controller
              name="bannerImageFile"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  id="bannerImage"
                  label="Banner Görseli"
                  accept={UPLOAD_CONFIGS.ANIME_BANNER.accept}
                  maxSize={UPLOAD_CONFIGS.ANIME_BANNER.maxSize}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={createMutation.isPending || updateMutation.isPending}
                />
              )}
            />
            {errors.bannerImageFile && (
              <p className="text-sm text-destructive">{errors.bannerImageFile.message}</p>
            )}
          </div>

          {/* Türler */}
          <div className="space-y-2">
            <Label>Türler</Label>
            <Controller
              name="genres"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={relations?.genres?.map(genre => ({
                    id: genre.id,
                    name: genre.name
                  })) || []}
                  selectedIds={field.value || []}
                  onSelectionChange={field.onChange}
                  placeholder="Tür seçin"
                  searchPlaceholder="Tür ara..."
                />
              )}
            />
            {errors.genres && (
              <p className="text-sm text-destructive">{errors.genres.message}</p>
            )}
          </div>

          {/* Stüdyolar */}
          <div className="space-y-2">
            <Label>Stüdyolar</Label>
            <Controller
              name="studios"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={relations?.studios?.map(studio => ({
                    id: studio.id,
                    name: studio.name
                  })) || []}
                  selectedIds={field.value || []}
                  onSelectionChange={field.onChange}
                  placeholder="Stüdyo seçin"
                  searchPlaceholder="Stüdyo ara..."
                />
              )}
            />
            {errors.studios && (
              <p className="text-sm text-destructive">{errors.studios.message}</p>
            )}
          </div>

          {/* Etiketler */}
          <div className="space-y-2">
            <Label>Etiketler</Label>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={relations?.tags?.map(tag => ({
                    id: tag.id,
                    name: tag.name
                  })) || []}
                  selectedIds={field.value || []}
                  onSelectionChange={field.onChange}
                  placeholder="Etiket seçin"
                  searchPlaceholder="Etiket ara..."
                />
              )}
            />
            {errors.tags && (
              <p className="text-sm text-destructive">{errors.tags.message}</p>
            )}
          </div>

          {/* Butonlar */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {animeSeries ? 'Güncelle' : 'Oluştur'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 