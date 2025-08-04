'use client';

import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { MultiSelect } from '@/components/ui/multi-select';
import { CreateAnimeSeriesInput, UpdateAnimeSeriesInput } from '@/lib/schemas/anime.schema';

interface AnimeSeriesRelationsProps {
  relations?: {
    genres: Array<{ id: string; name: string }>;
    studios: Array<{ id: string; name: string }>;
    tags: Array<{ id: string; name: string }>;
  };
}

export function AnimeSeriesRelations({ relations }: AnimeSeriesRelationsProps) {
  const form = useFormContext<CreateAnimeSeriesInput | UpdateAnimeSeriesInput>();

  return (
    <div className="space-y-6">
      {/* Türler */}
      <FormField
        control={form.control}
        name="genres"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Türler</FormLabel>
            <FormControl>
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
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Stüdyolar */}
      <FormField
        control={form.control}
        name="studios"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Stüdyolar</FormLabel>
            <FormControl>
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
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Etiketler */}
      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Etiketler</FormLabel>
            <FormControl>
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
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
} 