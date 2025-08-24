'use client';

import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DetailedFilters } from './detailed-filters';
import { AnimeListFiltersInput } from '@/lib/schemas/anime-list.schema';
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
  const [filterOptions, setFilterOptions] = useState({
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
          setFilterOptions(result.data as {
            genres: Array<{ id: string; name: string }>;
            tags: Array<{ id: string; name: string; category: string; description: string }>;
            studios: Array<{ id: string; name: string }>;
          });
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
    { length: ANIME_DOMAIN.VALIDATION.YEAR.MAX - ANIME_DOMAIN.VALIDATION.YEAR.MIN + 1 },
    (_, i) => ANIME_DOMAIN.VALIDATION.YEAR.MAX - i
  ).slice(0, 20); // Son 20 yıl

  const seasons = Object.entries(ANIME_DOMAIN.UI.SEASON_LABELS).map(([value, label]) => ({
    value,
    label
  }));

  const formats = Object.entries(ANIME_DOMAIN.UI.TYPE_LABELS).map(([value, label]) => ({
    value,
    label
  }));

  const handleFilterChange = () => {
    const filters: Partial<AnimeListFiltersInput> = {};
    
    if (search.trim()) {
      // Search için backend'de implementasyon gerekli
      console.log('Search:', search);
    }
    
    if (genre !== 'all') {
      filters.genres = [genre];
    }
    
    if (year !== 'all') {
      filters.year = parseInt(year);
    }
    
    if (season !== 'all') {
      filters.season = season as any;
    }
    
    if (format !== 'all') {
      filters.type = format as any;
    }
    
    onFiltersChange(filters);
  };

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
                handleFilterChange();
              }}
              className="pl-10"
            />
          </div>

          {/* Selects in pairs on mobile */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 w-full sm:w-auto">
            {/* Genres */}
            <Select value={genre === 'all' ? '' : genre} onValueChange={(value) => {
              setGenre(value);
              handleFilterChange();
            }}>
              <SelectTrigger className="w-full sm:w-[130px] md:w-[110px] rounded-sm">
                <SelectValue placeholder={isLoadingOptions ? "Yükleniyor..." : "Tür"} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">Tümü</SelectItem>
                {filterOptions.genres.map((genre: any) => (
                  <SelectItem key={genre.id} value={genre.id}>
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Year */}
            <Select value={year === 'all' ? '' : year} onValueChange={(value) => {
              setYear(value);
              handleFilterChange();
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
              setSeason(value);
              handleFilterChange();
            }}>
              <SelectTrigger className="w-full sm:w-[120px] md:w-[100px]">
                <SelectValue placeholder="Sezon" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">Tümü</SelectItem>
                {seasons.map((season) => (
                  <SelectItem key={season.value} value={season.value}>
                    {season.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Format */}
            <Select value={format === 'all' ? '' : format} onValueChange={(value) => {
              setFormat(value);
              handleFilterChange();
            }}>
              <SelectTrigger className="w-full sm:w-[120px] md:w-[100px]">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">Tümü</SelectItem>
                {formats.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
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
