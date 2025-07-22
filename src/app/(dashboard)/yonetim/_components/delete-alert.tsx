'use client';

import { useState, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface DeleteAlertProps {
  title: string;
  description: string;
  onDelete: () => Promise<void>;
  isLoading?: boolean;
  variant?: 'outline' | 'destructive';
  size?: 'sm' | 'default';
}

export const DeleteAlert = memo(function DeleteAlert({ 
  title, 
  description, 
  onDelete, 
  isLoading = false,
  variant = 'outline',
  size = 'sm'
}: DeleteAlertProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Delete handler - useCallback ile optimize edildi
  const handleDelete = useCallback(async () => {
    if (isDeleting) return; // Prevent double submission
    
    setIsDeleting(true);
    try {
      await onDelete();
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  }, [onDelete, isDeleting]);

  // Trigger button render fonksiyonu - useCallback ile optimize edildi
  const renderTriggerButton = useCallback(() => (
    <Button 
      variant={variant} 
      size={size} 
      loading={isDeleting || isLoading}
      className="hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  ), [variant, size, isDeleting, isLoading]);

  // Action button render fonksiyonu - useCallback ile optimize edildi
  const renderActionButton = useCallback(() => (
    <AlertDialogAction 
      onClick={handleDelete} 
      className="bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
    >
      Sil
    </AlertDialogAction>
  ), [handleDelete]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {renderTriggerButton()}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-card/90 backdrop-blur-md border border-border/20 shadow-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:bg-muted/80 transition-all duration-200">
            İptal
          </AlertDialogCancel>
          {renderActionButton()}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}); 