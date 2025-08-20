'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Play } from 'lucide-react';
import { AnimeMediaPart } from '@prisma/client';
import { getAnimeMediaPartListAction, deleteAnimeMediaPartAction } from '@/lib/actions/editor/anime-media-part.action';
import { toast } from 'sonner';
import { GetAnimeMediaPartsResponse } from '@/lib/types/api/anime.api';
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
import { queryKeys } from '@/lib/constants/query-keys';

// Tablo item tipi
type MediaPartTableItem = GetAnimeMediaPartsResponse['data'][0];

interface MediaPartTableProps {
  seriesId: string;
  onEdit?: (mediaPart: AnimeMediaPart) => void;
  onEpisodes?: (mediaPart: AnimeMediaPart) => void;
  refreshKey?: number;
}

export function MediaPartTable({ seriesId, onEdit, onEpisodes, refreshKey }: MediaPartTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMediaPart, setSelectedMediaPart] = useState<MediaPartTableItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(50);
  const queryClient = useQueryClient();

  // Query key oluştur
  const queryKey = queryKeys.anime.mediaPart.bySeriesId(seriesId);

  // Media part'ları getir
  const { data, isLoading: isFetching, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await getAnimeMediaPartListAction(seriesId);
      if (!result.success) {
        throw new Error(result.error || 'Media part\'lar yüklenirken bir hata oluştu');
      }
      return result.data as GetAnimeMediaPartsResponse;
    },
  });

  // Silme mutation'ı
  const deleteMutation = useMutation({
    mutationFn: deleteAnimeMediaPartAction,  
    onSuccess: () => {
      toast.success('Media part başarıyla silindi!');
      setDeleteDialogOpen(false);
      setSelectedMediaPart(null);
      
      // Query'yi invalidate et
      queryClient.invalidateQueries({ queryKey: queryKeys.anime.mediaPart.all });
    },
    onError: (error) => {
      console.error('Delete media part error:', error);
      toast.error(error.message || 'Silme işlemi sırasında bir hata oluştu');
    },
  });

  const handleEdit = (mediaPart: MediaPartTableItem) => {
    // Sadece id'yi geçir, form kendi verilerini yükleyecek
    onEdit?.({ id: mediaPart.id } as AnimeMediaPart);
  };

  const handleDelete = (mediaPart: MediaPartTableItem) => {
    setSelectedMediaPart(mediaPart);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedMediaPart) {
      await deleteMutation.mutateAsync(selectedMediaPart.id);
    }
  };

  const handleEpisodes = (mediaPart: MediaPartTableItem) => {
    // Sadece id'yi geçir
    onEpisodes?.({ id: mediaPart.id } as AnimeMediaPart);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    if (!data) return [];
    
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(data.totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (isFetching) {
    return (
      <div className="glass-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Başlık</TableHead>
              <TableHead>Sıra</TableHead>
              <TableHead>Bölüm</TableHead>
              <TableHead>Süre</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[200px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-8" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded" />
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

  if (error) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-destructive">Medya parçaları yüklenirken bir hata oluştu</p>
      </div>
    );
  }

  const mediaParts = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const totalMediaParts = data?.total || 0;

  return (
    <>
      <div className="glass-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Başlık</TableHead>
              <TableHead>Sıra</TableHead>
              <TableHead>Bölüm</TableHead>
              <TableHead>Süre</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mediaParts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Medya parçası bulunamadı
                </TableCell>
              </TableRow>
            ) : (
              mediaParts.map((mediaPart) => (
                <TableRow key={mediaPart.id}>
                  <TableCell className="font-mono text-sm">
                    #{mediaPart.id.slice(-6)}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{mediaPart.title}</div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {mediaPart.displayOrder || '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {mediaPart.episodes || '-'} bölüm
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {mediaPart.duration ? `${mediaPart.duration}dk` : '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEpisodes(mediaPart)}
                        className="h-8 w-8 p-0"
                        title="Bölümler"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(mediaPart)}
                        className="h-8 w-8 p-0"
                        title="Düzenle"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost-destructive"
                        size="sm"
                        onClick={() => handleDelete(mediaPart)}
                        disabled={deleteMutation.isPending}
                        className="h-8 w-8 p-0"
                        title="Sil"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Toplam {totalMediaParts} media part
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
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Media Part Sil</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{selectedMediaPart?.title}&quot; media part&apos;ını silmek istediğinizden emin misiniz? 
              Bu işlem geri alınamaz.
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