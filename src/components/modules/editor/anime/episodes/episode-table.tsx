'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Link } from 'lucide-react';
import { Episode } from '@prisma/client';
import { getEpisodeListAction, deleteEpisodeAction } from '@/lib/actions/editor/episode.action';
import { toast } from 'sonner';
import { GetEpisodeListResponse } from '@/lib/types/api/anime.api';
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
type EpisodeTableItem = GetEpisodeListResponse['data'][0];

interface EpisodeTableProps {
  mediaPartId: string;
  onEdit?: (episode: Episode) => void;
  onStreamingLinks?: (episode: Episode) => void;
  refreshKey?: number;
}

export function EpisodeTable({ mediaPartId, onEdit, onStreamingLinks, refreshKey }: EpisodeTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<EpisodeTableItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(50);
  const queryClient = useQueryClient();

  // Query key oluştur
  const queryKey = queryKeys.anime.episode.byMediaPartId(mediaPartId);

  // Episode'ları getir
  const { data, isLoading: isFetching, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const filters: EpisodeFilters = {
        page: currentPage,
        limit: limit,
      };
      
      const result = await getEpisodesAction(mediaPartId, filters);
      if (!result.success) {
        throw new Error(result.error || 'Episode\'lar yüklenirken bir hata oluştu');
      }
      return result.data as GetEpisodesResponse;
    },
  });

  // Silme mutation'ı
  const deleteMutation = useMutation({
    mutationFn: deleteEpisodeAction,
    onSuccess: () => {
      toast.success('Episode başarıyla silindi!');
      setDeleteDialogOpen(false);
      setSelectedEpisode(null);
      
      // Query'yi invalidate et
      queryClient.invalidateQueries({ queryKey: queryKeys.anime.episode.all });
    },
    onError: (error) => {
      console.error('Delete episode error:', error);
      toast.error(error.message || 'Silme işlemi sırasında bir hata oluştu');
    },
  });

  const handleEdit = (episode: EpisodeTableItem) => {
    // Sadece id'yi geçir, form kendi verilerini yükleyecek
    onEdit?.({ id: episode.id } as Episode);
  };

  const handleStreamingLinks = (episode: EpisodeTableItem) => {
    // Sadece id'yi geçir, streaming links sayfası kendi verilerini yükleyecek
    onStreamingLinks?.({ id: episode.id } as Episode);
  };

  const handleDelete = (episode: EpisodeTableItem) => {
    setSelectedEpisode(episode);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedEpisode) {
      deleteMutation.mutate(selectedEpisode.id);
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
        <p className="text-destructive">Bölümler yüklenirken bir hata oluştu</p>
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
              <TableHead>Thumbnail</TableHead>
              <TableHead>Bölüm</TableHead>
              <TableHead>Başlık</TableHead>
              <TableHead>Süre</TableHead>
              <TableHead>Yayın Tarihi</TableHead>
              <TableHead>Filler</TableHead>
              <TableHead>Puan</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-16 w-24 rounded" /></TableCell>
                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
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

  if (!data || data.data.length === 0) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-muted-foreground">Henüz bölüm bulunmuyor</p>
      </div>
    );
  }

  return (
    <>
      <div className="glass-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thumbnail</TableHead>
              <TableHead>Bölüm</TableHead>
              <TableHead>Başlık</TableHead>
              <TableHead>Süre</TableHead>
              <TableHead>Yayın Tarihi</TableHead>
              <TableHead>Filler</TableHead>
              <TableHead>Puan</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.map((episode) => (
              <TableRow key={episode.id}>
                <TableCell>
                  {episode.thumbnailImage ? (
                    <Image
                      src={episode.thumbnailImage}
                      alt={episode.title || `Episode ${episode.episodeNumber}`}
                      width={96}
                      height={54}
                      className="rounded object-cover"
                    />
                  ) : (
                    <div className="h-[54px] w-24 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                      No Image
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  #{episode.episodeNumber}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{episode.title || `Episode ${episode.episodeNumber}`}</div>
                </TableCell>
                <TableCell>
                  {episode.duration ? `${episode.duration} dk` : '-'}
                </TableCell>
                <TableCell>
                  {episode.airDate ? new Date(episode.airDate).toLocaleDateString('tr-TR') : '-'}
                </TableCell>
                <TableCell>
                  {episode.isFiller ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Filler
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Canon
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {episode.averageScore ? episode.averageScore.toFixed(1) : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(episode)}
                      className="h-8 w-8 p-0"
                      title="Düzenle"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStreamingLinks(episode)}
                      className="h-8 w-8 p-0"
                      title="İzleme Linkleri"
                    >
                      <Link className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost-destructive"
                      size="sm"
                      onClick={() => handleDelete(episode)}
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
            Toplam {data.total} bölüm
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
            <AlertDialogTitle>Bölümü Sil</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{selectedEpisode?.title || `Bölüm ${selectedEpisode?.episodeNumber}`}&quot; bölümünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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