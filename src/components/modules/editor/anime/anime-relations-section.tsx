'use client';

import { UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { CreateAnimeSeriesInput, UpdateAnimeSeriesInput } from '@/lib/schemas/anime.schema';
import { LOADING_KEYS, LoadingKey } from '@/lib/constants/loading.constants';
import { Genre, Tag, Studio } from '@prisma/client';

interface AnimeRelationsSectionProps {
  form: {
    watch: UseFormWatch<CreateAnimeSeriesInput | UpdateAnimeSeriesInput>;
    setValue: UseFormSetValue<CreateAnimeSeriesInput | UpdateAnimeSeriesInput>;
    formState: { errors: FieldErrors<CreateAnimeSeriesInput | UpdateAnimeSeriesInput> };
  };
  isLoading: (key: LoadingKey) => boolean;
  genres: Genre[];
  tags: Tag[];
  studios: Studio[];
}

export function AnimeRelationsSection({ 
  form, 
  isLoading, 
  genres, 
  tags, 
  studios 
}: AnimeRelationsSectionProps) {
  const { watch, setValue, formState: { errors } } = form;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">İlişkiler</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
    </div>
  );
} 