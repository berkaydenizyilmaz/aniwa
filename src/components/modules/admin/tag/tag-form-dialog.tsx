'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { createTagAction, updateTagAction } from '@/lib/actions/tag.action';
import { createTagSchema, updateTagSchema, type CreateTagInput, type UpdateTagInput } from '@/lib/schemas/tag.schema';
import { toast } from 'sonner';
import { Tag, TagCategory } from '@prisma/client';

interface TagFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag?: Tag | null;
  onSuccess?: () => void;
}

export function TagFormDialog({ open, onOpenChange, tag, onSuccess }: TagFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!tag;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
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

  const onSubmit = async (data: CreateTagInput | UpdateTagInput) => {
    if (isLoading) return; // Prevent double submission
    
    setIsLoading(true);

    try {
      let result;
      
      if (isEdit && tag) {
        // Güncelleme
        result = await updateTagAction(tag.id, data as UpdateTagInput);
      } else {
        // Yeni oluşturma
        result = await createTagAction(data as CreateTagInput);
      }

      if (!result.success) {
        toast.error(result.error || `${isEdit ? 'Güncelleme' : 'Oluşturma'} başarısız oldu`);
        return;
      }

      // Başarılı
      toast.success(`Etiket başarıyla ${isEdit ? 'güncellendi' : 'oluşturuldu'}!`);
      
      // Dialog'u kapat ve callback çağır
      onOpenChange(false);
      onSuccess?.();

    } catch (error) {
      console.error('Tag form error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DEMOGRAPHICS">Hedef Kitle</SelectItem>
                <SelectItem value="THEMES">Ana Temalar</SelectItem>
                <SelectItem value="CONTENT">İçerik Niteliği</SelectItem>
                <SelectItem value="SETTING">Ortam</SelectItem>
                <SelectItem value="ELEMENTS">Spesifik Öğeler</SelectItem>
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
                <input
                  type="checkbox"
                  id="isAdult"
                  {...register('isAdult')}
                  disabled={isLoading}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isAdult" className="text-sm">Yetişkin İçerik</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isSpoiler"
                  {...register('isSpoiler')}
                  disabled={isLoading}
                  className="rounded border-gray-300"
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