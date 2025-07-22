'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface EditDialogProps<T = Record<string, unknown>> {
  title: string;
  description: string;
  trigger?: React.ReactNode;
  onEdit: (data: T) => Promise<void>;
  isLoading?: boolean;
  variant?: 'outline' | 'default';
  size?: 'sm' | 'default';
  children: React.ReactNode;
}

export function EditDialog<T = Record<string, unknown>>({ 
  title, 
  description, 
  trigger,
  onEdit, 
  isLoading = false,
  variant = 'outline',
  size = 'sm',
  children
}: EditDialogProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEdit = async (data: T) => {
    setIsUpdating(true);
    try {
      await onEdit(data);
      setIsOpen(false);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant={variant} size={size} loading={isLoading}>
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {children}
        </div>
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            disabled={isUpdating}
          >
            İptal
          </Button>
          <Button 
            type="submit" 
            loading={isUpdating}
            onClick={() => handleEdit({} as T)} // Bu form submit ile değişecek
          >
            Güncelle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 