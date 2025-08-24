'use client';

import { useState, useEffect } from 'react';
import { useSettings } from '@/lib/hooks/use-settings';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { AnimeListFiltersInput } from '@/lib/schemas/anime-list.schema';
import { getFilterOptions } from '@/lib/actions/anime/anime-list.action';
import { toast } from 'sonner';
import { ANIME_DOMAIN } from '@/lib/constants';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DetailedFiltersProps {
  onFiltersChange: (filters: Partial<AnimeListFiltersInput>) => void;
}

export function DetailedFilters({ onFiltersChange }: DetailedFiltersProps) {
  const [status, setStatus] = useState('all');
  const [country, setCountry] = useState('all');
  const [source, setSource] = useState('all');
  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');
  const [episodesFrom, setEpisodesFrom] = useState('');
  const [episodesTo, setEpisodesTo] = useState('');
  const [durationFrom, setDurationFrom] = useState('');
  const [durationTo, setDurationTo] = useState('');
  const [showAdult, setShowAdult] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTags, setShowTags] = useState(false);
  const [tagSearch, setTagSearch] = useState('');

  const { settings } = useSettings();

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
  const statuses = Object.entries(ANIME_DOMAIN.UI.STATUS_LABELS).map(([value, label]) => ({
    value,
    label
  }));

  const countries = Object.entries(ANIME_DOMAIN.UI.COUNTRY_OF_ORIGIN_LABELS).map(([value, label]) => ({
    value,
    label
  }));

  const sources = Object.entries(ANIME_DOMAIN.UI.SOURCE_LABELS).map(([value, label]) => ({
    value,
    label
  }));

  // Filter tags based on search
  const filteredTags = filterOptions.tags.filter(tag => 
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const handleFilterChange = () => {
    const filters: Partial<AnimeListFiltersInput> = {};
    
    if (status !== 'all') {
      filters.status = status as any;
    }
    
    if (yearFrom) {
      filters.year = parseInt(yearFrom);
    }
    
    if (showAdult !== undefined) {
      filters.isAdult = showAdult;
    }
    
    if (selectedTags.length > 0) {
      filters.tags = selectedTags;
    }
    
    onFiltersChange(filters);
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const removeTag = (tagId: string) => {
    setSelectedTags(prev => prev.filter(id => id !== tagId));
  };

  return (
    <div className="bg-white dark:bg-gray-900 border rounded-lg p-4 space-y-6">
      <h3 className="font-medium text-lg">Ayrıntılı Filtreler</h3>
      
      {/* Temel Filtreler */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Yayınlanma Durumu */}
        <div className="space-y-2">
          <Label>Yayınlanma Durumu</Label>
          <Select value={status} onValueChange={(value) => {
            setStatus(value);
            handleFilterChange();
          }}>
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Durum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ülke */}
        <div className="space-y-2">
          <Label>Ülke</Label>
          <Select value={country} onValueChange={(value) => {
            setCountry(value);
            handleFilterChange();
          }}>
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Ülke" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Kaynak */}
        <div className="space-y-2">
          <Label>Kaynak</Label>
          <Select value={source} onValueChange={(value) => {
            setSource(value);
            handleFilterChange();
          }}>
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Kaynak" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              {sources.map((source) => (
                <SelectItem key={source.value} value={source.value}>
                  {source.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Yetişkin İçerik */}
        <div className="space-y-2">
          <Label>Yetişkin İçerik</Label>
          <div className="flex items-center space-x-2">
            <Switch
              checked={showAdult}
              onCheckedChange={(checked) => {
                setShowAdult(checked);
                handleFilterChange();
              }}
            />
            <span className="text-sm text-muted-foreground">Göster</span>
          </div>
        </div>
      </div>

      {/* Yıl Aralığı */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Yıl (Başlangıç)</Label>
          <Input
            type="number"
            placeholder="2020"
            value={yearFrom}
            onChange={(e) => {
              setYearFrom(e.target.value);
              handleFilterChange();
            }}
            min={ANIME_DOMAIN.VALIDATION.YEAR.MIN}
            max={ANIME_DOMAIN.VALIDATION.YEAR.MAX}
          />
        </div>
        <div className="space-y-2">
          <Label>Yıl (Bitiş)</Label>
          <Input
            type="number"
            placeholder="2023"
            value={yearTo}
            onChange={(e) => {
              setYearTo(e.target.value);
              handleFilterChange();
            }}
            min={ANIME_DOMAIN.VALIDATION.YEAR.MIN}
            max={ANIME_DOMAIN.VALIDATION.YEAR.MAX}
          />
        </div>
      </div>

      {/* Etiketler */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Etiketler</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTags(!showTags)}
          >
            {showTags ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {/* Seçili Etiketler */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tagId) => {
              const tag = filterOptions.tags.find(t => t.id === tagId);
              return tag ? (
                <Badge key={tagId} variant="secondary" className="gap-1">
                  {tag.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => removeTag(tagId)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ) : null;
            })}
          </div>
        )}

        {/* Etiket Seçimi */}
        {showTags && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Etiket ara..."
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <TooltipProvider>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                {filteredTags.map((tag) => (
                  <Tooltip key={tag.id}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTagToggle(tag.id)}
                        className="flex items-center gap-2 text-left hover:text-primary transition-colors cursor-pointer"
                      >
                        {tag.name}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{tag.description}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );
}
