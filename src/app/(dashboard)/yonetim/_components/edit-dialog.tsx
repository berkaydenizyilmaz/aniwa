'use client';

import { useState, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  children: React.ReactNode | ((props: { 
    onClose: () => void; 
    onSubmit: (data: T) => Promise<void>;
    isUpdating: boolean;
  }) => React.ReactNode);
}

export const EditDialog = memo(function EditDialog<T = Record<string, unknown>>({ 
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

  // Dialog close handler - useCallback ile optimize edildi
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Form submit handler - useCallback ile optimize edildi
  const handleSubmit = useCallback(async (data: T) => {
    if (isUpdating) return; // Prevent double submission
    
    setIsUpdating(true);
    try {
      await onEdit(data);
      setIsOpen(false);
    } catch (error) {
      console.error('Edit error:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [onEdit, isUpdating]);

  // Default trigger render fonksiyonu - useCallback ile optimize edildi
  const renderDefaultTrigger = useCallback(() => (
    <Button 
      variant={variant} 
      size={size} 
      loading={isLoading}
      className="hover:bg-primary/10 hover:text-primary transition-all duration-200"
    >
      <Edit className="h-4 w-4" />
    </Button>
  ), [variant, size, isLoading]);

  // Children render fonksiyonu - useCallback ile optimize edildi
  const renderChildren = useCallback(() => {
    return typeof children === 'function' 
      ? children({ onClose: handleClose, onSubmit: handleSubmit, isUpdating }) 
      : children;
  }, [children, handleClose, handleSubmit, isUpdating]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || renderDefaultTrigger()}
      </DialogTrigger>
      <DialogContent className="bg-card/90 backdrop-blur-md border border-border/20 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {renderChildren()}
        </div>
      </DialogContent>
    </Dialog>
  );
}); 