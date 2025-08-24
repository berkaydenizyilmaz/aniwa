'use client';

import { ArrowUpDown, Grid2X2, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ANIME_DOMAIN } from '@/lib/constants';

type SortByType = 'popularity' | 'anilistAverageScore' | 'createdAt' | 'title';

interface AnimeSortViewProps {
  sortBy: SortByType;
  sortOrder: 'asc' | 'desc';
  viewMode: 'card' | 'list';
  onSortChange: (sortBy: SortByType, sortOrder: 'asc' | 'desc') => void;
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
    { value: ANIME_DOMAIN.LIST.SORT.OPTIONS.POPULARITY, label: 'Popülerlik' },
    { value: ANIME_DOMAIN.LIST.SORT.OPTIONS.ANILIST_SCORE, label: 'Puan' },
    { value: ANIME_DOMAIN.LIST.SORT.OPTIONS.CREATED_AT, label: 'Tarih' },
    { value: ANIME_DOMAIN.LIST.SORT.OPTIONS.TITLE, label: 'Başlık' }
  ];

  const handleSortChange = (newSortBy: string) => {
    if (newSortBy === sortBy) {
      // Aynı sıralama seçilirse sıralama yönünü değiştir
      onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Yeni sıralama seçilirse varsayılan olarak desc
      onSortChange(newSortBy as SortByType, 'desc');
    }
  };

  return (
    <div className="flex items-center justify-between py-4">
      {/* Sıralama */}
      <div className="flex items-center gap-2">
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-fit border-none shadow-none bg-transparent hover:bg-transparent focus:bg-transparent focus-visible:ring-0 focus-visible:border-none p-0 h-auto outline-none [&>svg:not(.arrow-icon)]:hidden flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground arrow-icon" />
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
          <Grid2X2 className="h-4 w-4" />
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
