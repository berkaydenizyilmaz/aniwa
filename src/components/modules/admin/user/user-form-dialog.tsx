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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { updateUserAction } from '@/lib/actions/admin/user.action';
import { updateUserSchema, type UpdateUserInput } from '@/lib/schemas/user.schema';
import { toast } from 'sonner';
import { User, UserRole } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  onSuccess?: () => void;
}

export function UserFormDialog({ open, onOpenChange, user, onSuccess }: UserFormDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: '',
      email: '',
      roles: [],
      isBanned: false,
    },
  });

  // Form'u güncelle
  useEffect(() => {
    if (!open) return;

    if (user) {
      // Edit mode - mevcut verileri doldur
      form.reset({
        username: user.username,
        email: user.email,
        roles: user.roles,
        isBanned: user.isBanned,
      });
    } else {
      // Create mode - temiz form
      form.reset({
        username: '',
        email: '',
        roles: [],
        isBanned: false,
      });
    }
  }, [open, user, form]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserInput }) => 
      updateUserAction(id, data),
    onSuccess: () => {
      toast.success('Kullanıcı başarıyla güncellendi!');
      onOpenChange(false);
      onSuccess?.();
      // Query'yi invalidate et
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Update user error:', error);
      toast.error('Güncelleme başarısız oldu');
    },
  });

  const onSubmit = async (data: UpdateUserInput) => {
    if (!user) return;
    updateMutation.mutate({ id: user.id, data });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Kullanıcı Düzenle
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Kullanıcı Adı */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kullanıcı Adı</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Kullanıcı adını girin"
                      disabled={updateMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* E-posta */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-posta</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="E-posta adresini girin"
                      disabled={updateMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Roller */}
            <FormField
              control={form.control}
              name="roles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roller</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-3 p-3 bg-muted/50 rounded-lg border">
                      {Object.values(UserRole).map((role) => {
                        const isSelected = field.value?.includes(role) || false;
                        return (
                          <div key={role} className="flex items-center space-x-2">
                            <Checkbox
                              id={`role-${role}`}
                              checked={isSelected}
                              onCheckedChange={(checked) => {
                                const currentRoles = field.value || [];
                                if (checked === true) {
                                  field.onChange([...currentRoles, role]);
                                } else {
                                  field.onChange(currentRoles.filter(r => r !== role));
                                }
                              }}
                              disabled={updateMutation.isPending}
                            />
                            <FormLabel 
                              htmlFor={`role-${role}`} 
                              className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                                isSelected ? 'text-primary' : 'text-muted-foreground'
                              }`}
                            >
                              {role}
                            </FormLabel>
                          </div>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ban Durumu */}
            <FormField
              control={form.control}
              name="isBanned"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={updateMutation.isPending}
                    />
                  </FormControl>
                  <FormLabel className="text-sm">
                    Yasaklı
                  </FormLabel>
                </FormItem>
              )}
            />

            {/* Butonlar */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateMutation.isPending}
              >
                İptal
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
              >
                Güncelle
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 