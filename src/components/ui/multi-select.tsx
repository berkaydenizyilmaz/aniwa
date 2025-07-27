'use client';

import { useState } from 'react';
import { CheckIcon, ChevronsUpDownIcon, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';

interface MultiSelectProps {
  options: { id: string; name: string }[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  placeholder: string;
  searchPlaceholder: string;
  disabled?: boolean;
  className?: string;
}

export function MultiSelect({ 
  options, 
  selectedIds, 
  onSelectionChange, 
  placeholder, 
  searchPlaceholder, 
  disabled,
  className 
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedItems = options.filter(option => selectedIds.includes(option.id));

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const handleRemove = (id: string) => {
    onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-9 border-2 border-border/60 data-[placeholder]:text-muted-foreground focus-visible:border-primary/80 focus-visible:ring-primary/20 transition-colors outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 hover:bg-transparent hover:text-foreground hover:border-border/60"
            disabled={disabled}
          >
            {selectedItems.length > 0 ? (
              <span className="text-sm">
                {selectedItems.length} öğe seçildi
              </span>
            ) : (
              <span className="text-muted-foreground text-sm">{placeholder}</span>
            )}
            <ChevronsUpDownIcon className="size-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command className="rounded-md border shadow-md">
            <CommandInput placeholder={searchPlaceholder} className="border-0 focus:ring-0 placeholder:text-muted-foreground" />
            <CommandList className="max-h-[300px]">
              <CommandEmpty className="text-muted-foreground py-6">Sonuç bulunamadı.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.id}
                    onSelect={() => handleSelect(option.id)}
                    className="relative flex w-full items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground group"
                  >
                    <CheckIcon
                      className={cn(
                        "absolute right-2 size-4",
                        selectedIds.includes(option.id) ? "opacity-100" : "opacity-0",
                        "group-focus:text-accent-foreground"
                      )}
                    />
                    <span className={cn(
                      selectedIds.includes(option.id) ? "font-medium" : ""
                    )}>
                      {option.name}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {/* Seçilen öğeleri göster */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-muted/30 rounded-md border border-border/50">
          {selectedItems.map((item) => (
            <Badge 
              key={item.id} 
              variant="secondary" 
              className="text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors group"
            >
              {item.name}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(item.id)}
                className="ml-1.5 h-auto p-0.5 hover:bg-primary/20 transition-colors"
              >
                <XIcon className="h-3 w-3 text-primary/70 group-hover:text-primary" />
                <span className="sr-only">Kaldır</span>
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
} 