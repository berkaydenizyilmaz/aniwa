'use client';

import { useState, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface CreateDialogProps {
  title: string;
  description: string;
  trigger?: React.ReactNode;
  children: React.ReactNode | ((props: { onClose: () => void }) => React.ReactNode);
}

export const CreateDialog = memo(function CreateDialog({ 
  title, 
  description, 
  trigger,
  children
}: CreateDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Dialog close handler
  const handleClose = () => {
    setIsOpen(false);
  };

  // Default trigger
  const defaultTrigger = (
    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200">
      <Plus className="h-4 w-4 mr-2" />
      Yeni Ekle
    </Button>
  );

  // Children
  const childrenContent = typeof children === 'function' ? children({ onClose: handleClose }) : children;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="bg-card/90 backdrop-blur-md border border-border/20 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>
        {childrenContent}
      </DialogContent>
    </Dialog>
  );
}); 