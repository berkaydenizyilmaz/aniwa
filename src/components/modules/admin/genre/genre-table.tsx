'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Genre } from '@prisma/client';
import { getGenresAction, deleteGenreAction } from '@/lib/actions/admin/genre.action';
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type GenreFilters } from '@/lib/schemas/genre.schema';

interface GenreTableProps {
  onEdit?: (genre: Genre) => void;
  searchTerm?: string;
}

export function GenreTable({ onEdit, searchTerm = '' }: GenreTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(50);
  const queryClient = useQueryClient();

  // Genre'leri getir (React Query ile)
  const { data: genresData, isLoading } = useQuery({
    queryKey: ['genres', searchTerm, currentPage, limit],
    queryFn: async () => {
      const filters: GenreFilters = {
        page: currentPage,
        limit: limit,
      };
      if (searchTerm) filters.search = searchTerm;
      const result = await getGenresAction(filters);
      if (!result.success) {
        throw new Error(result.error || 'Türler yüklenirken bir hata oluştu');
      }
      return result.data as GetGenresResponse;
    },
  });

  // Filtreler değiştiğinde sayfa 1'e dön
  if (searchTerm && currentPage !== 1) {
    setCurrentPage(1);
  }

  // Client-side filtreleme kaldırıldı, direkt genres kullanılıyor
  const handleEdit = (genre: Genre) => {
    onEdit?.(genre);
  };

  const handleDelete = (genre: Genre) => {
    setSelectedGenre(genre);
    setDeleteDialogOpen(true);
  };

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteGenreAction(id),
    onSuccess: () => {
      toast.success('Tür başarıyla silindi!');
      setDeleteDialogOpen(false);
      setSelectedGenre(null);
      // Query'yi invalidate et
      queryClient.invalidateQueries({ queryKey: ['genres'] });
    },
    onError: (error) => {
      console.error('Delete genre error:', error);
      toast.error('Silme işlemi başarısız oldu');
    },
  });

  const handleDeleteConfirm = async () => {
    if (!selectedGenre) return;
    deleteMutation.mutate(selectedGenre.id);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const totalPages = genresData?.totalPages || 1;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (isLoading) {
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
            {genresData?.genres.map((genre) => (
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

        {(!genresData?.genres || genresData.genres.length === 0) && (
          <div className="p-8 text-center text-muted-foreground">
            {searchTerm ? 'Arama kriterlerine uygun tür bulunamadı.' : 'Henüz tür bulunmuyor.'}
          </div>
        )}

        {/* Sayfalama */}
        {genresData && genresData.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border/50">
            <div className="text-sm text-muted-foreground">
              Toplam {genresData.total} tür, {currentPage}. sayfa / {genresData.totalPages} sayfa
            </div>
            
            <div className="flex items-center gap-2">
              {/* İlk sayfa */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || isLoading}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              
              {/* Önceki sayfa */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {/* Sayfa numaraları */}
              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => (
                  <div key={index}>
                    {page === '...' ? (
                      <span className="px-2 py-1 text-muted-foreground">...</span>
                    ) : (
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page as number)}
                        disabled={isLoading}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Sonraki sayfa */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === genresData.totalPages || isLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              {/* Son sayfa */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(genresData.totalPages)}
                disabled={currentPage === genresData.totalPages || isLoading}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
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
            <AlertDialogCancel disabled={deleteMutation.isPending}>İptal</AlertDialogCancel>
            <Button
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
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