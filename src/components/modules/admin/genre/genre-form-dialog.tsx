'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createGenreAction, updateGenreAction } from '@/lib/actions/genre.action';
import { createGenreSchema, type CreateGenreInput } from '@/lib/schemas/genre.schema';
import { toast } from 'sonner';
import { Genre } from '@prisma/client';

interface GenreFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  genre?: Genre | null;
  onSuccess?: () => void;
}

export function GenreFormDialog({ open, onOpenChange, genre, onSuccess }: GenreFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!genre;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateGenreInput>({
    resolver: zodResolver(createGenreSchema),
    defaultValues: {
      name: '',
    },
  });

  // Form'u genre verisi ile doldur (edit mode)
  useEffect(() => {
    if (genre) {
      reset({
        name: genre.name,
      });
    } else {
      reset({
        name: '',
      });
    }
  }, [genre, reset]);

  const onSubmit = async (data: CreateGenreInput) => {
    if (isLoading) return; // Prevent double submission
    
    setIsLoading(true);

    try {
      let result;
      
      if (isEdit && genre) {
        // Güncelleme
        result = await updateGenreAction(genre.id, data);
      } else {
        // Yeni oluşturma
        result = await createGenreAction(data);
      }

      if (!result.success) {
        toast.error(result.error || `${isEdit ? 'Güncelleme' : 'Oluşturma'} başarısız oldu`);
        return;
      }

      // Başarılı
      toast.success(`Tür başarıyla ${isEdit ? 'güncellendi' : 'oluşturuldu'}!`);
      
      // Dialog'u kapat ve callback çağır
      onOpenChange(false);
      onSuccess?.();

    } catch (error) {
      console.error('Genre form error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Tür Düzenle' : 'Yeni Tür Ekle'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Tür Adı */}
          <div className="space-y-2">
            <Label htmlFor="name">Tür Adı</Label>
            <Input
              id="name"
              type="text"
              placeholder="Tür adını girin"
              {...register('name')}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Butonlar */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              İptal
            </Button>
            <Button
              type="submit"
              loading={isLoading}
            >
              {isEdit ? 'Güncelle' : 'Oluştur'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 