'use client';

import { ArrowUpDown, Grid3X3, List, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AnimeSortViewProps {
  sortBy: 'popularity' | 'anilistAverageScore' | 'createdAt';
  sortOrder: 'asc' | 'desc';
  viewMode: 'card' | 'list';
  onSortChange: (sortBy: 'popularity' | 'anilistAverageScore' | 'createdAt', sortOrder: 'asc' | 'desc') => void;
  onViewModeChange: (viewMode: 'card' | 'list') => void;
}

export function AnimeSortView({ 
  sortBy, 
  sortOrder, 
  viewMode, 
  onSortChange, 
  onViewModeChange 
}: AnimeSortViewProps) {
  
  const sortOptions = [
    { value: 'popularity', label: 'Popülerlik' },
    { value: 'anilistAverageScore', label: 'Puan' },
    { value: 'createdAt', label: 'Tarih' }
  ];

  const handleSortChange = (newSortBy: string) => {
    if (newSortBy === sortBy) {
      // Aynı sıralama seçilirse sıralama yönünü değiştir
      onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Yeni sıralama seçilirse varsayılan olarak desc
      onSortChange(newSortBy as any, 'desc');
    }
  };

  return (
    <div className="flex items-center justify-between py-4 border-b">
      {/* Sıralama */}
      <div className="flex items-center gap-2">
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Görünüm Seçenekleri */}
      <div className="flex items-center gap-1">
        <Button
          variant={viewMode === 'card' ? 'default' : 'ghost'}
          size="icon"
          onClick={() => onViewModeChange('card')}
          className="h-8 w-8"
        >
          <Square className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          size="icon"
          onClick={() => onViewModeChange('list')}
          className="h-8 w-8"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
