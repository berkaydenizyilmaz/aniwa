'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/use-debounce';

interface TagFiltersProps {
  onSearch?: (search: string) => void;
  onAddNew?: () => void;
  loading?: boolean;
}

export function TagFilters({ onSearch, onAddNew, loading = false }: TagFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

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
            placeholder="Etiket ara..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Yeni Etiket Ekle */}
        <Button onClick={onAddNew} className="flex items-center gap-2" disabled={loading}>
          <Plus className="h-4 w-4" />
          Yeni Etiket Ekle
        </Button>
      </div>
    </div>
  );
} 