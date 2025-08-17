'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AnimeType, AnimeStatus, Season, Source, CountryOfOrigin } from '@prisma/client';
import { ANIME_DOMAIN } from '@/lib/constants';
import { CreateAnimeSeriesInput, UpdateAnimeSeriesInput } from '@/lib/schemas/anime.schema';

export function AnimeSeriesBasicInfo() {
  const form = useFormContext<CreateAnimeSeriesInput | UpdateAnimeSeriesInput>();

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Başlık *</FormLabel>
            <FormControl>
              <Input
                placeholder="Anime başlığı"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* İngilizce Başlık */}
      <FormField
        control={form.control}
        name="englishTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>İngilizce Başlık</FormLabel>
            <FormControl>
              <Input
                placeholder="English title"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Yerel Başlık */}
      <FormField
        control={form.control}
        name="nativeTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Yerel Başlık</FormLabel>
            <FormControl>
              <Input
                placeholder="Yerel başlık"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Özet */}
      <FormField
        control={form.control}
        name="synopsis"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Özet</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Anime özeti..."
                rows={4}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Tip ve Durum */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tip *</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                onOpenChange={(open) => {
                  if (!open && !field.value) {
                    field.onBlur();
                  }
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Tip seçin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(AnimeType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {ANIME_DOMAIN.UI.TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Durum *</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                onOpenChange={(open) => {
                  if (!open && !field.value) {
                    field.onBlur();
                  }
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Durum seçin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(AnimeStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {ANIME_DOMAIN.UI.STATUS_LABELS[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Sezon ve Yıl */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="season"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sezon</FormLabel>
              <Select 
                value={field.value || 'none'} 
                onValueChange={(value) => field.onChange(value === 'none' ? undefined : value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sezon seçin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Sezon yok</SelectItem>
                  {Object.values(Season).map((season) => (
                    <SelectItem key={season} value={season}>
                      {ANIME_DOMAIN.UI.SEASON_LABELS[season]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Yıl</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="2024"
                  min={1900}
                  max={2100}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Yayın Tarihi */}
      <FormField
        control={form.control}
        name="releaseDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Yayın Tarihi</FormLabel>
            <FormControl>
              <Input
                type="date"
                value={field.value ? field.value.toISOString().split('T')[0] : ''}
                onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Kaynak */}
      <FormField
        control={form.control}
        name="source"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Kaynak</FormLabel>
            <Select 
              value={field.value || 'none'} 
              onValueChange={(value) => field.onChange(value === 'none' ? undefined : value)}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Kaynak seçin" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">Kaynak yok</SelectItem>
                {Object.values(Source).map((source) => (
                  <SelectItem key={source} value={source}>
                    {ANIME_DOMAIN.UI.SOURCE_LABELS[source]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Ülke ve Yetişkin İçerik */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="countryOfOrigin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Köken Ülke</FormLabel>
              <Select 
                value={field.value || 'none'} 
                onValueChange={(value) => field.onChange(value === 'none' ? undefined : value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Ülke seçin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Ülke yok</SelectItem>
                  {Object.values(CountryOfOrigin).map((country) => (
                    <SelectItem key={country} value={country}>
                      {ANIME_DOMAIN.UI.COUNTRY_OF_ORIGIN_LABELS[country]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isAdult"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Yetişkin İçerik (18+)</FormLabel>
            </FormItem>
          )}
        />
      </div>

      {/* Trailer URL */}
      <FormField
        control={form.control}
        name="trailer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Trailer URL</FormLabel>
            <FormControl>
              <Input
                placeholder="https://www.youtube.com/watch?v=..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Alternatif Başlıklar */}
      <FormField
        control={form.control}
        name="synonyms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alternatif Başlıklar</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Her satıra bir başlık yazın..."
                rows={3}
                value={field.value?.join('\n') || ''}
                onChange={(e) => {
                  const lines = e.target.value.split('\n').filter(line => line.trim() !== '');
                  field.onChange(lines);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
} 