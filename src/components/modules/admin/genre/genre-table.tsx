'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Genre } from '@prisma/client';
import { getGenresAction, deleteGenreAction } from '@/lib/actions/genre.action';
import { toast } from 'sonner';
import { GetGenresResponse } from '@/lib/types/api/genre.api';
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

interface GenreTableProps {
  onEdit?: (genre: Genre) => void;
  searchTerm?: string;
}

export function GenreTable({ onEdit, searchTerm = '' }: GenreTableProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const { setLoading: setLoadingStore, isLoading } = useLoadingStore();

  // Genre'leri getir
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoadingStore(LOADING_KEYS.PAGES.GENRES, true);
        const result = await getGenresAction();

        if (!result.success) {
          toast.error(result.error || 'Türler yüklenirken bir hata oluştu');
          return;
        }

        const data = result.data as GetGenresResponse;
        setGenres(data.genres);
      } catch (error) {
        console.error('Fetch genres error:', error);
        toast.error('Türler yüklenirken bir hata oluştu');
      } finally {
        setLoadingStore(LOADING_KEYS.PAGES.GENRES, false);
      }
    };

    fetchGenres();
  }, [setLoadingStore]);

  // Arama filtreleme
  const filteredGenres = genres.filter(genre =>
    genre.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    genre.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (genre: Genre) => {
    onEdit?.(genre);
  };

  const handleDelete = (genre: Genre) => {
    setSelectedGenre(genre);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedGenre || isLoading(LOADING_KEYS.ACTIONS.DELETE_GENRE)) return;

    setLoadingStore(LOADING_KEYS.ACTIONS.DELETE_GENRE, true);

    try {
      const result = await deleteGenreAction(selectedGenre.id);

      if (!result.success) {
        toast.error(result.error || 'Silme işlemi başarısız oldu');
        return;
      }

      toast.success('Tür başarıyla silindi!');
      setDeleteDialogOpen(false);

      // Tabloyu yenile
      const fetchResult = await getGenresAction();
      if (fetchResult.success) {
        const data = fetchResult.data as GetGenresResponse;
        setGenres(data.genres);
      }

    } catch (error) {
      console.error('Delete genre error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoadingStore(LOADING_KEYS.ACTIONS.DELETE_GENRE, false);
    }
  };

  if (isLoading(LOADING_KEYS.PAGES.GENRES)) {
    return (
      <div className="glass-card">
        <div className="p-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center gap-4 py-3 border-b border-border/50 last:border-b-0">
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
              <TableHead className="w-1/3">İsim</TableHead>
              <TableHead className="w-1/3">Slug</TableHead>
              <TableHead className="w-1/3">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGenres.map((genre) => (
              <TableRow key={genre.id}>
                <TableCell>{genre.name}</TableCell>
                <TableCell className="text-muted-foreground">{genre.slug}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(genre)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost-destructive"
                      size="sm"
                      onClick={() => handleDelete(genre)}
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

        {filteredGenres.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            {searchTerm ? 'Arama kriterlerine uygun tür bulunamadı.' : 'Henüz tür bulunmuyor.'}
          </div>
        )}
      </div>

      {/* Delete Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Türü Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{selectedGenre?.name}</strong> türünü silmek istediğinizden emin misiniz?
              Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading(LOADING_KEYS.ACTIONS.DELETE_GENRE)}>İptal</AlertDialogCancel>
            <Button
              onClick={handleDeleteConfirm}
              disabled={isLoading(LOADING_KEYS.ACTIONS.DELETE_GENRE)}
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