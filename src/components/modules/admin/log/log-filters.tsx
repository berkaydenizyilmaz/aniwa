'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, RefreshCw, Filter, Calendar } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { useLoadingStore } from '@/lib/stores/loading.store';
import { LOADING_KEYS } from '@/lib/constants/loading.constants';
import { LogLevel } from '@prisma/client';

interface LogFiltersProps {
  onSearch?: (search: string) => void;
  onLevelChange?: (level: string) => void;
  onStartDateChange?: (date: string) => void;
  onEndDateChange?: (date: string) => void;
  onRefresh?: () => void;
}

export function LogFilters({ onSearch, onLevelChange, onStartDateChange, onEndDateChange, onRefresh }: LogFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedStartDate, setSelectedStartDate] = useState<string>('');
  const [selectedEndDate, setSelectedEndDate] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { isLoading } = useLoadingStore();

  // Debounced search term değiştiğinde onSearch'ü çağır
  useEffect(() => {
    onSearch?.(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level);
    onLevelChange?.(level === 'all' ? '' : level);
  };

  const handleStartDateChange = (date: string) => {
    setSelectedStartDate(date);
    onStartDateChange?.(date);
  };

  const handleEndDateChange = (date: string) => {
    setSelectedEndDate(date);
    onEndDateChange?.(date);
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

        {/* Seviye Filtresi */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedLevel} onValueChange={handleLevelChange} disabled={isLoading(LOADING_KEYS.PAGES.LOGS)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Tüm Seviyeler" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Seviyeler</SelectItem>
              {Object.values(LogLevel).map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tarih Aralığı Filtresi */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            value={selectedStartDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            className="w-[130px]"
            placeholder="Başlangıç"
            disabled={isLoading(LOADING_KEYS.PAGES.LOGS)}
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="date"
            value={selectedEndDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
            className="w-[130px]"
            placeholder="Bitiş"
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