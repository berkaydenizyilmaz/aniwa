'use client';

import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DetailedFilters } from './detailed-filters';
import { AnimeListFiltersInput } from '@/lib/schemas/anime-list.schema';
import { Season, AnimeType } from '@prisma/client';
import { getFilterOptions } from '@/lib/actions/anime/anime-list.action';
import { toast } from 'sonner';
import { ANIME_DOMAIN } from '@/lib/constants';

interface AnimeFiltersProps {
  onFiltersChange: (filters: Partial<AnimeListFiltersInput>) => void;
}

export function AnimeFilters({ onFiltersChange }: AnimeFiltersProps) {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('all');
  const [year, setYear] = useState('all');
  const [season, setSeason] = useState('all');
  const [format, setFormat] = useState('all');
  const [showDetailedFilters, setShowDetailedFilters] = useState(false);
  
  // Filtreleme seçenekleri
  const [filterOptions, setFilterOptions] = useState<{
    genres: Array<{ id: string; name: string }>;
    tags: Array<{ id: string; name: string; category: string; description: string }>;
    studios: Array<{ id: string; name: string }>;
  }>({
    genres: [],
    tags: [],
    studios: []
  });
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  // Filtreleme seçeneklerini yükle
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const result = await getFilterOptions();
        if (result.success && result.data) {
          setFilterOptions(result.data as typeof filterOptions);
        } else {
          toast.error('Filtreleme seçenekleri yüklenemedi');
        }
      } catch (error) {
        console.error('Filtreleme seçenekleri yüklenemedi:', error);
        toast.error('Filtreleme seçenekleri yüklenemedi');
      } finally {
        setIsLoadingOptions(false);
      }
    };

    loadFilterOptions();
  }, []);

  // Sabit seçenekler - constants'tan alınan
  const years = Array.from(
    { length: 30 }, // Son 30 yıl
    (_, i) => new Date().getFullYear() - i
  );

  const seasons = Object.entries(ANIME_DOMAIN.UI.SEASON_LABELS).map(([value, label]) => ({
    value,
    label
  }));

  const formats = Object.entries(ANIME_DOMAIN.UI.TYPE_LABELS).map(([value, label]) => ({
    value,
    label
  }));



  return (
    <div className="space-y-4">
      {/* Temel Filtreler */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center flex-1">
          {/* Search - Kısaltılmış */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Anime ara..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                // Search özelliği backend'de henüz implementasyon olmadığından disabled
              }}
              className="pl-10"
              disabled
            />
          </div>

          {/* Selects in pairs on mobile */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 w-full sm:w-auto">
            {/* Genres */}
            <Select value={genre === 'all' ? '' : genre} onValueChange={(value) => {
              const newGenre = value || 'all';
              setGenre(newGenre);
              
              // Filter güncelle
              const filters: Partial<AnimeListFiltersInput> = {};
              if (newGenre !== 'all') {
                filters.genres = [newGenre];
              }
              if (year !== 'all') {
                filters.year = parseInt(year);
              }
              if (season !== 'all') {
                filters.season = season as Season;
              }
              if (format !== 'all') {
                filters.type = format as AnimeType;
              }
              onFiltersChange(filters);
            }}>
              <SelectTrigger className="w-full sm:w-[130px] md:w-[110px] rounded-sm">
                <SelectValue placeholder={isLoadingOptions ? "Yükleniyor..." : "Tür"} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">Tümü</SelectItem>
                {filterOptions.genres.map((genreOption) => (
                  <SelectItem key={genreOption.id} value={genreOption.id}>
                    {genreOption.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Year */}
            <Select value={year === 'all' ? '' : year} onValueChange={(value) => {
              const newYear = value || 'all';
              setYear(newYear);
              
              // Filter güncelle
              const filters: Partial<AnimeListFiltersInput> = {};
              if (genre !== 'all') {
                filters.genres = [genre];
              }
              if (newYear !== 'all') {
                filters.year = parseInt(newYear);
              }
              if (season !== 'all') {
                filters.season = season as Season;
              }
              if (format !== 'all') {
                filters.type = format as AnimeType;
              }
              onFiltersChange(filters);
            }}>
              <SelectTrigger className="w-full sm:w-[120px] md:w-[100px] rounded-sm">
                <SelectValue placeholder="Yıl" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">Tümü</SelectItem>
                {years.map((yearOption) => (
                  <SelectItem key={yearOption} value={yearOption.toString()}>
                    {yearOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Season */}
            <Select value={season === 'all' ? '' : season} onValueChange={(value) => {
              const newSeason = value || 'all';
              setSeason(newSeason);
              
              // Filter güncelle
              const filters: Partial<AnimeListFiltersInput> = {};
              if (genre !== 'all') {
                filters.genres = [genre];
              }
              if (year !== 'all') {
                filters.year = parseInt(year);
              }
              if (newSeason !== 'all') {
                filters.season = newSeason as Season;
              }
              if (format !== 'all') {
                filters.type = format as AnimeType;
              }
              onFiltersChange(filters);
            }}>
              <SelectTrigger className="w-full sm:w-[120px] md:w-[100px]">
                <SelectValue placeholder="Sezon" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">Tümü</SelectItem>
                {seasons.map((seasonOption) => (
                  <SelectItem key={seasonOption.value} value={seasonOption.value}>
                    {seasonOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Format */}
            <Select value={format === 'all' ? '' : format} onValueChange={(value) => {
              const newFormat = value || 'all';
              setFormat(newFormat);
              
              // Filter güncelle
              const filters: Partial<AnimeListFiltersInput> = {};
              if (genre !== 'all') {
                filters.genres = [genre];
              }
              if (year !== 'all') {
                filters.year = parseInt(year);
              }
              if (season !== 'all') {
                filters.season = season as Season;
              }
              if (newFormat !== 'all') {
                filters.type = newFormat as AnimeType;
              }
              onFiltersChange(filters);
            }}>
              <SelectTrigger className="w-full sm:w-[120px] md:w-[100px]">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">Tümü</SelectItem>
                {formats.map((formatOption) => (
                  <SelectItem key={formatOption.value} value={formatOption.value}>
                    {formatOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Detailed Filters Button */}
        <Button
          variant={showDetailedFilters ? "default" : "outline"}
          size="icon"
          onClick={() => setShowDetailedFilters(!showDetailedFilters)}
          className="self-start"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Ayrıntılı Filtreler */}
      {showDetailedFilters && (
        <DetailedFilters onFiltersChange={onFiltersChange} />
      )}
    </div>
  );
}
