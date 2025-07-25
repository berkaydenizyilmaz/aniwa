'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { useLoadingStore } from '@/lib/stores/loading.store';
import { LOADING_KEYS } from '@/lib/constants/loading.constants';

interface LogFiltersProps {
  onSearch?: (search: string) => void;
  onRefresh?: () => void;
}

export function LogFilters({ onSearch, onRefresh }: LogFiltersProps) {
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
            placeholder="Log ara..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
            disabled={isLoading(LOADING_KEYS.PAGES.LOGS)}
          />
        </div>

        {/* Refresh Butonu */}
        <Button 
          onClick={onRefresh} 
          disabled={isLoading(LOADING_KEYS.PAGES.LOGS)}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading(LOADING_KEYS.PAGES.LOGS) ? 'animate-spin' : ''}`} />
          Yenile
        </Button>
      </div>
    </div>
  );
} 