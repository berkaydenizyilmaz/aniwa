'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createAnimeSeriesSchema, updateAnimeSeriesSchema } from '@/lib/schemas/anime.schema';
import type { CreateAnimeSeriesRequest } from '@/lib/types/api/anime.api';
import type { UpdateAnimeSeriesRequest } from '@/lib/schemas/anime.schema';
import { AnimeType, AnimeStatus, Season, Source, CountryOfOrigin } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { MultiSelect } from '@/components/ui/multi-select';
import { ImageUpload } from '@/components/ui/image-upload';
import { toast } from 'sonner';
import { useLoadingStore } from '@/lib/stores/loading.store';
import { LOADING_KEYS } from '@/lib/constants/loading.constants';
import { createAnimeSeriesAction } from '@/lib/actions/editor/anime.action';
import { getGenresAction } from '@/lib/actions/admin/genre.action';
import { getTagsAction } from '@/lib/actions/admin/tag.action';
import { getStudiosAction } from '@/lib/actions/admin/studio.action';
import { Genre, Tag, Studio } from '@prisma/client';
import { UPLOAD_CONFIGS } from '@/lib/constants/cloudinary.constants';

interface MultiPartAnimeFormProps {
  selectedType: AnimeType;
  anime?: CreateAnimeSeriesRequest & { id: string };
  onSuccess: () => void;
  onCancel: () => void;
}

export function MultiPartAnimeForm({ selectedType, anime, onSuccess, onCancel }: MultiPartAnimeFormProps) {
  const { isLoading } = useLoadingStore();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [studios, setStudios] = useState<Studio[]>([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState<string[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [selectedStudioIds, setSelectedStudioIds] = useState<string[]>([]);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);

  const isEdit = !!anime;

  const form = useForm<CreateAnimeSeriesRequest | UpdateAnimeSeriesRequest>({
    resolver: zodResolver(isEdit ? updateAnimeSeriesSchema : createAnimeSeriesSchema),
    defaultValues: {
      title: '',
      englishTitle: '',
      japaneseTitle: '',
      synonyms: [],
      synopsis: '',
      type: selectedType,
      status: undefined,
      isAdult: false,
      isMultiPart: true,
      episodes: undefined, // Çok parçalı için otomatik hesaplanır
      duration: undefined, // Çok parçalı için otomatik hesaplanır
      season: undefined,
      seasonYear: undefined,
      releaseDate: undefined,
      source: undefined,
      countryOfOrigin: undefined,
      anilistId: undefined,
      malId: undefined,
      anilistAverageScore: undefined,
      anilistPopularity: undefined,
      trailer: '',
      coverImage: '',
      bannerImage: '',
      coverImageFile: '',
      bannerImageFile: '',
      genreIds: [],
      tagIds: [],
      studioIds: [],
    },
  });

  // Form reset (edit mode için)
  useEffect(() => {
    if (anime && isEdit) {
      form.reset({
        title: anime.title,
        englishTitle: anime.englishTitle || '',
        japaneseTitle: anime.japaneseTitle || '',
        synonyms: anime.synonyms || [],
        synopsis: anime.synopsis || '',
        type: anime.type,
        status: anime.status,
        isAdult: anime.isAdult,
        isMultiPart: anime.isMultiPart,
        episodes: undefined, // Çok parçalı için otomatik hesaplanır
        duration: undefined, // Çok parçalı için otomatik hesaplanır
        season: anime.season,
        seasonYear: anime.seasonYear,
        releaseDate: anime.releaseDate,
        source: anime.source,
        countryOfOrigin: anime.countryOfOrigin,
        anilistId: anime.anilistId,
        malId: anime.malId,
        anilistAverageScore: anime.anilistAverageScore,
        anilistPopularity: anime.anilistPopularity,
        trailer: anime.trailer || '',
        coverImage: anime.coverImage || '',
        bannerImage: anime.bannerImage || '',
        coverImageFile: '',
        bannerImageFile: '',
        genreIds: [],
        tagIds: [],
        studioIds: [],
      });
    }
  }, [anime, isEdit, form]);

  // Genres, tags, studios yükle
  useEffect(() => {
    const loadData = async () => {
      try {
        const [genresRes, tagsRes, studiosRes] = await Promise.all([
          getGenresAction(),
          getTagsAction(),
          getStudiosAction(),
        ]);

        if (genresRes.success) setGenres((genresRes.data as { genres: Genre[] }).genres);
        if (tagsRes.success) setTags((tagsRes.data as { tags: Tag[] }).tags);
        if (studiosRes.success) setStudios((studiosRes.data as { studios: Studio[] }).studios);
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
      }
    };

    loadData();
  }, []);

  // Edit mode'da seçili değerleri ayarla
  useEffect(() => {
    if (anime && isEdit) {
      setSelectedGenreIds((anime.genreIds || []).map(String));
      setSelectedTagIds((anime.tagIds || []).map(String));
      setSelectedStudioIds((anime.studioIds || []).map(String));
    }
  }, [anime, isEdit]);

  const onSubmit = async (data: CreateAnimeSeriesRequest | UpdateAnimeSeriesRequest) => {
    try {
      const formData = {
        ...data,
        type: selectedType,
        isMultiPart: true,
        episodes: undefined, // Çok parçalı için otomatik hesaplanır
        duration: undefined, // Çok parçalı için otomatik hesaplanır
        coverImageFile,
        bannerImageFile,
        genreIds: selectedGenreIds,
        tagIds: selectedTagIds,
        studioIds: selectedStudioIds,
      };

      const result = await createAnimeSeriesAction(formData);
      
      if (result.success) {
        toast.success(isEdit ? 'Anime güncellendi' : 'Anime oluşturuldu');
        onSuccess();
      } else {
        toast.error(result && 'message' in result ? result.message as string : 'Bir hata oluştu');
      }
    } catch (error) {
      console.error('Form gönderme hatası:', error);
      toast.error('Bir hata oluştu');
    }
  };

  const isSubmitting = isLoading(LOADING_KEYS.PAGES.EDITOR_ANIME_PAGE);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Temel Bilgiler */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Başlık *</Label>
            <Input
              id="title"
              {...form.register('title')}
              placeholder="Anime başlığı"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="englishTitle">İngilizce Başlık</Label>
            <Input
              id="englishTitle"
              {...form.register('englishTitle')}
              placeholder="English title"
            />
          </div>

          <div>
            <Label htmlFor="japaneseTitle">Japonca Başlık</Label>
            <Input
              id="japaneseTitle"
              {...form.register('japaneseTitle')}
              placeholder="日本語タイトル"
            />
          </div>

          <div>
            <Label htmlFor="synonyms">Alternatif Başlıklar</Label>
            <Input
              id="synonyms"
              {...form.register('synonyms')}
              placeholder="Alternatif başlıklar (virgülle ayırın)"
            />
          </div>

          <div>
            <Label htmlFor="synopsis">Açıklama</Label>
            <Textarea
              id="synopsis"
              {...form.register('synopsis')}
              placeholder="Anime açıklaması"
              rows={4}
            />
          </div>
        </div>

        {/* Durum ve Tip Bilgileri */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="status">Yayın Durumu *</Label>
            <Select
              value={form.watch('status')}
              onValueChange={(value) => form.setValue('status', value as AnimeStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Durum seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(AnimeStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.status && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.status.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isAdult"
              checked={form.watch('isAdult')}
              onCheckedChange={(checked) => form.setValue('isAdult', checked as boolean)}
            />
            <Label htmlFor="isAdult">Yetişkin İçerik</Label>
          </div>

          <div>
            <Label htmlFor="anilistId">Anilist ID</Label>
            <Input
              id="anilistId"
              type="number"
              {...form.register('anilistId', { valueAsNumber: true })}
              placeholder="Anilist ID"
            />
          </div>

          <div>
            <Label htmlFor="malId">MAL ID</Label>
            <Input
              id="malId"
              type="number"
              {...form.register('malId', { valueAsNumber: true })}
              placeholder="MyAnimeList ID"
            />
          </div>
        </div>
      </div>

      {/* Sezon Bilgileri */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="season">Sezon</Label>
          <Select
            value={form.watch('season')}
            onValueChange={(value) => form.setValue('season', value as Season)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sezon seçiniz" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Season).map((season) => (
                <SelectItem key={season} value={season}>
                  {season}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="seasonYear">Yıl</Label>
          <Input
            id="seasonYear"
            type="number"
            {...form.register('seasonYear', { valueAsNumber: true })}
            placeholder="Yıl"
          />
        </div>

        <div>
          <Label htmlFor="releaseDate">Yayın Tarihi</Label>
          <Input
            id="releaseDate"
            type="date"
            {...form.register('releaseDate')}
          />
        </div>
      </div>

      {/* Kaynak ve Ülke */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="source">Kaynak Materyal</Label>
          <Select
            value={form.watch('source')}
            onValueChange={(value) => form.setValue('source', value as Source)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Kaynak seçiniz" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Source).map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="countryOfOrigin">Köken Ülke</Label>
          <Select
            value={form.watch('countryOfOrigin')}
            onValueChange={(value) => form.setValue('countryOfOrigin', value as CountryOfOrigin)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Ülke seçiniz" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(CountryOfOrigin).map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Puanlama */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="anilistAverageScore">Anilist Ortalama Puan</Label>
          <Input
            id="anilistAverageScore"
            type="number"
            step="0.1"
            {...form.register('anilistAverageScore', { valueAsNumber: true })}
            placeholder="0-100"
          />
        </div>

        <div>
          <Label htmlFor="anilistPopularity">Anilist Popülerlik</Label>
          <Input
            id="anilistPopularity"
            type="number"
            {...form.register('anilistPopularity', { valueAsNumber: true })}
            placeholder="Popülerlik"
          />
        </div>
      </div>

      {/* Trailer */}
      <div>
        <Label htmlFor="trailer">Trailer URL</Label>
        <Input
          id="trailer"
          {...form.register('trailer')}
          placeholder="https://..."
        />
      </div>

      {/* İlişkili Veriler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Türler</Label>
          <MultiSelect
            options={genres.map(genre => ({ id: genre.id, name: genre.name }))}
            selectedIds={selectedGenreIds}
            onSelectionChange={setSelectedGenreIds}
            placeholder="Tür seçiniz"
            searchPlaceholder="Tür ara..."
          />
        </div>

        <div>
          <Label>Etiketler</Label>
          <MultiSelect
            options={tags.map(tag => ({ id: tag.id, name: tag.name }))}
            selectedIds={selectedTagIds}
            onSelectionChange={setSelectedTagIds}
            placeholder="Etiket seçiniz"
            searchPlaceholder="Etiket ara..."
          />
        </div>

        <div>
          <Label>Stüdyolar</Label>
          <MultiSelect
            options={studios.map(studio => ({ id: studio.id, name: studio.name }))}
            selectedIds={selectedStudioIds}
            onSelectionChange={setSelectedStudioIds}
            placeholder="Stüdyo seçiniz"
            searchPlaceholder="Stüdyo ara..."
          />
        </div>
      </div>

      {/* Görseller */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Kapak Görseli</Label>
          <ImageUpload
            id="coverImageFile"
            label="Kapak Görseli"
            accept="image/*"
            maxSize={UPLOAD_CONFIGS.ANIME_COVER.maxSize}
            value={coverImageFile}
            onChange={setCoverImageFile}
          />
        </div>

        <div>
          <Label>Banner Görseli</Label>
          <ImageUpload
            id="bannerImageFile"
            label="Banner Görseli"
            accept="image/*"
            maxSize={UPLOAD_CONFIGS.ANIME_BANNER.maxSize}
            value={bannerImageFile}
            onChange={setBannerImageFile}
          />
        </div>
      </div>

      {/* Butonlar */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          İptal
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isEdit ? 'Güncelle' : 'Oluştur'}
        </Button>
      </div>
    </form>
  );
} 