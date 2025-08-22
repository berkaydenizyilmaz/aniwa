'use client';

import { useState } from 'react';
import { useSettings } from '@/lib/hooks/use-settings';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Search } from 'lucide-react';
import { mockStatuses, mockCountries, mockSources, mockTags } from '@/lib/mock/anime.mock';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DetailedFiltersProps {
  onFiltersChange: (filters: any) => void;
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

  // Filter tags based on search
  const filteredTags = mockTags.filter(tag => 
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const handleFilterChange = () => {
    const filters = {
      status: status === 'all' ? undefined : status,
      country: country === 'all' ? undefined : country,
      source: source === 'all' ? undefined : source,
      yearFrom: yearFrom ? parseInt(yearFrom) : undefined,
      yearTo: yearTo ? parseInt(yearTo) : undefined,
      episodesFrom: episodesFrom ? parseInt(episodesFrom) : undefined,
      episodesTo: episodesTo ? parseInt(episodesTo) : undefined,
      durationFrom: durationFrom ? parseInt(durationFrom) : undefined,
      durationTo: durationTo ? parseInt(durationTo) : undefined,
      showAdult: showAdult,
      tags: selectedTags.length > 0 ? selectedTags : undefined
    };
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
              {mockStatuses.map((status) => (
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
              {mockCountries.map((country) => (
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
              {mockSources.map((source) => (
                <SelectItem key={source.value} value={source.value}>
                  {source.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Yetişkin İçerik (Sadece ayar açıksa göster) */}
        {(settings as any)?.displayAdultContent && (
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
              <span className="text-sm text-muted-foreground">
                {showAdult ? 'Göster' : 'Gizle'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Aralık Filtreleri */}
      <div className="space-y-4">
        <h4 className="font-medium">Aralık Filtreleri</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Yıl Aralığı */}
          <div className="space-y-2">
            <Label>Yıl Aralığı</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Başlangıç"
                value={yearFrom}
                onChange={(e) => {
                  setYearFrom(e.target.value);
                  handleFilterChange();
                }}
                className="w-full bg-background"
              />
              <Input
                placeholder="Bitiş"
                value={yearTo}
                onChange={(e) => {
                  setYearTo(e.target.value);
                  handleFilterChange();
                }}
                className="w-full bg-background"
              />
            </div>
          </div>

          {/* Bölüm Aralığı */}
          <div className="space-y-2">
            <Label>Bölüm Aralığı</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Min"
                value={episodesFrom}
                onChange={(e) => {
                  setEpisodesFrom(e.target.value);
                  handleFilterChange();
                }}
                className="w-full bg-background"
              />
              <Input
                placeholder="Max"
                value={episodesTo}
                onChange={(e) => {
                  setEpisodesTo(e.target.value);
                  handleFilterChange();
                }}
                className="w-full bg-background"
              />
            </div>
          </div>

          {/* Süre Aralığı */}
          <div className="space-y-2">
            <Label>Süre Aralığı (dk)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Min"
                value={durationFrom}
                onChange={(e) => {
                  setDurationFrom(e.target.value);
                  handleFilterChange();
                }}
                className="w-full bg-background"
              />
              <Input
                placeholder="Max"
                value={durationTo}
                onChange={(e) => {
                  setDurationTo(e.target.value);
                  handleFilterChange();
                }}
                className="w-full bg-background"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tag Seçimi */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Etiketler</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTags(!showTags)}
            className="text-sm"
          >
            {showTags ? 'Gizle' : 'Göster'} ({selectedTags.length} seçili)
          </Button>
        </div>
        
        {/* Seçili Taglar */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tagId) => {
              const tag = mockTags.find(t => t.id === tagId);
              return tag ? (
                <Badge key={tagId} variant="secondary" className="flex items-center gap-1">
                  {tag.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => removeTag(tagId)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ) : null;
            })}
          </div>
        )}

        {/* Tag Listesi - Açılır/Kapanır */}
        {showTags && (
          <div className="space-y-4">
            {/* Tag Arama */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Etiket ara..."
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>

            <div className="max-h-48 overflow-y-auto">
              {/* Tag Kategorileri */}
              <TooltipProvider>
                {Object.entries({
                  DEMOGRAPHICS: { label: 'Hedef Kitle', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
                  THEMES: { label: 'Ana Temalar', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
                  CONTENT: { label: 'İçerik Niteliği', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
                  SETTING: { label: 'Ortam', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
                  ELEMENTS: { label: 'Spesifik Öğeler', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' }
                }).map(([category, config]) => {
                  const categoryTags = filteredTags.filter(tag => tag.category === category);
                  if (categoryTags.length === 0) return null;
                  
                  return (
                    <div key={category} className="mb-4 last:mb-0">
                      <h5 className="text-sm font-medium text-muted-foreground mb-2 px-1">
                        {config.label}
                      </h5>
                      <div className="flex flex-wrap gap-1">
                        {categoryTags.map((tag) => (
                          <Tooltip key={tag.id}>
                            <TooltipTrigger asChild>
                              <Button
                                variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleTagToggle(tag.id)}
                                className={`h-6 px-2 text-xs min-w-fit ${selectedTags.includes(tag.id) ? config.color : ''}`}
                              >
                                {tag.name}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{tag.name} etiketi hakkında açıklama</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </TooltipProvider>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
