'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Filter } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { AnimeType, AnimeStatus } from '@prisma/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AnimeSeriesFiltersProps {
  onSearch?: (search: string) => void;
  onTypeChange?: (type: string) => void;
  onStatusChange?: (status: string) => void;
  onAddNew?: () => void;
}

export function AnimeSeriesFilters({ onSearch, onTypeChange, onStatusChange, onAddNew }: AnimeSeriesFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Debounced search term değiştiğinde onSearch'ü çağır
  useEffect(() => {
    onSearch?.(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    onTypeChange?.(value === 'all' ? '' : value);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    onStatusChange?.(value === 'all' ? '' : value);
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
            disabled={false}
          />
        </div>

        {/* Tip Filtresi */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedType} onValueChange={handleTypeChange} disabled={false}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tüm Tipler" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Tipler</SelectItem>
              {Object.values(AnimeType).map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Durum Filtresi */}
        <div className="flex items-center gap-2">
          <Select value={selectedStatus} onValueChange={handleStatusChange} disabled={false}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tüm Durumlar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Durumlar</SelectItem>
              {Object.values(AnimeStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Yeni Anime Ekle */}
        <Button onClick={onAddNew} className="flex items-center gap-2" disabled={false}>
          <Plus className="h-4 w-4" />
          Yeni Anime Ekle
        </Button>
      </div>
    </div>
  );
} 