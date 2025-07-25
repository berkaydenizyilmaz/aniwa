'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Studio } from '@prisma/client';
import { getStudiosAction, deleteStudioAction } from '@/lib/actions/studio.action';
import { toast } from 'sonner';
import { GetStudiosResponse } from '@/lib/types/api/studio.api';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useLoadingStore } from '@/lib/stores/loading.store';
import { LOADING_KEYS } from '@/lib/constants/loading.constants';

interface StudioTableProps {
  onEdit?: (studio: Studio) => void;
  searchTerm?: string;
}

export function StudioTable({ onEdit, searchTerm = '' }: StudioTableProps) {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const { setLoading: setLoadingStore, isLoading } = useLoadingStore();

  // Studio'ları getir
  useEffect(() => {
    const fetchStudios = async () => {
      try {
        setLoadingStore(LOADING_KEYS.PAGES.STUDIOS, true);
        const result = await getStudiosAction();

        if (!result.success) {
          toast.error(result.error || 'Stüdyolar yüklenirken bir hata oluştu');
          return;
        }

        const data = result.data as GetStudiosResponse;
        setStudios(data.studios);
      } catch (error) {
        console.error('Fetch studios error:', error);
        toast.error('Stüdyolar yüklenirken bir hata oluştu');
      } finally {
        setLoadingStore(LOADING_KEYS.PAGES.STUDIOS, false);
      }
    };

    fetchStudios();
  }, [setLoadingStore]);

  // Arama filtreleme
  const filteredStudios = studios.filter(studio =>
    studio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    studio.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (studio: Studio) => {
    onEdit?.(studio);
  };

  const handleDelete = (studio: Studio) => {
    setSelectedStudio(studio);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedStudio || isLoading(LOADING_KEYS.ACTIONS.DELETE_STUDIO)) return;

    setLoadingStore(LOADING_KEYS.ACTIONS.DELETE_STUDIO, true);

    try {
      const result = await deleteStudioAction(selectedStudio.id);

      if (!result.success) {
        toast.error(result.error || 'Silme işlemi başarısız oldu');
        return;
      }

      toast.success('Stüdyo başarıyla silindi!');
      setDeleteDialogOpen(false);

      // Tabloyu yenile
      const fetchResult = await getStudiosAction();
      if (fetchResult.success) {
        const data = fetchResult.data as GetStudiosResponse;
        setStudios(data.studios);
      }

    } catch (error) {
      console.error('Delete studio error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoadingStore(LOADING_KEYS.ACTIONS.DELETE_STUDIO, false);
    }
  };

  if (isLoading(LOADING_KEYS.PAGES.STUDIOS)) {
    return (
      <div className="glass-card">
        <div className="p-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center gap-4 py-3 border-b border-border/50 last:border-b-0">
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 flex-1" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="glass-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">İsim</TableHead>
              <TableHead className="w-1/4">Slug</TableHead>
              <TableHead className="w-1/4">Tür</TableHead>
              <TableHead className="w-1/4">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudios.map((studio) => (
              <TableRow key={studio.id}>
                <TableCell>{studio.name}</TableCell>
                <TableCell className="text-muted-foreground">{studio.slug}</TableCell>
                <TableCell className="text-muted-foreground">
                  {studio.isAnimationStudio ? 'Animasyon Stüdyosu' : 'Prodüksiyon Stüdyosu'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(studio)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost-destructive"
                      size="sm"
                      onClick={() => handleDelete(studio)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredStudios.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            {searchTerm ? 'Arama kriterlerine uygun stüdyo bulunamadı.' : 'Henüz stüdyo bulunmuyor.'}
          </div>
        )}
      </div>

      {/* Delete Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Stüdyoyu Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{selectedStudio?.name}</strong> stüdyosunu silmek istediğinizden emin misiniz?
              Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading(LOADING_KEYS.ACTIONS.DELETE_STUDIO)}>İptal</AlertDialogCancel>
            <Button
              onClick={handleDeleteConfirm}
              disabled={isLoading(LOADING_KEYS.ACTIONS.DELETE_STUDIO)}
              variant="destructive"
            >
              Sil
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 