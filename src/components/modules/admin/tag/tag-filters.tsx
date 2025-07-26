'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Filter } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { useLoadingStore } from '@/lib/stores/loading.store';
import { LOADING_KEYS } from '@/lib/constants/loading.constants';
import { MASTER_DATA } from '@/lib/constants/masterData.constants';

interface TagFiltersProps {
  onSearch?: (search: string) => void;
  onCategoryChange?: (category: string) => void;
  onAddNew?: () => void;
}

export function TagFilters({ onSearch, onCategoryChange, onAddNew }: TagFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
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
    onCategoryChange?.(category);
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
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            disabled={isLoading(LOADING_KEYS.PAGES.TAGS)}
          >
            <option value="">Tüm Kategoriler</option>
            {Object.entries(MASTER_DATA.TAG_CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
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