'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { StreamingPlatform } from '@prisma/client';
import { getStreamingPlatformsAction, deleteStreamingPlatformAction } from '@/lib/actions/streaming-platform.action';
import { toast } from 'sonner';
import { GetStreamingPlatformsResponse } from '@/lib/types/api/streaming-platform.api';
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
import { type StreamingPlatformFilters } from '@/lib/schemas/streaming-platform.schema';

interface StreamingPlatformTableProps {
  onEdit?: (streamingPlatform: StreamingPlatform) => void;
  searchTerm?: string;
}

export function StreamingPlatformTable({ onEdit, searchTerm = '' }: StreamingPlatformTableProps) {
  const [streamingPlatforms, setStreamingPlatforms] = useState<StreamingPlatform[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStreamingPlatform, setSelectedStreamingPlatform] = useState<StreamingPlatform | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStreamingPlatforms, setTotalStreamingPlatforms] = useState(0);
  const [limit] = useState(50);
  const { setLoading: setLoadingStore, isLoading } = useLoadingStore();

  // Streaming Platform'ları getir (server-side filtreleme)
  useEffect(() => {
    const fetchStreamingPlatforms = async () => {
      try {
        setLoadingStore(LOADING_KEYS.PAGES.STREAMING_PLATFORMS, true);
        const filters: StreamingPlatformFilters = {
          page: currentPage,
          limit: limit,
        };
        if (searchTerm) filters.search = searchTerm;
        const result = await getStreamingPlatformsAction(filters);
        if (!result.success) {
          toast.error(result.error || 'Yayın platformları yüklenirken bir hata oluştu');
          return;
        }
        const data = result.data as GetStreamingPlatformsResponse;
        setStreamingPlatforms(data.streamingPlatforms);
        setTotalPages(data.totalPages);
        setTotalStreamingPlatforms(data.total);
      } catch (error) {
        console.error('Fetch streaming platforms error:', error);
        toast.error('Yayın platformları yüklenirken bir hata oluştu');
      } finally {
        setLoadingStore(LOADING_KEYS.PAGES.STREAMING_PLATFORMS, false);
      }
    };
    fetchStreamingPlatforms();
  }, [setLoadingStore, searchTerm, currentPage, limit]);

  // Filtreler değiştiğinde sayfa 1'e dön
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Client-side filtreleme kaldırıldı, direkt streamingPlatforms kullanılıyor
  const handleEdit = (streamingPlatform: StreamingPlatform) => {
    onEdit?.(streamingPlatform);
  };

  const handleDelete = (streamingPlatform: StreamingPlatform) => {
    setSelectedStreamingPlatform(streamingPlatform);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedStreamingPlatform || isLoading(LOADING_KEYS.ACTIONS.DELETE_STREAMING_PLATFORM)) return;

    setLoadingStore(LOADING_KEYS.ACTIONS.DELETE_STREAMING_PLATFORM, true);

    try {
      const result = await deleteStreamingPlatformAction(selectedStreamingPlatform.id);

      if (!result.success) {
        toast.error(result.error || 'Silme işlemi başarısız oldu');
        return;
      }

      toast.success('Yayın platformu başarıyla silindi!');
      setDeleteDialogOpen(false);

      // Tabloyu yenile
      const fetchResult = await getStreamingPlatformsAction({ page: currentPage, limit });
      if (fetchResult.success) {
        const data = fetchResult.data as GetStreamingPlatformsResponse;
        setStreamingPlatforms(data.streamingPlatforms);
        setTotalPages(data.totalPages);
        setTotalStreamingPlatforms(data.total);
      }

    } catch (error) {
      console.error('Delete streaming platform error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoadingStore(LOADING_KEYS.ACTIONS.DELETE_STREAMING_PLATFORM, false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
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

  if (isLoading(LOADING_KEYS.PAGES.STREAMING_PLATFORMS)) {
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
            {streamingPlatforms.map((streamingPlatform) => (
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

        {streamingPlatforms.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            {searchTerm ? 'Arama kriterlerine uygun yayın platformu bulunamadı.' : 'Henüz yayın platformu bulunmuyor.'}
          </div>
        )}

        {/* Sayfalama */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border/50">
            <div className="text-sm text-muted-foreground">
              Toplam {totalStreamingPlatforms} yayın platformu, {currentPage}. sayfa / {totalPages} sayfa
            </div>
            
            <div className="flex items-center gap-2">
              {/* İlk sayfa */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || isLoading(LOADING_KEYS.PAGES.STREAMING_PLATFORMS)}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              
              {/* Önceki sayfa */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading(LOADING_KEYS.PAGES.STREAMING_PLATFORMS)}
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
                        disabled={isLoading(LOADING_KEYS.PAGES.STREAMING_PLATFORMS)}
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
                disabled={currentPage === totalPages || isLoading(LOADING_KEYS.PAGES.STREAMING_PLATFORMS)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              {/* Son sayfa */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || isLoading(LOADING_KEYS.PAGES.STREAMING_PLATFORMS)}
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
            <AlertDialogTitle>Yayın Platformunu Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{selectedStreamingPlatform?.name}</strong> yayın platformunu silmek istediğinizden emin misiniz?
              Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading(LOADING_KEYS.ACTIONS.DELETE_STREAMING_PLATFORM)}>İptal</AlertDialogCancel>
            <Button
              onClick={handleDeleteConfirm}
              disabled={isLoading(LOADING_KEYS.ACTIONS.DELETE_STREAMING_PLATFORM)}
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