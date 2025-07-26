'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search, Plus } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { useLoadingStore } from '@/lib/stores/loading.store';
import { LOADING_KEYS } from '@/lib/constants/loading.constants';

interface StudioFiltersProps {
  onSearch?: (search: string) => void;
  onStudioTypeChange?: (isAnimationStudio: boolean | null) => void;
  onAddNew?: () => void;
}

export function StudioFilters({ onSearch, onStudioTypeChange, onAddNew }: StudioFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudioType, setSelectedStudioType] = useState<boolean | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { isLoading } = useLoadingStore();

  // Debounced search term değiştiğinde onSearch'ü çağır
  useEffect(() => {
    onSearch?.(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleStudioTypeChange = (isAnimationStudio: boolean | null) => {
    setSelectedStudioType(isAnimationStudio);
    onStudioTypeChange?.(isAnimationStudio);
  };

  return (
    <div className="glass-card p-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Arama */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Stüdyo ara..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stüdyo Türü Filtresi */}
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="animation-studio-filter"
              checked={selectedStudioType === true}
              onCheckedChange={(checked) => handleStudioTypeChange(checked ? true : null)}
              disabled={isLoading(LOADING_KEYS.PAGES.STUDIOS)}
            />
            <Label htmlFor="animation-studio-filter" className="flex items-center gap-1 text-sm">
              Animasyon Stüdyosu
            </Label>
          </div>
        </div>

        {/* Yeni Stüdyo Ekle */}
        <Button onClick={onAddNew} className="flex items-center gap-2" disabled={isLoading(LOADING_KEYS.PAGES.STUDIOS) || isLoading(LOADING_KEYS.FORMS.CREATE_STUDIO)}>
          <Plus className="h-4 w-4" />
          Yeni Stüdyo Ekle
        </Button>
      </div>
    </div>
  );
} 