'use client';

import { useState, useEffect, memo } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/use-debounce';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export function SearchInput({ 
  value, 
  onChange, 
  placeholder = 'Ara...',
  className = '',
  debounceMs = 300
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const debouncedValue = useDebounce(inputValue, debounceMs);

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Debounced value değiştiğinde parent'a bildir
  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  // Parent'tan gelen value değiştiğinde input'u güncelle
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Search icon
  const searchIcon = (
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
  );

  return (
    <div className={`relative ${className}`}>
      {searchIcon}
      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        className="pl-10 bg-card/80 backdrop-blur-sm border border-border/20 focus:border-primary/50 transition-all duration-200"
      />
    </div>
  );
} 