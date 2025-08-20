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
import { MASTER_DATA_DOMAIN } from '@/lib/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/constants/query-keys';


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

  // Form'u güncelle
  useEffect(() => {
    if (!open) return;

    if (tag) {
      // Edit mode - mevcut verileri doldur
      form.reset({
        name: tag.name,
        description: tag.description || '',
        category: tag.category || undefined,
        isAdult: tag.isAdult,
        isSpoiler: tag.isSpoiler,
      });
    } else {
      // Create mode - temiz form
      form.reset({
        name: '',
        description: '',
        category: undefined,
        isAdult: false,
        isSpoiler: false,
      });
    }
  }, [open, tag, form]);

  // Mutation
  const mutation = useMutation({
    mutationFn: (data: CreateTagInput | UpdateTagInput) => {
      if (tag) {
        return updateTagAction(tag.id, data as UpdateTagInput);
      }
      return createTagAction(data as CreateTagInput);
    },
    onSuccess: () => {
      toast.success(
        tag 
          ? 'Etiket başarıyla güncellendi!' 
          : 'Etiket başarıyla oluşturuldu!'
      );
      onOpenChange(false);
      // Query'yi invalidate et
      queryClient.invalidateQueries({ queryKey: queryKeys.masterData.tag.all });
    },
    onError: (error) => {
      console.error('Tag mutation error:', error);
      toast.error(error.message || 'İşlem başarısız oldu');
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
                      {Object.entries(MASTER_DATA_DOMAIN.UI.TAG_CATEGORY_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
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
