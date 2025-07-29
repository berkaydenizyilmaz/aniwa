'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { AnimeSeries, AnimeType, AnimeStatus } from '@prisma/client';
import { getAnimeSeriesListAction, deleteAnimeSeriesAction } from '@/lib/actions/editor/anime-series.action';
import { toast } from 'sonner';
import { GetAnimeSeriesListResponse } from '@/lib/types/api/anime.api';
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
import { type AnimeFilters } from '@/lib/schemas/anime.schema';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface AnimeSeriesTableProps {
  onEdit?: (animeSeries: AnimeSeries) => void;
  searchTerm?: string;
  selectedType?: string;
  selectedStatus?: string;
  refreshKey?: number;
}

export function AnimeSeriesTable({ onEdit, searchTerm = '', selectedType = '', selectedStatus = '', refreshKey }: AnimeSeriesTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAnimeSeries, setSelectedAnimeSeries] = useState<AnimeSeries | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(50);
  const { setLoading: setLoadingStore, isLoading } = useLoadingStore();
  const queryClient = useQueryClient();

  // Query key oluştur
  const queryKey = ['anime-series', { searchTerm, selectedType, selectedStatus, currentPage, limit, refreshKey }];

  // Anime serilerini getir
  const { data, isLoading: isFetching, error } = useQuery({
    queryKey,
    queryFn: async () => {
      setLoadingStore(LOADING_KEYS.PAGES.EDITOR_ANIME, true);
      try {
        const filters: AnimeFilters = {
          page: currentPage,
          limit: limit,
        };
        if (searchTerm) filters.search = searchTerm;
        if (selectedType) filters.type = selectedType as AnimeType;
        if (selectedStatus) filters.status = selectedStatus as AnimeStatus;
        
        const result = await getAnimeSeriesListAction(filters);
        if (!result.success) {
          throw new Error(result.error || 'Anime serileri yüklenirken bir hata oluştu');
        }
        return result.data as GetAnimeSeriesListResponse;
      } finally {
        setLoadingStore(LOADING_KEYS.PAGES.EDITOR_ANIME, false);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 dakika
  });

  // Silme mutation'ı
  const deleteMutation = useMutation({
    mutationFn: deleteAnimeSeriesAction,
    onSuccess: () => {
      toast.success('Anime serisi başarıyla silindi!');
      setDeleteDialogOpen(false);
      setSelectedAnimeSeries(null);
      
      // Query'yi invalidate et
      queryClient.invalidateQueries({ queryKey: ['anime-series'] });
    },
    onError: (error) => {
      console.error('Delete anime series error:', error);
      toast.error('Silme işlemi sırasında bir hata oluştu');
    },
  });

  // Filtreler değiştiğinde sayfa 1'e dön
  if (searchTerm || selectedType || selectedStatus) {
    setCurrentPage(1);
  }

  const handleEdit = (animeSeries: AnimeSeries) => {
    onEdit?.(animeSeries);
  };

  const handleDelete = (animeSeries: AnimeSeries) => {
    setSelectedAnimeSeries(animeSeries);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAnimeSeries) return;
    deleteMutation.mutate(selectedAnimeSeries.id);
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
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="glass-card p-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-destructive">Anime serileri yüklenirken bir hata oluştu</p>
      </div>
    );
  }

  const animeSeries = data?.animeSeries || [];
  const totalPages = data?.totalPages || 1;
  const totalAnimeSeries = data?.total || 0;

  return (
    <>
      <div className="glass-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Başlık</TableHead>
              <TableHead>Tip</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Bölüm Sayısı</TableHead>
              <TableHead>Puan</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {animeSeries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Anime serisi bulunamadı
                </TableCell>
              </TableRow>
            ) : (
              animeSeries.map((animeSeries) => (
                <TableRow key={animeSeries.id}>
                  <TableCell className="font-mono text-sm">
                    #{animeSeries.aniwaPublicId}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{animeSeries.title}</div>
                      {animeSeries.englishTitle && (
                        <div className="text-sm text-muted-foreground">{animeSeries.englishTitle}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {animeSeries.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      animeSeries.status === 'FINISHED' ? 'bg-green-100 text-green-800' :
                      animeSeries.status === 'RELEASING' ? 'bg-blue-100 text-blue-800' :
                      animeSeries.status === 'NOT_YET_RELEASED' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {animeSeries.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {animeSeries.episodes || '-'}
                  </TableCell>
                  <TableCell>
                    {animeSeries.averageScore ? animeSeries.averageScore.toFixed(1) : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(animeSeries)}
                        disabled={false}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost-destructive"
                        size="sm"
                        onClick={() => handleDelete(animeSeries)}
                        disabled={deleteMutation.isPending}
                        className="h-8 w-8 p-0"
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
            Toplam {totalAnimeSeries} anime serisi
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
            <AlertDialogTitle>Anime Serisini Sil</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{selectedAnimeSeries?.title}&quot; anime serisini silmek istediğinizden emin misiniz? 
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