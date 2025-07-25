'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';

interface GenreFiltersProps {
  onSearch?: (search: string) => void;
  onAddNew?: () => void;
}

export function GenreFilters({ onSearch, onAddNew }: GenreFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  return (
    <div className="glass-card p-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Arama */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Tür ara..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Yeni Tür Ekle */}
        <Button onClick={onAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Yeni Tür Ekle
        </Button>
      </div>
    </div>
  );
} 