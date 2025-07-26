'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search, Plus, Filter } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { useLoadingStore } from '@/lib/stores/loading.store';
import { LOADING_KEYS } from '@/lib/constants/loading.constants';
import { USER } from '@/lib/constants/user.constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserFiltersProps {
  onSearch?: (search: string) => void;
  onRoleChange?: (role: string) => void;
  onBannedChange?: (isBanned: boolean | null) => void;
  onAddNew?: () => void;
}

export function UserFilters({ onSearch, onRoleChange, onBannedChange, onAddNew }: UserFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedBanned, setSelectedBanned] = useState<boolean | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { isLoading } = useLoadingStore();

  // Debounced search term değiştiğinde onSearch'ü çağır
  useEffect(() => {
    onSearch?.(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    onRoleChange?.(value === 'all' ? '' : value);
  };

  const handleBannedChange = (checked: boolean | 'indeterminate') => {
    const newValue = checked === true ? true : null;
    setSelectedBanned(newValue);
    onBannedChange?.(newValue);
  };

  return (
    <div className="glass-card p-4">
      <div className="flex flex-col gap-4">
        {/* Üst satır - Arama ve Yeni Ekle */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Arama */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Kullanıcı ara..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
              disabled={isLoading(LOADING_KEYS.PAGES.USERS)}
            />
          </div>

          {/* Yeni Kullanıcı Ekle */}
          <Button onClick={onAddNew} className="flex items-center gap-2" disabled={isLoading(LOADING_KEYS.PAGES.USERS) || isLoading(LOADING_KEYS.FORMS.CREATE_USER)}>
            <Plus className="h-4 w-4" />
            Yeni Kullanıcı Ekle
          </Button>
        </div>

        {/* Alt satır - Filtreler */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* Rol Filtresi */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedRole} onValueChange={handleRoleChange} disabled={isLoading(LOADING_KEYS.PAGES.USERS)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tüm Roller" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Roller</SelectItem>
                {Object.values(USER.ROLES).map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ban Durumu Filtresi */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="banned-filter"
              checked={selectedBanned === true}
              onCheckedChange={handleBannedChange}
              disabled={isLoading(LOADING_KEYS.PAGES.USERS)}
            />
            <Label htmlFor="banned-filter" className="flex items-center gap-1 text-sm">
              Banlı Kullanıcılar
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
} 