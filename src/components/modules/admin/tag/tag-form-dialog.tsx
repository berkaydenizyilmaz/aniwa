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

  const form = useForm<CreateTagInput | UpdateTagInput>({
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
      form.reset({
        name: tag.name,
        description: tag.description || '',
        category: tag.category || undefined,
        isAdult: tag.isAdult,
        isSpoiler: tag.isSpoiler,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        category: undefined,
        isAdult: false,
        isSpoiler: false,
      });
    }
  }, [tag, form]);

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
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Etiket Adı */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Etiket Adı</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Etiket adını girin"
                      disabled={mutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Açıklama */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Etiket açıklaması (isteğe bağlı)"
                      disabled={mutation.isPending}
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Kategori */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={mutation.isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(MASTER_DATA.TAG_CATEGORY).map(([, value]) => (
                        <SelectItem key={value} value={value}>
                          {MASTER_DATA.TAG_CATEGORY_LABELS[value as TagCategory]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Özel Durumlar */}
            <div className="space-y-2">
              <FormLabel>Özel Durumlar</FormLabel>
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="isAdult"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={mutation.isPending}
                        />
                      </FormControl>
                      <FormLabel className="text-sm">Yetişkin İçerik</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isSpoiler"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={mutation.isPending}
                        />
                      </FormControl>
                      <FormLabel className="text-sm">Spoiler İçerir</FormLabel>
                    </FormItem>
                  )}
                />
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
        </Form>
      </DialogContent>
    </Dialog>
  );
} 
