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

interface GenreTableProps {
  onEdit?: (genre: Genre) => void;
  searchTerm?: string;
}

export function GenreTable({ onEdit, searchTerm = '' }: GenreTableProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Genre'leri getir
  useEffect(() => {
    const fetchGenres = async () => {
      try {
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
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

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
    if (!selectedGenre || isDeleting) return;

    setIsDeleting(true);

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
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">İsim</TableHead>
              <TableHead className="w-1/4">Slug</TableHead>
              <TableHead className="w-1/4">Oluşturulma Tarihi</TableHead>
              <TableHead className="w-1/4">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
              <TableHead className="w-1/4">Oluşturulma Tarihi</TableHead>
              <TableHead className="w-1/4">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGenres.map((genre) => (
              <TableRow key={genre.id}>
                <TableCell>{genre.name}</TableCell>
                <TableCell className="text-muted-foreground">{genre.slug}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(genre.createdAt).toLocaleDateString('tr-TR')}
                </TableCell>
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
            <AlertDialogCancel disabled={isDeleting}>İptal</AlertDialogCancel>
            <Button
              onClick={handleDeleteConfirm}
              loading={isDeleting}
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