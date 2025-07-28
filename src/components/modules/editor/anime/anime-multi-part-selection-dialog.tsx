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

interface AnimeMultiPartSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedType: AnimeType;
  onMultiPartSelect: (isMultiPart: boolean) => void;
}

export function AnimeMultiPartSelectionDialog({ 
  open, 
  onOpenChange, 
  selectedType,
  onMultiPartSelect 
}: AnimeMultiPartSelectionDialogProps) {
  const [isMultiPart, setIsMultiPart] = useState<boolean | null>(null);

  const handleMultiPartSelect = (multiPart: boolean) => {
    setIsMultiPart(multiPart);
  };

  const handleConfirm = () => {
    if (isMultiPart !== null) {
      onMultiPartSelect(isMultiPart);
      onOpenChange(false);
      setIsMultiPart(null);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setIsMultiPart(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Parça Türü Seçin</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-muted-foreground">
            <strong>{selectedType}</strong> türü için parça türünü seçin:
          </p>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={isMultiPart === false ? "default" : "outline"}
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => handleMultiPartSelect(false)}
            >
              <span className="font-semibold">Tek Parça</span>
              <span className="text-sm text-muted-foreground">Tek bölüm/film</span>
            </Button>
            
            <Button
              variant={isMultiPart === true ? "default" : "outline"}
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => handleMultiPartSelect(true)}
            >
              <span className="font-semibold">Çok Parçalı</span>
              <span className="text-sm text-muted-foreground">Birden fazla bölüm</span>
            </Button>
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
              disabled={isMultiPart === null}
            >
              Devam Et
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 