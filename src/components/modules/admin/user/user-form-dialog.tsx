'use client';

import { useEffect } from 'react';  
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { updateUserAction } from '@/lib/actions/user.action';
import { updateUserSchema, type UpdateUserInput } from '@/lib/schemas/user.schema';
import { toast } from 'sonner';
import { User, UserRole } from '@prisma/client';
import { useLoadingStore } from '@/lib/stores/loading.store';
import { LOADING_KEYS } from '@/lib/constants/loading.constants';

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  onSuccess?: () => void;
}

export function UserFormDialog({ open, onOpenChange, user, onSuccess }: UserFormDialogProps) {
  const { setLoading: setLoadingStore, isLoading } = useLoadingStore();

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

  const onSubmit = async (data: UpdateUserInput) => {
    if (!user || isLoading(LOADING_KEYS.FORMS.UPDATE_USER)) return; // Prevent double submission

    setLoadingStore(LOADING_KEYS.FORMS.UPDATE_USER, true);

    try {
      // Güncelleme
      const result = await updateUserAction(user.id, data);

      if (!result.success) {
        toast.error(result.error || 'Güncelleme başarısız oldu');
        return;
      }

      // Başarılı
      toast.success('Kullanıcı başarıyla güncellendi!');

      // Dialog'u kapat ve callback çağır
      onOpenChange(false);
      onSuccess?.();

    } catch (error) {
      console.error('User form error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoadingStore(LOADING_KEYS.FORMS.UPDATE_USER, false);
    }
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
              disabled={isLoading(LOADING_KEYS.FORMS.UPDATE_USER)}
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
              disabled={isLoading(LOADING_KEYS.FORMS.UPDATE_USER)}
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
                        <input
                          type="checkbox"
                          id={`role-${role}`}
                          checked={isSelected}
                          onChange={(e) => {
                            const currentRoles = field.value || [];
                            if (e.target.checked) {
                              field.onChange([...currentRoles, role]);
                            } else {
                              field.onChange(currentRoles.filter(r => r !== role));
                            }
                          }}
                          disabled={isLoading(LOADING_KEYS.FORMS.UPDATE_USER)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
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
                  <input
                    type="checkbox"
                    id="isBanned"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    disabled={isLoading(LOADING_KEYS.FORMS.UPDATE_USER)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="isBanned" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
              disabled={isLoading(LOADING_KEYS.FORMS.UPDATE_USER)}
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={isLoading(LOADING_KEYS.FORMS.UPDATE_USER)}
            >
              Güncelle
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 