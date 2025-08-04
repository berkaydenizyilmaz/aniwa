'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus } from 'lucide-react';
import { StreamingLink } from '@prisma/client';
import { getStreamingLinksByEpisodeAction, deleteStreamingLinkAction } from '@/lib/actions/editor/streaming-link.action';
import { toast } from 'sonner';
import { GetStreamingLinksResponse } from '@/lib/types/api/anime.api';
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

// Tablo item tipi
type StreamingLinkTableItem = GetStreamingLinksResponse['streamingLinks'][0];

interface StreamingLinkTableProps {
  episodeId: string;
  onEdit?: (streamingLink: StreamingLink) => void;
  onCreateNew?: () => void;
  refreshKey?: number;
}

export function StreamingLinkTable({ episodeId, onEdit, onCreateNew, refreshKey }: StreamingLinkTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStreamingLink, setSelectedStreamingLink] = useState<StreamingLinkTableItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(50);
  const queryClient = useQueryClient();

  // Query key oluştur
  const queryKey = ['streaming-links', { episodeId, currentPage, limit, refreshKey }];

  // Streaming link'leri getir
  const { data, isLoading: isFetching, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await getStreamingLinksByEpisodeAction(episodeId, currentPage, limit);
      if (!result.success) {
        throw new Error(result.error || 'Streaming link\'ler yüklenirken bir hata oluştu');
      }
      return result.data as GetStreamingLinksResponse;
    },
    staleTime: 5 * 60 * 1000, // 5 dakika
  });

  // Silme mutation'ı
  const deleteMutation = useMutation({
    mutationFn: deleteStreamingLinkAction,
    onSuccess: () => {
      toast.success('İzleme linki başarıyla silindi!');
      setDeleteDialogOpen(false);
      setSelectedStreamingLink(null);
      
      // Query'yi invalidate et
      queryClient.invalidateQueries({ queryKey: ['streaming-links'] });
    },
    onError: (error) => {
      console.error('Delete streaming link error:', error);
      toast.error('Silme işlemi sırasında bir hata oluştu');
    },
  });

  const handleEdit = (streamingLink: StreamingLinkTableItem) => {
    // Sadece id'yi geçir, form kendi verilerini yükleyecek
    onEdit?.({ id: streamingLink.id } as StreamingLink);
  };

  const handleDelete = (streamingLink: StreamingLinkTableItem) => {
    setSelectedStreamingLink(streamingLink);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedStreamingLink) {
      deleteMutation.mutate(selectedStreamingLink.id);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    if (!data) return [];
    
    const totalPages = data.totalPages;
    const current = currentPage;
    const pages = [];
    
    // İlk sayfa
    if (current > 1) {
      pages.push(1);
    }
    
    // Önceki sayfalar
    for (let i = Math.max(2, current - 2); i < current; i++) {
      pages.push(i);
    }
    
    // Mevcut sayfa
    pages.push(current);
    
    // Sonraki sayfalar
    for (let i = current + 1; i <= Math.min(totalPages - 1, current + 2); i++) {
      pages.push(i);
    }
    
    // Son sayfa
    if (current < totalPages) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  if (error) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-destructive">İzleme linkleri yüklenirken bir hata oluştu</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Tekrar Dene
        </Button>
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="glass-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Platform</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Oluşturulma</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[300px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!data || data.streamingLinks.length === 0) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-muted-foreground mb-4">Henüz izleme linki bulunmuyor</p>
      </div>
    );
  }

  return (
    <>
      <div className="glass-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Platform</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Oluşturulma</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.streamingLinks.map((streamingLink) => (
              <TableRow key={streamingLink.id}>
                <TableCell>
                  <div className="font-medium">{streamingLink.platform.name}</div>
                </TableCell>
                <TableCell>
                  <a 
                    href={streamingLink.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline truncate block max-w-[300px]"
                  >
                    {streamingLink.url}
                  </a>
                </TableCell>
                <TableCell>
                  {new Date(streamingLink.createdAt).toLocaleDateString('tr-TR')}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(streamingLink)}
                      className="h-8 w-8 p-0"
                      title="Düzenle"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost-destructive"
                      size="sm"
                      onClick={() => handleDelete(streamingLink)}
                      disabled={deleteMutation.isPending}
                      className="h-8 w-8 p-0"
                      title="Sil"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Toplam {data.total} streaming link
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {getPageNumbers().map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === data.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(data.totalPages)}
              disabled={currentPage === data.totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Streaming Link&apos;i Sil</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{selectedStreamingLink?.platform.name}&quot; platformundaki streaming link&apos;i silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              Sil
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 