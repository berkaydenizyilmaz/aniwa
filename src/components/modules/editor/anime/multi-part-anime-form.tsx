'use client';

import { useEffect, useState } from 'react';
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
import { createAnimeSeriesAction, updateAnimeSeriesAction, getAllGenresAction, getAllTagsAction, getAllStudiosAction } from '@/lib/actions/editor/anime.action';
import { createAnimeSeriesSchema, updateAnimeSeriesSchema } from '@/lib/schemas/anime.schema';
import { z } from 'zod';
import { toast } from 'sonner';
import { AnimeSeries, AnimeType, AnimeStatus, Season, Source, Genre, Tag, Studio, CountryOfOrigin } from '@prisma/client';
import { useLoadingStore } from '@/lib/stores/loading.store';
import { LOADING_KEYS } from '@/lib/constants/loading.constants';
import { MultiSelect } from '@/components/ui/multi-select';
import { ImageUpload } from '@/components/ui/image-upload';
import { UPLOAD_CONFIGS } from '@/lib/constants/cloudinary.constants';

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

  // State'ler
  const [genres, setGenres] = useState<Genre[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [studios, setStudios] = useState<Studio[]>([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState<string[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [selectedStudioIds, setSelectedStudioIds] = useState<string[]>([]);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(isEdit ? updateAnimeSeriesSchema : createAnimeSeriesSchema),
    defaultValues: {
      type: selectedType,
      title: '',
      status: undefined,
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

        status: anime.status,
        isAdult: anime.isAdult || false,
        season: anime.season || undefined,
        seasonYear: anime.seasonYear || undefined,
        releaseDate: anime.releaseDate?.toISOString() || undefined,
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

  // Genre, tag, studio verilerini getir
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genresResult, tagsResult, studiosResult] = await Promise.all([
          getAllGenresAction(),
          getAllTagsAction(),
          getAllStudiosAction()
        ]);

        if (genresResult.success && genresResult.data) {
          setGenres(genresResult.data.genres || []);
        }
        if (tagsResult.success && tagsResult.data) {
          setTags(tagsResult.data.tags || []);
        }
        if (studiosResult.success && studiosResult.data) {
          setStudios(studiosResult.data.studios || []);
        }
      } catch (error) {
        console.error('Fetch data error:', error);
        toast.error('Veriler yüklenirken bir hata oluştu');
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: z.infer<typeof createAnimeSeriesSchema> | z.infer<typeof updateAnimeSeriesSchema>) => {
    if (isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)) return;

    setLoadingStore(LOADING_KEYS.FORMS.CREATE_ANIME, true);

    try {
      // isMultiPart'ı type'a göre belirle
      const isMultiPart = data.type !== AnimeType.MOVIE;

      let result;

      if (isEdit && anime) {
        result = await updateAnimeSeriesAction(anime.id, { ...data, isMultiPart });
      } else {
        result = await createAnimeSeriesAction({ ...data, isMultiPart });
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-4xl">
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
            value={watch('status') || ''}
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
        <Select
          value={watch('countryOfOrigin')}
          onValueChange={(value) => setValue('countryOfOrigin', value as CountryOfOrigin)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Köken ülke seçin" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(CountryOfOrigin).map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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

      {/* Genre Seçimi */}
      <div className="space-y-2">
        <Label>Türler</Label>
        <MultiSelect
          options={genres.map(genre => ({ id: genre.id, name: genre.name }))}
          selectedIds={selectedGenreIds}
          onSelectionChange={setSelectedGenreIds}
          placeholder="Tür seçin"
          searchPlaceholder="Tür ara..."
          disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
        />
      </div>

      {/* Tag Seçimi */}
      <div className="space-y-2">
        <Label>Etiketler</Label>
        <MultiSelect
          options={tags.map(tag => ({ id: tag.id, name: tag.name }))}
          selectedIds={selectedTagIds}
          onSelectionChange={setSelectedTagIds}
          placeholder="Etiket seçin"
          searchPlaceholder="Etiket ara..."
          disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
        />
      </div>

      {/* Studio Seçimi */}
      <div className="space-y-2">
        <Label>Stüdyolar</Label>
        <MultiSelect
          options={studios.map(studio => ({ id: studio.id, name: studio.name }))}
          selectedIds={selectedStudioIds}
          onSelectionChange={setSelectedStudioIds}
          placeholder="Stüdyo seçin"
          searchPlaceholder="Stüdyo ara..."
          disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
        />
      </div>

      {/* Resim Yükleme */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ImageUpload
          id="coverImage"
          label="Kapak Görseli"
          accept={UPLOAD_CONFIGS.ANIME_COVER.accept}
          maxSize={UPLOAD_CONFIGS.ANIME_COVER.maxSize}
          value={coverImageFile}
          onChange={setCoverImageFile}
          disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
        />

        <ImageUpload
          id="bannerImage"
          label="Banner Görseli"
          accept={UPLOAD_CONFIGS.ANIME_BANNER.accept}
          maxSize={UPLOAD_CONFIGS.ANIME_BANNER.maxSize}
          value={bannerImageFile}
          onChange={setBannerImageFile}
          disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
        />
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