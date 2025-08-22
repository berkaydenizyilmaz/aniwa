'use client';

import { useState } from 'react';
import { Search, Filter, ChevronsUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { mockGenres, mockYears, mockSeasons, mockFormats } from '@/lib/mock/anime.mock';
import { cn } from '@/lib/utils';

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
  const [yearOpen, setYearOpen] = useState(false);

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
      <div className="flex flex-wrap gap-4 items-center">
        {/* Search - Kısaltılmış */}
        <div className="relative w-64">
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
        <Select value={genre} onValueChange={(value) => {
          setGenre(value);
          handleFilterChange();
        }}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Tür" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectItem value="all">Tür</SelectItem>
            {mockGenres.map((genre) => (
              <SelectItem key={genre.id} value={genre.id}>
                {genre.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Year - Searchable Combobox */}
        <Popover open={yearOpen} onOpenChange={setYearOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={yearOpen}
              className="w-[100px] justify-between"
            >
              {year === 'all' ? 'Yıl' : year}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[100px] p-0">
            <Command>
              <CommandInput placeholder="Yıl ara..." />
              <CommandList className="max-h-[300px]">
                <CommandEmpty>Yıl bulunamadı.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setYear('all');
                      setYearOpen(false);
                      handleFilterChange();
                    }}
                  >
                    Yıl
                  </CommandItem>
                  {mockYears.map((yearOption) => (
                    <CommandItem
                      key={yearOption}
                      onSelect={() => {
                        setYear(yearOption.toString());
                        setYearOpen(false);
                        handleFilterChange();
                      }}
                    >
                      {yearOption}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Season */}
        <Select value={season} onValueChange={(value) => {
          setSeason(value);
          handleFilterChange();
        }}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Sezon" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectItem value="all">Sezon</SelectItem>
            {mockSeasons.map((season) => (
              <SelectItem key={season.value} value={season.value}>
                {season.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Format */}
        <Select value={format} onValueChange={(value) => {
          setFormat(value);
          handleFilterChange();
        }}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Format" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectItem value="all">Format</SelectItem>
            {mockFormats.map((format) => (
              <SelectItem key={format.value} value={format.value}>
                {format.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Detailed Filters Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowDetailedFilters(!showDetailedFilters)}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Ayrıntılı Filtreler */}
      {showDetailedFilters && (
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-medium">Ayrıntılı Filtreler</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Burada daha fazla filtre eklenebilir */}
            <div className="text-sm text-muted-foreground">
              Daha fazla filtre seçeneği burada olacak...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
