'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockGenres, mockYears, mockSeasons, mockFormats } from '@/lib/mock/anime.mock';
import { DetailedFilters } from './detailed-filters';

interface AnimeFiltersProps {
  onFiltersChange: (filters: any) => void;
}

export function AnimeFilters({ onFiltersChange }: AnimeFiltersProps) {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('all');
  const [year, setYear] = useState('all');
  const [season, setSeason] = useState('all');
  const [format, setFormat] = useState('all');
  const [showDetailedFilters, setShowDetailedFilters] = useState(false);

  const handleFilterChange = () => {
    const filters = {
      search,
      genre: genre === 'all' ? undefined : genre,
      year: year === 'all' ? undefined : parseInt(year),
      season: season === 'all' ? undefined : season,
      format: format === 'all' ? undefined : format
    };
    onFiltersChange(filters);
  };

  return (
    <div className="space-y-4">
      {/* Temel Filtreler */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center">
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

          {/* Genres */}
          <Select value={genre === 'all' ? '' : genre} onValueChange={(value) => {
            setGenre(value);
            handleFilterChange();
          }}>
            <SelectTrigger className="w-full sm:w-[160px] rounded-sm">
              <SelectValue placeholder="Tür" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <SelectItem value="all">Tümü</SelectItem>
              {mockGenres.map((genre) => (
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
            <SelectTrigger className="w-full sm:w-[140px] rounded-sm">
              <SelectValue placeholder="Yıl" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <SelectItem value="all">Tümü</SelectItem>
              {mockYears.map((yearOption) => (
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
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Sezon" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <SelectItem value="all">Tümü</SelectItem>
              {mockSeasons.map((season) => (
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
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <SelectItem value="all">Tümü</SelectItem>
              {mockFormats.map((format) => (
                <SelectItem key={format.value} value={format.value}>
                  {format.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Detailed Filters Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowDetailedFilters(!showDetailedFilters)}
          className="self-start lg:self-auto"
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
