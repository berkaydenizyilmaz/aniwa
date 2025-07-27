'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { useLoadingStore } from '@/lib/stores/loading.store';
import { LOADING_KEYS } from '@/lib/constants/loading.constants';

interface AnimeFiltersProps {
  onSearch?: (search: string) => void;
  onAddNew?: () => void;
}

export function AnimeFilters({ onSearch, onAddNew }: AnimeFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { isLoading } = useLoadingStore();

  // Debounced search term değiştiğinde onSearch'ü çağır
  useEffect(() => {
    onSearch?.(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div className="glass-card p-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Arama */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Anime ara..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Yeni Anime Ekle */}
        <Button onClick={onAddNew} className="flex items-center gap-2" disabled={isLoading(LOADING_KEYS.PAGES.EDITOR_ANIME_PAGE)}>
          <Plus className="h-4 w-4" />
          Yeni Anime Ekle
        </Button>
      </div>
    </div>
  );
} 