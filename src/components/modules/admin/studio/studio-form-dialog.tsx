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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createStudioAction, updateStudioAction } from '@/lib/actions/admin/studio.action';
import { createStudioSchema, updateStudioSchema, type CreateStudioInput, type UpdateStudioInput } from '@/lib/schemas/studio.schema';
import { toast } from 'sonner';
import { Studio } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/constants/query-keys';


interface StudioFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studio?: Studio | null;
  onSuccess?: () => void;
}

export function StudioFormDialog({ open, onOpenChange, studio, onSuccess }: StudioFormDialogProps) {
  const isEdit = !!studio;
  const queryClient = useQueryClient();

  const form = useForm<CreateStudioInput | UpdateStudioInput>({
    resolver: zodResolver(isEdit ? updateStudioSchema : createStudioSchema),
    defaultValues: {
      name: '',
      isAnimationStudio: true,
    },
  });

  // Form'u güncelle
  useEffect(() => {
    if (!open) return;

    if (studio) {
      // Edit mode - mevcut verileri doldur
      form.reset({
        name: studio.name,
        isAnimationStudio: studio.isAnimationStudio,
      });
    } else {
      // Create mode - temiz form
      form.reset({
        name: '',
        isAnimationStudio: true,
      });
    }
  }, [open, studio, form]);

  // Mutation
  const mutation = useMutation({
    mutationFn: (data: CreateStudioInput | UpdateStudioInput) => {
      if (studio) {
        return updateStudioAction(studio.id, data as UpdateStudioInput);
      }
      return createStudioAction(data as CreateStudioInput);
    },
    onSuccess: () => {
      toast.success(
        studio 
          ? 'Stüdyo başarıyla güncellendi!' 
          : 'Stüdyo başarıyla oluşturuldu!'
      );
      onOpenChange(false);
      onSuccess?.();
      // Query'yi invalidate et
      queryClient.invalidateQueries({ queryKey: queryKeys.masterData.studio.all });
    },
    onError: (error) => {
      console.error('Studio mutation error:', error);
      toast.error(error.message || 'İşlem başarısız oldu');
    },
  });

  const onSubmit = async (data: CreateStudioInput | UpdateStudioInput) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Stüdyo Düzenle' : 'Yeni Stüdyo Ekle'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Stüdyo Adı */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stüdyo Adı</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Stüdyo adını girin"
                      disabled={mutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Stüdyo Türü */}
            <FormField
              control={form.control}
              name="isAnimationStudio"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormLabel className="text-sm">
                    Animasyon Stüdyosu
                  </FormLabel>
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
