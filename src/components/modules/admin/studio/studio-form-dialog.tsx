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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


interface StudioFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studio?: Studio | null;
  onSuccess?: () => void;
}

export function StudioFormDialog({ open, onOpenChange, studio, onSuccess }: StudioFormDialogProps) {
  const isEdit = !!studio;
  const { setLoading: setLoadingStore, isLoading } = useLoadingStore();

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

  const onSubmit = async (data: CreateStudioInput | UpdateStudioInput) => {
    if (isLoading(LOADING_KEYS.FORMS.CREATE_STUDIO)) return; // Prevent double submission
    
    setLoadingStore(LOADING_KEYS.FORMS.CREATE_STUDIO, true);

    try {
      let result;
      
      if (isEdit && studio) {
        // Güncelleme
        result = await updateStudioAction(studio.id, data as UpdateStudioInput);
      } else {
        // Yeni oluşturma
        result = await createStudioAction(data as CreateStudioInput);
      }

      if (!result.success) {
        toast.error(result.error || `${isEdit ? 'Güncelleme' : 'Oluşturma'} başarısız oldu`);
        return;
      }

      toast.success(`Stüdyo başarıyla ${isEdit ? 'güncellendi' : 'oluşturuldu'}!`);
      onOpenChange(false);
      onSuccess?.();

    } catch (error) {
      console.error('Studio form error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoadingStore(LOADING_KEYS.FORMS.CREATE_STUDIO, false);
    }
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
              disabled={isLoading(LOADING_KEYS.FORMS.CREATE_STUDIO)}
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
                    disabled={isLoading(LOADING_KEYS.FORMS.CREATE_STUDIO)}
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
              disabled={isLoading(LOADING_KEYS.FORMS.CREATE_STUDIO)}
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={isLoading(LOADING_KEYS.FORMS.CREATE_STUDIO)}
            >
              {isEdit ? 'Güncelle' : 'Oluştur'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 
