'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
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

  const onSubmit = async (data: CreateGenreInput) => {
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
    } catch {
      toastError('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Tür Adı"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end space-x-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              İptal
            </Button>
          )}
          <Button
            type="submit"
            loading={isLoading}
          >
            Oluştur
          </Button>
        </div>
      </form>
    </Form>
  );
} 