'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AnimeType } from '@prisma/client';

interface AnimeTypeSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTypeSelect: (type: AnimeType) => void;
}

export function AnimeTypeSelectionDialog({ 
  open, 
  onOpenChange, 
  onTypeSelect 
}: AnimeTypeSelectionDialogProps) {
  const [selectedType, setSelectedType] = useState<AnimeType | null>(null);

  const handleTypeSelect = (type: AnimeType) => {
    setSelectedType(type);
  };

  const handleConfirm = () => {
    if (selectedType) {
      onTypeSelect(selectedType);
      onOpenChange(false);
      setSelectedType(null);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setSelectedType(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Anime Türü Seçin</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-muted-foreground">
            Hangi türde anime serisi oluşturmak istiyorsunuz?
          </p>

          <div className="grid grid-cols-2 gap-3">
            {Object.values(AnimeType).map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                className="h-20 flex flex-col items-center justify-center gap-2"
                onClick={() => handleTypeSelect(type)}
              >
                <span className="font-semibold">{type}</span>
              </Button>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
            >
              İptal
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedType}
            >
              Devam Et
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

 