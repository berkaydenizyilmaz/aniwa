'use client';

import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { AnimeType, AnimeStatus, Season, Source } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CreateAnimeSeriesInput, UpdateAnimeSeriesInput } from '@/lib/schemas/anime.schema';
import { LoadingKey } from '@/lib/constants/loading.constants';

interface AnimeBasicInfoSectionProps {
  form: {
    register: UseFormRegister<CreateAnimeSeriesInput | UpdateAnimeSeriesInput>;
    watch: UseFormWatch<CreateAnimeSeriesInput | UpdateAnimeSeriesInput>;
    setValue: UseFormSetValue<CreateAnimeSeriesInput | UpdateAnimeSeriesInput>;
    formState: { errors: FieldErrors<CreateAnimeSeriesInput | UpdateAnimeSeriesInput> };
  };
  isLoading: (key: LoadingKey) => boolean;
  loadingKey: LoadingKey;
}

export function AnimeBasicInfoSection({ form, isLoading, loadingKey }: AnimeBasicInfoSectionProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  const watchedType = watch('type');
  const watchedIsMultiPart = watch('isMultiPart');

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-foreground">Temel Bilgiler</h3>
        <p className="text-sm text-muted-foreground">Anime&apos;nin temel bilgilerini girin</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Başlık */}
        <div className="space-y-2">
          <Label htmlFor="title">Başlık (Romaji)</Label>
          <Input
            id="title"
            type="text"
            placeholder="Romaji başlık"
            {...register('title')}
            disabled={isLoading(loadingKey)}
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
            placeholder="English title"
            {...register('englishTitle')}
            disabled={isLoading(loadingKey)}
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
            disabled={isLoading(loadingKey)}
          />
          {errors.japaneseTitle && (
            <p className="text-sm text-destructive">{errors.japaneseTitle.message}</p>
          )}
        </div>

        {/* Alternatif Başlıklar */}
        <div className="space-y-2">
          <Label htmlFor="synonyms">Alternatif Başlıklar</Label>
          <Input
            id="synonyms"
            type="text"
            placeholder="Virgülle ayırarak alternatif başlıkları girin"
            {...register('synonyms')}
            disabled={isLoading(loadingKey)}
          />
          {errors.synonyms && (
            <p className="text-sm text-destructive">{errors.synonyms.message}</p>
          )}
        </div>

        {/* AniList ID */}
        <div className="space-y-2">
          <Label htmlFor="anilistId">
            AniList ID
          </Label>
          <Input
            id="anilistId"
            type="text"
            placeholder="AniList ID"
            {...register('anilistId', { valueAsNumber: true })}
            disabled={isLoading(loadingKey)}
          />
          {errors.anilistId && (
            <p className="text-sm text-destructive">{errors.anilistId.message}</p>
          )}
        </div>

        {/* MAL ID */}
        <div className="space-y-2">
          <Label htmlFor="idMal">
            MAL ID
          </Label>
          <Input
            id="idMal"
            type="text"
            placeholder="MAL ID"
            {...register('idMal', { valueAsNumber: true })}
            disabled={isLoading(loadingKey)}
          />
          {errors.idMal && (
            <p className="text-sm text-destructive">{errors.idMal.message}</p>
          )}
        </div>

        {/* Tür */}
        <div className="space-y-2">
          <Label htmlFor="type">Tür</Label>
          <Select
            value={watchedType}
            onValueChange={(value) => setValue('type', value as AnimeType)}
            disabled={isLoading(loadingKey)}
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

        {/* Durum */}
        <div className="space-y-2">
          <Label htmlFor="status">Durum</Label>
          <Select
            value={watch('status')}
            onValueChange={(value) => setValue('status', value as AnimeStatus)}
            disabled={isLoading(loadingKey)}
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

        {/* Bölüm Sayısı (Film hariç, çok parçalı hariç) */}
        {watchedType !== AnimeType.MOVIE && !watchedIsMultiPart && (
          <div className="space-y-2">
            <Label htmlFor="episodes">
              Bölüm Sayısı
            </Label>
            <Input
              id="episodes"
              type="text"
              placeholder="Toplam bölüm sayısı"
              {...register('episodes', { valueAsNumber: true })}
              disabled={isLoading(loadingKey)}
            />
            {errors.episodes && (
              <p className="text-sm text-destructive">{errors.episodes.message}</p>
            )}
          </div>
        )}

        {/* Süre (Film veya tek parçalı) */}
        {(watchedType === AnimeType.MOVIE || !watchedIsMultiPart) && (
          <div className="space-y-2">
            <Label htmlFor="duration">
              Süre (Dakika)
            </Label>
            <Input
              id="duration"
              type="text"
              placeholder={watchedType === AnimeType.MOVIE ? "Film süresi" : "Bölüm süresi"}
              {...register('duration', { valueAsNumber: true })}
              disabled={isLoading(loadingKey)}
            />
            {errors.duration && (
              <p className="text-sm text-destructive">{errors.duration.message}</p>
            )}
          </div>
        )}

        {/* Sezon */}
        <div className="space-y-2">
          <Label htmlFor="season">Sezon</Label>
          <Select
            value={watch('season')}
            onValueChange={(value) => setValue('season', value as Season)}
            disabled={isLoading(loadingKey)}
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

        {/* Yıl */}
        <div className="space-y-2">
          <Label htmlFor="seasonYear">Yıl</Label>
          <Input
            id="seasonYear"
            type="text"
            placeholder="2024"
            {...register('seasonYear', { valueAsNumber: true })}
            disabled={isLoading(loadingKey)}
          />
          {errors.seasonYear && (
            <p className="text-sm text-destructive">{errors.seasonYear.message}</p>
          )}
        </div>

        {/* Yayınlanma Tarihi */}
        <div className="space-y-2">
          <Label htmlFor="releaseDate">Yayınlanma Tarihi</Label>
          <Input
            id="releaseDate"
            type="date"
            {...register('releaseDate', { 
              setValueAs: (value) => value ? new Date(value) : undefined 
            })}
            disabled={isLoading(loadingKey)}
          />
          {errors.releaseDate && (
            <p className="text-sm text-destructive">{errors.releaseDate.message}</p>
          )}
        </div>

        {/* Kaynak */}
        <div className="space-y-2">
          <Label htmlFor="source">Kaynak</Label>
          <Select
            value={watch('source')}
            onValueChange={(value) => setValue('source', value as Source)}
            disabled={isLoading(loadingKey)}
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

        {/* Ülke */}
        <div className="space-y-2">
          <Label htmlFor="countryOfOrigin">Ülke</Label>
          <Input
            id="countryOfOrigin"
            type="text"
            placeholder="Japan"
            {...register('countryOfOrigin')}
            disabled={isLoading(loadingKey)}
          />
          {errors.countryOfOrigin && (
            <p className="text-sm text-destructive">{errors.countryOfOrigin.message}</p>
          )}
        </div>
      </div>

      {/* Checkbox'lar */}
      <div className="flex items-center gap-6">
        {/* Yetişkin İçerik */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isAdult"
            {...register('isAdult')}
            disabled={isLoading(loadingKey)}
          />
          <Label htmlFor="isAdult">Yetişkin İçerik</Label>
        </div>
        {errors.isAdult && (
          <p className="text-sm text-destructive">{errors.isAdult.message}</p>
        )}

        {/* Çok Parçalı */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isMultiPart"
            checked={watchedIsMultiPart}
            onCheckedChange={(checked) => setValue('isMultiPart', checked as boolean)}
            disabled={isLoading(loadingKey)}
          />
          <Label htmlFor="isMultiPart">Çok Parçalı (Sezonlar)</Label>
        </div>
        {errors.isMultiPart && (
          <p className="text-sm text-destructive">{errors.isMultiPart.message}</p>
        )}
      </div>

      {/* Açıklama */}
      <div className="space-y-2">
        <Label htmlFor="description">Açıklama</Label>
        <Textarea
          id="description"
          placeholder="Anime açıklaması..."
          {...register('description')}
          disabled={isLoading(loadingKey)}
          rows={4}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>
    </div>
  );
} 