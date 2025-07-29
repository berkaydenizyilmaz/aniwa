'use client';

import { useEffect } from 'react';
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
import { createGenreAction, updateGenreAction } from '@/lib/actions/admin/genre.action';
import { createGenreSchema, updateGenreSchema, type CreateGenreInput, type UpdateGenreInput } from '@/lib/schemas/genre.schema';
import { toast } from 'sonner';
import { Genre } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface GenreFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  genre?: Genre | null;
  onSuccess?: () => void;
}

export function GenreFormDialog({ open, onOpenChange, genre, onSuccess }: GenreFormDialogProps) {
  const isEdit = !!genre;
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateGenreInput>({
    resolver: zodResolver(isEdit ? updateGenreSchema : createGenreSchema),
    defaultValues: {
      name: '',
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createGenreAction,
    onSuccess: () => {
      toast.success('Tür başarıyla oluşturuldu!');
      onOpenChange(false);
      onSuccess?.();
      // Query'yi invalidate et
      queryClient.invalidateQueries({ queryKey: ['genres'] });
    },
    onError: (error) => {
      console.error('Create genre error:', error);
      toast.error('Oluşturma başarısız oldu');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGenreInput }) => 
      updateGenreAction(id, data),
    onSuccess: () => {
      toast.success('Tür başarıyla güncellendi!');
      onOpenChange(false);
      onSuccess?.();
      // Query'yi invalidate et
      queryClient.invalidateQueries({ queryKey: ['genres'] });
    },
    onError: (error) => {
      console.error('Update genre error:', error);
      toast.error('Güncelleme başarısız oldu');
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

  const onSubmit = async (data: CreateGenreInput | UpdateGenreInput) => {
    if (isEdit && genre) {
      updateMutation.mutate({ id: genre.id, data: data as UpdateGenreInput });
    } else {
      createMutation.mutate(data as CreateGenreInput);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

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
              disabled={isLoading}
            >
              {isEdit ? 'Güncelle' : 'Oluştur'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 
