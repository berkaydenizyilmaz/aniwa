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

  // Form'u genre verisi ile doldur (edit mode)
  useEffect(() => {
    if (genre) {
      form.reset({
        name: genre.name,
      });
    } else {
      form.reset({
        name: '',
      });
    }
  }, [genre, form]);

  // Create/Update mutation
  const mutation = useMutation({
    mutationFn: async (data: CreateGenreInput | UpdateGenreInput) => {
      if (isEdit && genre) {
        return updateGenreAction(genre.id, data);
      } else {
        return createGenreAction(data);
      }
    },
    onSuccess: () => {
      toast.success(`Tür başarıyla ${isEdit ? 'güncellendi' : 'oluşturuldu'}!`);
      onOpenChange(false);
      onSuccess?.();
      // Query'yi invalidate et
      queryClient.invalidateQueries({ queryKey: ['genres'] });
    },
    onError: (error) => {
      console.error('Genre form error:', error);
      toast.error(`${isEdit ? 'Güncelleme' : 'Oluşturma'} başarısız oldu`);
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