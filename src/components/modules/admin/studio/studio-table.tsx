'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Studio } from '@prisma/client';
import { MASTER_DATA_DOMAIN } from '@/lib/constants';
import { getStudiosAction, deleteStudioAction } from '@/lib/actions/admin/studio.action';
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type StudioFilters } from '@/lib/schemas/studio.schema';

interface StudioTableProps {
  onEdit?: (studio: Studio) => void;
  searchTerm?: string;
  selectedStudioType?: boolean | null;
}

export function StudioTable({ onEdit, searchTerm = '', selectedStudioType = null }: StudioTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(50);
  const queryClient = useQueryClient();

  // Studio'ları getir (React Query ile)
  const { data: studiosData, isLoading } = useQuery({
    queryKey: ['studios', searchTerm, selectedStudioType, currentPage, limit],
    queryFn: async () => {
      const filters: StudioFilters = {
        page: currentPage,
        limit: limit,
      };
      if (searchTerm) filters.search = searchTerm;
      if (selectedStudioType !== null) filters.isAnimationStudio = selectedStudioType;
      const result = await getStudiosAction(filters);
      if (!result.success) {
        throw new Error(result.error || 'Stüdyolar yüklenirken bir hata oluştu');
      }
      return result.data as GetStudiosResponse;
    },
  });

  // Filtreler değiştiğinde sayfa 1'e dön
  if ((searchTerm || selectedStudioType !== null) && currentPage !== 1) {
    setCurrentPage(1);
  }

  const handleEdit = (studio: Studio) => {
    onEdit?.(studio);
  };

  const handleDelete = (studio: Studio) => {
    setSelectedStudio(studio);
    setDeleteDialogOpen(true);
  };

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteStudioAction(id),
    onSuccess: () => {
      toast.success('Stüdyo başarıyla silindi!');
      setDeleteDialogOpen(false);
      setSelectedStudio(null);
      // Query'yi invalidate et
      queryClient.invalidateQueries({ queryKey: ['studios'] });
    },
    onError: (error) => {
      console.error('Delete studio error:', error);
      toast.error(error.message || 'Silme işlemi başarısız oldu');
    },
  });

  const handleDeleteConfirm = async () => {
    if (!selectedStudio) return;
    deleteMutation.mutate(selectedStudio.id);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const totalPages = studiosData?.totalPages || 1;
    
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
              <TableHead className="w-1/6">Tür</TableHead>
              <TableHead className="w-1/6">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {studiosData?.data.map((studio) => (
              <TableRow key={studio.id}>
                <TableCell>{studio.name}</TableCell>
                <TableCell className="text-muted-foreground">{studio.slug}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    studio.isAnimationStudio
                  ? MASTER_DATA_DOMAIN.STUDIO_TYPE_COLORS.ANIMATION
                  : MASTER_DATA_DOMAIN.STUDIO_TYPE_COLORS.PRODUCTION
              }`}>
                {studio.isAnimationStudio ? MASTER_DATA_DOMAIN.STUDIO_TYPE_LABELS.ANIMATION : MASTER_DATA_DOMAIN.STUDIO_TYPE_LABELS.PRODUCTION}
                  </span>
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

        {(!studiosData?.data || studiosData.data.length === 0) && (
          <div className="p-8 text-center text-muted-foreground">
            {searchTerm ? 'Arama kriterlerine uygun stüdyo bulunamadı.' : 'Henüz stüdyo bulunmuyor.'}
          </div>
        )}

        {/* Sayfalama */}
        {studiosData && studiosData.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border/50">
            <div className="text-sm text-muted-foreground">
              Toplam {studiosData.total} stüdyo, {currentPage}. sayfa / {studiosData.totalPages} sayfa
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
                disabled={currentPage === studiosData.totalPages || isLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              {/* Son sayfa */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(studiosData.totalPages)}
                disabled={currentPage === studiosData.totalPages || isLoading}
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
            <AlertDialogTitle>Stüdyoyu Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{selectedStudio?.name}</strong> stüdyosunu silmek istediğinizden emin misiniz?
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