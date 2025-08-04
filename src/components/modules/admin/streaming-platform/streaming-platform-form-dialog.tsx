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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createStreamingPlatformAction, updateStreamingPlatformAction } from '@/lib/actions/admin/streaming-platform.action';
import { createStreamingPlatformSchema, updateStreamingPlatformSchema, type CreateStreamingPlatformInput, type UpdateStreamingPlatformInput } from '@/lib/schemas/streamingPlatform.schema';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { StreamingPlatform } from '@prisma/client';

interface StreamingPlatformFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform?: StreamingPlatform | null;
  onSuccess?: () => void;
}

export function StreamingPlatformFormDialog({ open, onOpenChange, platform, onSuccess }: StreamingPlatformFormDialogProps) {
  const queryClient = useQueryClient();

  const isEditing = !!platform;

  const form = useForm<CreateStreamingPlatformInput | UpdateStreamingPlatformInput>({
    resolver: zodResolver(isEditing ? updateStreamingPlatformSchema : createStreamingPlatformSchema),
    defaultValues: {
      name: '',
      baseUrl: '',
    },
  });

  // Platform değiştiğinde form'u güncelle
  useEffect(() => {
    if (platform) {
      form.reset({
        name: platform.name,
        baseUrl: platform.baseUrl,
      });
    } else {
      form.reset({
        name: '',
        baseUrl: '',
      });
    }
  }, [platform, form]);

  // Create/Update mutation
  const mutation = useMutation({
    mutationFn: async (data: CreateStreamingPlatformInput | UpdateStreamingPlatformInput) => {
      if (isEditing && platform) {
        return updateStreamingPlatformAction(platform.id, data as UpdateStreamingPlatformInput);
      } else {
        return createStreamingPlatformAction(data as CreateStreamingPlatformInput);
      }
    },
    onSuccess: () => {
      toast.success(isEditing ? 'Platform başarıyla güncellendi!' : 'Platform başarıyla oluşturuldu!');
      onSuccess?.();
      onOpenChange(false);
      form.reset();
      // Query'yi invalidate et
      queryClient.invalidateQueries({ queryKey: ['streaming-platforms'] });
    },
    onError: (error) => {
      console.error('Form submission error:', error);
      toast.error('İşlem başarısız oldu');
    },
  });

  const onSubmit = async (data: CreateStreamingPlatformInput | UpdateStreamingPlatformInput) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Platform Düzenle' : 'Yeni Platform Ekle'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Platform bilgilerini güncelleyin.' : 'Yeni bir streaming platformu ekleyin.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Platform Adı */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform Adı</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Örn: Netflix, Crunchyroll"
                      disabled={mutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Base URL */}
            <FormField
              control={form.control}
              name="baseUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://www.example.com"
                      disabled={mutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
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
                {isEditing ? 'Güncelle' : 'Oluştur'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 
