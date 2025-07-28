'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AnimeSeries, AnimeType } from '@prisma/client';
import { SinglePartAnimeForm } from './single-part-anime-form';
import { MultiPartAnimeForm } from './multi-part-anime-form';

interface AnimeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anime?: AnimeSeries | null;
  selectedType?: AnimeType;
  onSuccess?: () => void;
}

export function AnimeFormDialog({ 
  open, 
  onOpenChange, 
  anime, 
  selectedType,
  onSuccess 
}: AnimeFormDialogProps) {
  const isEdit = !!anime;
  const currentType = selectedType || anime?.type;

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleSuccess = () => {
    onSuccess?.();
    onOpenChange(false);
  };

  // MOVIE ise tek parçalı form, diğerleri çok parçalı
  const isSinglePart = currentType === AnimeType.MOVIE;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Anime Serisi Düzenle' : `Yeni ${currentType || 'Anime'} Serisi Ekle`}
          </DialogTitle>
        </DialogHeader>

        {isSinglePart ? (
          <SinglePartAnimeForm
            anime={anime}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        ) : (
          <MultiPartAnimeForm
            anime={anime}
            selectedType={currentType!}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}
      </DialogContent>
    </Dialog>
  );
} 