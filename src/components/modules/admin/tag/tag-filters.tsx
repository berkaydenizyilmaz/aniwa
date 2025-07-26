'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Plus, Filter } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { useLoadingStore } from '@/lib/stores/loading.store';
import { LOADING_KEYS } from '@/lib/constants/loading.constants';
import { MASTER_DATA } from '@/lib/constants/masterData.constants';

interface TagFiltersProps {
  onSearch?: (search: string) => void;
  onCategoryChange?: (category: string) => void;
  onAdultChange?: (isAdult: boolean | null) => void;
  onSpoilerChange?: (isSpoiler: boolean | null) => void;
  onAddNew?: () => void;
}

export function TagFilters({ onSearch, onCategoryChange, onAdultChange, onSpoilerChange, onAddNew }: TagFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAdult, setSelectedAdult] = useState<boolean | null>(null);
  const [selectedSpoiler, setSelectedSpoiler] = useState<boolean | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { isLoading } = useLoadingStore();

  // Debounced search term değiştiğinde onSearch'ü çağır
  useEffect(() => {
    onSearch?.(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onCategoryChange?.(category === 'all' ? '' : category);
  };

  const handleAdultChange = (isAdult: boolean | null) => {
    setSelectedAdult(isAdult);
    onAdultChange?.(isAdult);
  };

  const handleSpoilerChange = (isSpoiler: boolean | null) => {
    setSelectedSpoiler(isSpoiler);
    onSpoilerChange?.(isSpoiler);
  };

  return (
    <div className="glass-card p-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Arama */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Etiket ara..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Kategori Filtresi */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedCategory} onValueChange={handleCategoryChange} disabled={isLoading(LOADING_KEYS.PAGES.TAGS)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tüm Kategoriler" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Kategoriler</SelectItem>
              {Object.entries(MASTER_DATA.TAG_CATEGORY_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Adult ve Spoiler Filtreleri */}
        <div className="flex items-center gap-4">
          {/* Adult Filtresi */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="adult-filter"
              checked={selectedAdult === true}
              onCheckedChange={(checked) => handleAdultChange(checked ? true : null)}
              disabled={isLoading(LOADING_KEYS.PAGES.TAGS)}
            />
            <Label htmlFor="adult-filter" className="flex items-center gap-1 text-sm">
              Yetişkin İçerik
            </Label>
          </div>

          {/* Spoiler Filtresi */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="spoiler-filter"
              checked={selectedSpoiler === true}
              onCheckedChange={(checked) => handleSpoilerChange(checked ? true : null)}
              disabled={isLoading(LOADING_KEYS.PAGES.TAGS)}
            />
            <Label htmlFor="spoiler-filter" className="flex items-center gap-1 text-sm">
              Spoiler İçerik
            </Label>
          </div>
        </div>

        {/* Yeni Etiket Ekle */}
        <Button onClick={onAddNew} className="flex items-center gap-2" disabled={isLoading(LOADING_KEYS.PAGES.TAGS) || isLoading(LOADING_KEYS.FORMS.CREATE_TAG)}>
          <Plus className="h-4 w-4" />
          Yeni Etiket Ekle
        </Button>
      </div>
    </div>
  );
} 