'use client';

import { useState } from 'react';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toastError, toastSuccess } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { createGenreSchema, type CreateGenreInput } from '@/lib/schemas/genre.schema';
import { createGenre } from '../_actions/genre.actions';
import { setFormFieldErrors } from '@/lib/utils/server-action-error-handler';

interface GenreFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export function GenreForm({ onSuccess, onCancel, onClose }: GenreFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateGenreInput>({
    resolver: zodResolver(createGenreSchema),
    defaultValues: {
      name: '',
    },
  });

  // Form submit handler
  const onSubmit = async (data: CreateGenreInput) => {
    if (isLoading) return; // Prevent double submission
    
    setIsLoading(true);

    try {
      const result = await createGenre(data);

      if (!result.success) {
        // Field errors varsa form'a set et
        if (result.fieldErrors) {
          setFormFieldErrors<CreateGenreInput>(result.fieldErrors, form.setError);
        } else {
          // Genel hata mesajı
          toastError('Hata', result.error);
        }
      } else {
        toastSuccess('Başarılı', 'Tür başarıyla oluşturuldu!');
        form.reset();
        onSuccess?.();
        onClose?.(); // Dialog'u kapat
      }
    } catch (error) {
      console.error('Create genre error:', error);
      toastError('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  // Form field component
  const NameField = ({ field }: { field: ControllerRenderProps<CreateGenreInput, 'name'> }) => (
    <FormItem>
      <FormControl>
        <Input
          placeholder="Tür Adı"
          disabled={isLoading}
          {...field}
          className="bg-card/80 backdrop-blur-sm"
        />
      </FormControl>
      <FormMessage />
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