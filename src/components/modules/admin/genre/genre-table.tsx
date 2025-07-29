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
import { type GenreFilters } from '@/lib/schemas/genre.schema';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

  // Query key oluştur
  const queryKey = ['genres', { searchTerm, currentPage, limit }];

  // Genre'leri getir
  const { data, isLoading: isFetching, error } = useQuery({
    queryKey,
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
    staleTime: 5 * 60 * 1000, // 5 dakika
  });

  // Silme mutation'ı
  const deleteMutation = useMutation({
    mutationFn: deleteGenreAction,
    onSuccess: () => {
      toast.success('Tür başarıyla silindi!');
      setDeleteDialogOpen(false);
      setSelectedGenre(null);
      
      // Query'yi invalidate et
      queryClient.invalidateQueries({ queryKey: ['genres'] });
    },
    onError: (error) => {
      console.error('Delete genre error:', error);
      toast.error('Silme işlemi sırasında bir hata oluştu');
    },
  });

  // Filtreler değiştiğinde sayfa 1'e dön
  if (searchTerm) {
    setCurrentPage(1);
  }

  const handleEdit = (genre: Genre) => {
    onEdit?.(genre);
  };

  const handleDelete = (genre: Genre) => {
    setSelectedGenre(genre);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedGenre) return;
    deleteMutation.mutate(selectedGenre.id);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    if (!data) return [];
    
    const pages = [];
    const maxVisiblePages = 5;
    
    if (data.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= data.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(data.totalPages);
      } else if (currentPage >= data.totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = data.totalPages - 3; i <= data.totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(data.totalPages);
      }
    }
    
    return pages;
  };

  if (isFetching) {
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

  if (error) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-destructive">Türler yüklenirken bir hata oluştu</p>
      </div>
    );
  }

  const genres = data?.genres || [];
  const totalPages = data?.totalPages || 1;
  const totalGenres = data?.total || 0;

  return (
    <>
      <div className="glass-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ad</TableHead>
              <TableHead>Açıklama</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {genres.map((genre) => (
              <TableRow key={genre.id}>
                <TableCell className="font-medium">{genre.name}</TableCell>
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
                      disabled={deleteMutation.isPending}
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

        {genres.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            {searchTerm ? 'Arama kriterlerine uygun tür bulunamadı.' : 'Henüz tür bulunmuyor.'}
          </div>
        )}

        {/* Sayfalama */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border/50">
            <div className="text-sm text-muted-foreground">
              Toplam {totalGenres} tür, {currentPage}. sayfa / {totalPages} sayfa
            </div>
            
            <div className="flex items-center gap-2">
              {/* İlk sayfa */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              
              {/* Önceki sayfa */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
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
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              {/* Son sayfa */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
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
            <AlertDialogCancel>İptal</AlertDialogCancel>
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
