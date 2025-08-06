'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { StreamingPlatform } from '@prisma/client';
import { getStreamingPlatformsAction, deleteStreamingPlatformAction } from '@/lib/actions/admin/streaming-platform.action';
import { toast } from 'sonner';
import { GetStreamingPlatformsResponse } from '@/lib/types/api/streamingPlatform.api';
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

import { type StreamingPlatformFilters } from '@/lib/schemas/streamingPlatform.schema';

interface StreamingPlatformTableProps {
  onEdit?: (streamingPlatform: StreamingPlatform) => void;
  searchTerm?: string;
}

export function StreamingPlatformTable({ onEdit, searchTerm = '' }: StreamingPlatformTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStreamingPlatform, setSelectedStreamingPlatform] = useState<StreamingPlatform | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(50);
  const queryClient = useQueryClient();

  // İzleme Platform'larını getir (React Query ile)
  const { data: platformsData, isLoading } = useQuery({
    queryKey: ['streaming-platforms', searchTerm, currentPage, limit],
    queryFn: async () => {
      const filters: StreamingPlatformFilters = {
        page: currentPage,
        limit: limit,
      };
      if (searchTerm) filters.search = searchTerm;
      const result = await getStreamingPlatformsAction(filters);
      if (!result.success) {
        throw new Error(result.error || 'İzmele platformları yüklenirken bir hata oluştu');
      }
      return result.data as GetStreamingPlatformsResponse;
    },
  });

  // Filtreler değiştiğinde sayfa 1'e dön
  if (searchTerm && currentPage !== 1) {
    setCurrentPage(1);
  }

  // Client-side filtreleme kaldırıldı, direkt streamingPlatforms kullanılıyor
  const handleEdit = (streamingPlatform: StreamingPlatform) => {
    onEdit?.(streamingPlatform);
  };

  const handleDelete = (streamingPlatform: StreamingPlatform) => {
    setSelectedStreamingPlatform(streamingPlatform);
    setDeleteDialogOpen(true);
  };

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteStreamingPlatformAction(id),
    onSuccess: () => {
      toast.success('İzleme platformu başarıyla silindi!');
      setDeleteDialogOpen(false);
      setSelectedStreamingPlatform(null);
      // Query'yi invalidate et
      queryClient.invalidateQueries({ queryKey: ['streaming-platforms'] });
    },
    onError: (error) => {
      console.error('Delete streaming platform error:', error);
      toast.error(error.message || 'Silme işlemi başarısız oldu');
    },
  });

  const handleDeleteConfirm = async () => {
    if (!selectedStreamingPlatform) return;
    deleteMutation.mutate(selectedStreamingPlatform.id);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const totalPages = platformsData?.totalPages || 1;
    
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
              <TableHead className="w-1/3">Base URL</TableHead>
              <TableHead className="w-1/3">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {platformsData?.platforms.map((streamingPlatform) => (
              <TableRow key={streamingPlatform.id}>
                <TableCell>{streamingPlatform.name}</TableCell>
                <TableCell className="text-muted-foreground">{streamingPlatform.baseUrl}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(streamingPlatform)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost-destructive"
                      size="sm"
                      onClick={() => handleDelete(streamingPlatform)}
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

        {(!platformsData?.platforms || platformsData.platforms.length === 0) && (
          <div className="p-8 text-center text-muted-foreground">
            {searchTerm ? 'Arama kriterlerine uygun izleme platformu bulunamadı.' : 'Henüz izleme platformu bulunmuyor.'}
          </div>
        )}

        {/* Sayfalama */}
        {platformsData && platformsData.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border/50">
            <div className="text-sm text-muted-foreground">
              Toplam {platformsData.total} izleme platformu, {currentPage}. sayfa / {platformsData.totalPages} sayfa
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
                disabled={currentPage === platformsData.totalPages || isLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              {/* Son sayfa */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(platformsData.totalPages)}
                disabled={currentPage === platformsData.totalPages || isLoading}
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
            <AlertDialogTitle>İzleme Platformunu Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{selectedStreamingPlatform?.name}</strong> izleme platformunu silmek istediğinizden emin misiniz?
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
