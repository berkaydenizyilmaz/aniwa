'use client';

import { useState } from 'react';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toastError, toastSuccess } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createTagSchema, type CreateTagInput } from '@/lib/schemas/tag.schema';
import { createTag } from '../_actions/tag.actions';
import { setFormFieldErrors } from '@/lib/utils/server-action-error-handler';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MASTER_DATA } from '@/lib/constants/masterData.constants';

interface TagFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export function TagForm({ onSuccess, onCancel, onClose }: TagFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateTagInput>({
    resolver: zodResolver(createTagSchema),
    defaultValues: {
      name: '',
      description: '',
      category: undefined,
      isAdult: false,
      isSpoiler: false,
    },
  });

  // Form submit handler
  const onSubmit = async (data: CreateTagInput) => {
    if (isLoading) return; // Prevent double submission
    
    setIsLoading(true);

    try {
      const result = await createTag(data);

      if (!result.success) {
        // Field errors varsa form'a set et
        if (result.fieldErrors) {
          setFormFieldErrors<CreateTagInput>(result.fieldErrors, form.setError);
        } else {
          // Genel hata mesajı
          toastError('Hata', result.error);
        }
      } else {
        toastSuccess('Başarılı', 'Etiket başarıyla oluşturuldu!');
        form.reset();
        onSuccess?.();
        onClose?.(); // Dialog'u kapat
      }
    } catch (error) {
      console.error('Create tag error:', error);
      toastError('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  // Form field components
  const NameField = ({ field }: { field: ControllerRenderProps<CreateTagInput, 'name'> }) => (
    <FormItem>
      <FormLabel>Etiket Adı</FormLabel>
      <FormControl>
        <Input
          placeholder="Etiket Adı"
          disabled={isLoading}
          {...field}
          className="bg-card/80 backdrop-blur-sm"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  const DescriptionField = ({ field }: { field: ControllerRenderProps<CreateTagInput, 'description'> }) => (
    <FormItem>
      <FormLabel>Açıklama</FormLabel>
      <FormControl>
        <Textarea
          placeholder="Etiket açıklaması"
          disabled={isLoading}
          {...field}
          className="bg-card/80 backdrop-blur-sm"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  const CategoryField = ({ field }: { field: ControllerRenderProps<CreateTagInput, 'category'> }) => (
    <FormItem>
      <FormLabel>Kategori</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger className="bg-card/80 backdrop-blur-sm">
            <SelectValue placeholder="Kategori seçin" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {Object.values(MASTER_DATA.TAG_CATEGORY).map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );

  const AdultField = ({ field }: { field: ControllerRenderProps<CreateTagInput, 'isAdult'> }) => (
    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
      <div className="space-y-0.5">
        <FormLabel>Yetişkin İçerik</FormLabel>
      </div>
      <FormControl>
        <Switch
          checked={field.value}
          onCheckedChange={field.onChange}
          disabled={isLoading}
        />
      </FormControl>
    </FormItem>
  );

  const SpoilerField = ({ field }: { field: ControllerRenderProps<CreateTagInput, 'isSpoiler'> }) => (
    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
      <div className="space-y-0.5">
        <FormLabel>Spoiler</FormLabel>
      </div>
      <FormControl>
        <Switch
          checked={field.value}
          onCheckedChange={field.onChange}
          disabled={isLoading}
        />
      </FormControl>
    </FormItem>
  );

  // Cancel button
  const cancelButton = onCancel && (
    <Button
      type="button"
      variant="outline"
      onClick={onCancel}
      disabled={isLoading}
      className="hover:bg-muted/80 transition-all duration-200"
    >
      İptal
    </Button>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={NameField}
        />

        <FormField
          control={form.control}
          name="description"
          render={DescriptionField}
        />

        <FormField
          control={form.control}
          name="category"
          render={CategoryField}
        />

        <div className="flex items-center space-x-4">
          <FormField
            control={form.control}
            name="isAdult"
            render={AdultField}
          />

          <FormField
            control={form.control}
            name="isSpoiler"
            render={SpoilerField}
          />
        </div>

        <div className="flex items-center justify-end space-x-2">
          {cancelButton}
          <Button
            type="submit"
            loading={isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
          >
            Oluştur
          </Button>
        </div>
      </form>
    </Form>
  );
}