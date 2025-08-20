'use client';

import { useEffect } from 'react';  
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
import { queryKeys } from '@/lib/constants/query-keys';

interface GenreFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  genre?: Genre | null;
  onSuccess?: () => void;
}

export function GenreFormDialog({ open, onOpenChange, genre, onSuccess }: GenreFormDialogProps) {
  const isEdit = !!genre;
  const queryClient = useQueryClient();

  const form = useForm<CreateGenreInput>({
    resolver: zodResolver(isEdit ? updateGenreSchema : createGenreSchema),
    defaultValues: {
      name: '',
    },
  });

  // Form'u güncelle
  useEffect(() => {
    if (!open) return;

    if (genre) {
      // Edit mode - mevcut verileri doldur
      form.reset({
        name: genre.name,
      });
    } else {
      // Create mode - temiz form
      form.reset({
        name: '',
      });
    }
  }, [open, genre, form]);

  // Mutation
  const mutation = useMutation({
    mutationFn: (data: CreateGenreInput | UpdateGenreInput) => {
      if (genre) {
        return updateGenreAction(genre.id, data as UpdateGenreInput);
      }
      return createGenreAction(data as CreateGenreInput);
    },
    onSuccess: () => {
      toast.success(
        genre 
          ? 'Tür başarıyla güncellendi!' 
          : 'Tür başarıyla oluşturuldu!'
      );
      onOpenChange(false);
      onSuccess?.();
      // Query'yi invalidate et
      queryClient.invalidateQueries({ queryKey: queryKeys.masterData.genre.all });
    },
    onError: (error) => {
      console.error('Genre mutation error:', error);
      toast.error(error.message || 'İşlem başarısız oldu');
    },
  });

  const onSubmit = async (data: CreateGenreInput | UpdateGenreInput) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Tür Düzenle' : 'Yeni Tür Ekle'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Tür Adı */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tür Adı</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Tür adını girin"
                      disabled={mutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Butonlar */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={mutation.isPending}
              >
                İptal
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending}
              >
                {isEdit ? 'Güncelle' : 'Oluştur'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 