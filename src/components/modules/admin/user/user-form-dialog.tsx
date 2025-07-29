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

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: '',
      email: '',
      roles: [],
      isBanned: false,
    },
  });

  // Form'u user verisi ile doldur (edit mode)
  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        email: user.email,
        roles: user.roles,
        isBanned: user.isBanned,
      });
    } else {
      reset({
        username: '',
        email: '',
        roles: [],
        isBanned: false,
      });
    }
  }, [user, reset]);

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
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Kullanıcı Adı */}
          <div className="space-y-2">
            <Label htmlFor="username">Kullanıcı Adı</Label>
            <Input
              id="username"
              {...register('username')}
              placeholder="Kullanıcı adını girin"
              disabled={updateMutation.isPending}
            />
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username.message}</p>
            )}
          </div>

          {/* E-posta */}
          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="E-posta adresini girin"
              disabled={updateMutation.isPending}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Roller */}
          <div className="space-y-2">
            <Label htmlFor="roles">Roller</Label>
            <Controller
              name="roles"
              control={control}
              render={({ field }) => (
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
                        <Label 
                          htmlFor={`role-${role}`} 
                          className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                            isSelected ? 'text-primary' : 'text-muted-foreground'
                          }`}
                        >
                          {role}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              )}
            />
            {errors.roles && (
              <p className="text-sm text-destructive">{errors.roles.message}</p>
            )}
          </div>

          {/* Ban Durumu */}
          <div className="space-y-2">
            <Controller
              name="isBanned"
              control={control}
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isBanned"
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                    disabled={updateMutation.isPending}
                  />
                  <Label htmlFor="isBanned" className="text-sm">
                    Yasaklı
                  </Label>
                </div>
              )}
            />
            {errors.isBanned && (
              <p className="text-sm text-destructive">{errors.isBanned.message}</p>
            )}
          </div>

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
      </DialogContent>
    </Dialog>
  );
} 