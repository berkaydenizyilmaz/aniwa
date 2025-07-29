'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createTagAction, updateTagAction } from '@/lib/actions/admin/tag.action';
import { createTagSchema, updateTagSchema, type CreateTagInput, type UpdateTagInput } from '@/lib/schemas/tag.schema';
import { toast } from 'sonner';
import { Tag, TagCategory } from '@prisma/client';
import { MASTER_DATA } from '@/lib/constants/masterData.constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';


interface TagFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag?: Tag | null;
  onSuccess?: () => void;
}

export function TagFormDialog({ open, onOpenChange, tag, onSuccess }: TagFormDialogProps) {
  const isEdit = !!tag;
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CreateTagInput | UpdateTagInput>({
    resolver: zodResolver(isEdit ? updateTagSchema : createTagSchema),
    defaultValues: {
      name: '',
      description: '',
      category: undefined,
      isAdult: false,
      isSpoiler: false,
    },
  });

  // Form'u tag verisi ile doldur (edit mode)
  useEffect(() => {
    if (tag) {
      reset({
        name: tag.name,
        description: tag.description || '',
        category: tag.category || undefined,
        isAdult: tag.isAdult,
        isSpoiler: tag.isSpoiler,
      });
    } else {
      reset({
        name: '',
        description: '',
        category: undefined,
        isAdult: false,
        isSpoiler: false,
      });
    }
  }, [tag, reset]);

  // Create/Update mutation
  const mutation = useMutation({
    mutationFn: async (data: CreateTagInput | UpdateTagInput) => {
      if (isEdit && tag) {
        return updateTagAction(tag.id, data as UpdateTagInput);
      } else {
        return createTagAction(data as CreateTagInput);
      }
    },
    onSuccess: () => {
      toast.success(`Etiket başarıyla ${isEdit ? 'güncellendi' : 'oluşturuldu'}!`);
      onOpenChange(false);
      onSuccess?.();
      // Query'yi invalidate et
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
    onError: (error) => {
      console.error('Tag form error:', error);
      toast.error(`${isEdit ? 'Güncelleme' : 'Oluşturma'} başarısız oldu`);
    },
  });

  const onSubmit = async (data: CreateTagInput | UpdateTagInput) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Etiket Düzenle' : 'Yeni Etiket Ekle'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Etiket Adı */}
          <div className="space-y-2">
            <Label htmlFor="name">Etiket Adı</Label>
            <Input
              id="name"
              type="text"
              placeholder="Etiket adını girin"
              {...register('name')}
              disabled={mutation.isPending}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Açıklama */}
          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              placeholder="Etiket açıklaması (isteğe bağlı)"
              {...register('description')}
              disabled={mutation.isPending}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Kategori */}
          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Select
              onValueChange={(value: string) => setValue('category', value as TagCategory)}
              defaultValue={tag?.category || undefined}
              disabled={mutation.isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(MASTER_DATA.TAG_CATEGORY).map(([, value]) => (
                  <SelectItem key={value} value={value}>
                    {MASTER_DATA.TAG_CATEGORY_LABELS[value as TagCategory]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>

          {/* Özel Durumlar */}
          <div className="space-y-2">
            <Label>Özel Durumlar</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isAdult"
                  checked={watch('isAdult')}
                  onCheckedChange={(checked) => setValue('isAdult', checked === true)}
                  disabled={mutation.isPending}
                />
                <Label htmlFor="isAdult" className="text-sm">Yetişkin İçerik</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isSpoiler"
                  checked={watch('isSpoiler')}
                  onCheckedChange={(checked) => setValue('isSpoiler', checked === true)}
                  disabled={mutation.isPending}
                />
                <Label htmlFor="isSpoiler" className="text-sm">Spoiler İçerir</Label>
              </div>
            </div>
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
