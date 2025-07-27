'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { CheckIcon, ChevronsUpDownIcon, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimeType, AnimeStatus, Season, Source, AnimeSeries, Genre, Tag, Studio } from '@prisma/client';
import { useLoadingStore } from '@/lib/stores/loading.store';
import { LOADING_KEYS } from '@/lib/constants/loading.constants';
import { toast } from 'sonner';
import { createAnimeSeriesAction, updateAnimeSeriesAction, getAllGenresAction, getAllTagsAction, getAllStudiosAction } from '@/lib/actions/editor/anime.action';
import { CreateAnimeSeriesInput, UpdateAnimeSeriesInput, createAnimeSeriesSchema, updateAnimeSeriesSchema } from '@/lib/schemas/anime.schema';

interface AnimeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anime?: AnimeSeries & { genres?: Genre[]; tags?: Tag[]; studios?: Studio[] } | null;
  onSuccess?: () => void;
}

// Multi-select komponenti
interface MultiSelectProps {
  options: { id: string; name: string }[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  placeholder: string;
  searchPlaceholder: string;
  disabled?: boolean;
}

function MultiSelect({ options, selectedIds, onSelectionChange, placeholder, searchPlaceholder, disabled }: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedItems = options.filter(option => selectedIds.includes(option.id));

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const handleRemove = (id: string) => {
    onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-9 border-2 border-border/60 data-[placeholder]:text-muted-foreground focus-visible:border-primary/80 focus-visible:ring-primary/20 transition-colors outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 hover:bg-transparent hover:text-foreground hover:border-border/60"
            disabled={disabled}
          >
            {selectedItems.length > 0 ? (
              <span className="text-sm">
                {selectedItems.length} öğe seçildi
              </span>
            ) : (
              <span className="text-muted-foreground text-sm">{placeholder}</span>
            )}
            <ChevronsUpDownIcon className="size-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command className="rounded-md border shadow-md">
            <CommandInput placeholder={searchPlaceholder} className="border-0 focus:ring-0 placeholder:text-muted-foreground" />
            <CommandList className="max-h-[300px]">
              <CommandEmpty className="text-muted-foreground py-6">Sonuç bulunamadı.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.id}
                    onSelect={() => handleSelect(option.id)}
                    className="relative flex w-full items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground group"
                  >
                    <CheckIcon
                      className={cn(
                        "absolute right-2 size-4",
                        selectedIds.includes(option.id) ? "opacity-100" : "opacity-0",
                        "group-focus:text-accent-foreground"
                      )}
                    />
                    <span className={cn(
                      selectedIds.includes(option.id) ? "font-medium" : ""
                    )}>
                      {option.name}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {/* Seçilen öğeleri göster */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-muted/30 rounded-md border border-border/50">
          {selectedItems.map((item) => (
            <Badge 
              key={item.id} 
              variant="secondary" 
              className="text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors group"
            >
              {item.name}
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="ml-1.5 rounded-full p-0.5 hover:bg-primary/20 transition-colors outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1"
              >
                <XIcon className="h-3 w-3 text-primary/70 group-hover:text-primary" />
                <span className="sr-only">Kaldır</span>
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
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
      type: AnimeType.TV,
      status: AnimeStatus.FINISHED,
      episodes: 0,
      duration: 0,
      isAdult: false,
      season: Season.SPRING,
      seasonYear: new Date().getFullYear(),
      source: Source.ORIGINAL,
      countryOfOrigin: 'Japan',
      description: '',
      isMultiPart: false,
    },
  });

  const watchedType = watch('type');

  // Tür değiştiğinde sezon, yıl ve bölüm sayısı alanlarını güncelle
  useEffect(() => {
    if (watchedType === AnimeType.MOVIE) {
      setValue('season', undefined);
      setValue('seasonYear', undefined);
      setValue('episodes', 1); // Film için bölüm sayısı 1
    } else if (watchedType && !watch('season')) {
      setValue('season', Season.SPRING);
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
        season: anime.season || (anime.type !== AnimeType.MOVIE ? Season.SPRING : undefined),
        seasonYear: anime.seasonYear || (anime.type !== AnimeType.MOVIE ? new Date().getFullYear() : undefined),
        releaseDate: anime.releaseDate ? new Date(anime.releaseDate) : undefined,
        source: anime.source || Source.ORIGINAL,
        countryOfOrigin: anime.countryOfOrigin || 'Japan',
        description: anime.description || '',
        isMultiPart: anime.isMultiPart,
        coverImage: anime.coverImage || '',
        bannerImage: anime.bannerImage || '',
        trailer: anime.trailer || '',
        genreIds: [],
        tagIds: [],
        studioIds: [],
      });
    } else {
      reset({
        title: '',
        englishTitle: '',
        japaneseTitle: '',
        synonyms: [],
        type: AnimeType.TV,
        status: AnimeStatus.FINISHED,
        episodes: 0,
        duration: 0,
        isAdult: false,
        season: Season.SPRING,
        seasonYear: new Date().getFullYear(),
        source: Source.ORIGINAL,
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
        const [genresResult, tagsResult, studiosResult] = await Promise.all([
          getAllGenresAction(),
          getAllTagsAction(),
          getAllStudiosAction()
        ]);

        if (genresResult.success && genresResult.data) {
          setGenres(genresResult.data.genres);
        }
        if (tagsResult.success && tagsResult.data) {
          setTags(tagsResult.data.tags);
        }
        if (studiosResult.success && studiosResult.data) {
          setStudios(studiosResult.data.studios);
        }
      } catch (error) {
        console.error('İlişki verileri yüklenirken hata:', error);
      }
    };

    if (open) {
      loadRelationData();
    }
  }, [open]);

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
        const errorMessage = 'error' in result ? result.error :
          'details' in result && result.details ? String(result.details) :
            `${isEdit ? 'Güncelleme' : 'Oluşturma'} başarısız oldu`;
        toast.error(errorMessage);
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
            <Label htmlFor="title">Başlık (Türkçe)</Label>
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
            <Label htmlFor="type">Tür</Label>
            <Select
              value={watchedType}
              onValueChange={(value) => setValue('type', value as AnimeType)}
              disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
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
              {...register('status')}
              onValueChange={(value) => setValue('status', value as AnimeStatus)}
              disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
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

          {/* Bölüm Sayısı (Film hariç tüm türler için) */}
          {watchedType !== AnimeType.MOVIE && (
            <div className="space-y-2">
              <Label htmlFor="episodes">
                Bölüm Sayısı
              </Label>
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
          )}

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

          {/* Çok Parçalı (Film hariç tüm türler için) */}
          {watchedType !== AnimeType.MOVIE && (
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
              onValueChange={(value) => setValue('season', value as Season)}
              disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
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
              type="number"
              placeholder="2024"
              {...register('seasonYear', { valueAsNumber: true })}
              disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
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
              disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
            />
            {errors.releaseDate && (
              <p className="text-sm text-destructive">{errors.releaseDate.message}</p>
            )}
          </div>

          {/* Kaynak */}
          <div className="space-y-2">
            <Label htmlFor="source">Kaynak</Label>
            <Select
              {...register('source')}
              onValueChange={(value) => setValue('source', value as Source)}
              disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
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

          {/* Görsel İçerik */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Görsel İçerik</h3>

            {/* Kapak Resmi */}
            <div className="space-y-2">
              <Label htmlFor="coverImage">Kapak Resmi URL</Label>
              <Input
                id="coverImage"
                type="url"
                placeholder="https://example.com/cover.jpg"
                {...register('coverImage')}
                disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
              />
              {errors.coverImage && (
                <p className="text-sm text-destructive">{errors.coverImage.message}</p>
              )}
            </div>

            {/* Banner Resmi */}
            <div className="space-y-2">
              <Label htmlFor="bannerImage">Banner Resmi URL</Label>
              <Input
                id="bannerImage"
                type="url"
                placeholder="https://example.com/banner.jpg"
                {...register('bannerImage')}
                disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
              />
              {errors.bannerImage && (
                <p className="text-sm text-destructive">{errors.bannerImage.message}</p>
              )}
            </div>

            {/* Tanıtım Videosu */}
            <div className="space-y-2">
              <Label htmlFor="trailer">Tanıtım Videosu URL</Label>
              <Input
                id="trailer"
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                {...register('trailer')}
                disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
              />
              {errors.trailer && (
                <p className="text-sm text-destructive">{errors.trailer.message}</p>
              )}
            </div>
          </div>

          {/* İlişkiler */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">İlişkiler</h3>

            {/* Türler */}
            <div className="space-y-2">
              <Label>Türler</Label>
              <MultiSelect
                options={genres}
                selectedIds={watch('genreIds') || []}
                onSelectionChange={(ids) => setValue('genreIds', ids)}
                placeholder="Tür seçin..."
                searchPlaceholder="Tür ara..."
                disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
              />
              {errors.genreIds && (
                <p className="text-sm text-destructive">{errors.genreIds.message}</p>
              )}
            </div>

            {/* Etiketler */}
            <div className="space-y-2">
              <Label>Etiketler</Label>
              <MultiSelect
                options={tags}
                selectedIds={watch('tagIds') || []}
                onSelectionChange={(ids) => setValue('tagIds', ids)}
                placeholder="Etiket seçin..."
                searchPlaceholder="Etiket ara..."
                disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
              />
              {errors.tagIds && (
                <p className="text-sm text-destructive">{errors.tagIds.message}</p>
              )}
            </div>

            {/* Stüdyolar */}
            <div className="space-y-2">
              <Label>Stüdyolar</Label>
              <MultiSelect
                options={studios}
                selectedIds={watch('studioIds') || []}
                onSelectionChange={(ids) => setValue('studioIds', ids)}
                placeholder="Stüdyo seçin..."
                searchPlaceholder="Stüdyo ara..."
                disabled={isLoading(LOADING_KEYS.FORMS.CREATE_ANIME)}
              />
              {errors.studioIds && (
                <p className="text-sm text-destructive">{errors.studioIds.message}</p>
              )}
            </div>
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