'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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


interface StudioFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studio?: Studio | null;
  onSuccess?: () => void;
}

export function StudioFormDialog({ open, onOpenChange, studio, onSuccess }: StudioFormDialogProps) {
  const isEdit = !!studio;
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm<CreateStudioInput | UpdateStudioInput>({
    resolver: zodResolver(isEdit ? updateStudioSchema : createStudioSchema),
    defaultValues: {
      name: '',
      isAnimationStudio: true,
    },
  });

  // Form'u studio verisi ile doldur (edit mode)
  useEffect(() => {
    if (studio) {
      reset({
        name: studio.name,
        isAnimationStudio: studio.isAnimationStudio,
      });
    } else {
      reset({
        name: '',
        isAnimationStudio: true,
      });
    }
  }, [studio, reset]);

  // Create/Update mutation
  const mutation = useMutation({
    mutationFn: async (data: CreateStudioInput | UpdateStudioInput) => {
      if (isEdit && studio) {
        return updateStudioAction(studio.id, data as UpdateStudioInput);
      } else {
        return createStudioAction(data as CreateStudioInput);
      }
    },
    onSuccess: () => {
      toast.success(`Stüdyo başarıyla ${isEdit ? 'güncellendi' : 'oluşturuldu'}!`);
      onOpenChange(false);
      onSuccess?.();
      // Query'yi invalidate et
      queryClient.invalidateQueries({ queryKey: ['studios'] });
    },
    onError: (error) => {
      console.error('Studio form error:', error);
      toast.error(`${isEdit ? 'Güncelleme' : 'Oluşturma'} başarısız oldu`);
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
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Stüdyo Adı */}
          <div className="space-y-2">
            <Label htmlFor="name">Stüdyo Adı</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Stüdyo adını girin"
              disabled={mutation.isPending}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Stüdyo Türü */}
          <div className="space-y-2">
            <Controller
              name="isAnimationStudio"
              control={control}
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isAnimationStudio"
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                    disabled={mutation.isPending}
                  />
                  <Label htmlFor="isAnimationStudio" className="text-sm">
                    Animasyon Stüdyosu
                  </Label>
                </div>
              )}
            />
            {errors.isAnimationStudio && (
              <p className="text-sm text-destructive">{errors.isAnimationStudio.message}</p>
            )}
          </div>

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
      </DialogContent>
    </Dialog>
  );
} 
