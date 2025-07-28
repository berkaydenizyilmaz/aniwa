'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { AnimeSeries } from '@prisma/client';
import { getAnimeSeriesAction, deleteAnimeSeriesAction } from '@/lib/actions/editor/anime.action';
import { toast } from 'sonner';
import { GetAllAnimeSeriesResponse } from '@/lib/types/api/anime.api';
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
import { type AnimeSeriesFilters } from '@/lib/schemas/anime.schema';

interface AnimeTableProps {
  onEdit?: (anime: AnimeSeries) => void;
  searchTerm?: string;
}

export function AnimeTable({ onEdit, searchTerm = '' }: AnimeTableProps) {
  const [animeSeries, setAnimeSeries] = useState<AnimeSeries[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<AnimeSeries | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAnime, setTotalAnime] = useState(0);
  const [limit] = useState(50);
  const { setLoading: setLoadingStore, isLoading } = useLoadingStore();

  // Anime serilerini getir (server-side filtreleme)
  useEffect(() => {
    const fetchAnimeSeries = async () => {
      try {
        setLoadingStore(LOADING_KEYS.PAGES.EDITOR_ANIME_PAGE, true);
        const filters: AnimeSeriesFilters = {
          page: currentPage,
          limit: limit,
        };
        if (searchTerm) filters.search = searchTerm;
        const result = await getAnimeSeriesAction(filters);
        if (!result.success) {
          toast.error('error' in result ? result.error : 'Anime serileri yüklenirken bir hata oluştu');
          return;
        }
        const data = result.data as GetAllAnimeSeriesResponse;
        setAnimeSeries(data.animeSeries);
        setTotalPages(data.totalPages);
        setTotalAnime(data.total);
      } catch (error) {
        console.error('Fetch anime series error:', error);
        toast.error('Anime serileri yüklenirken bir hata oluştu');
      } finally {
        setLoadingStore(LOADING_KEYS.PAGES.EDITOR_ANIME_PAGE, false);
      }
    };
    fetchAnimeSeries();
  }, [setLoadingStore, searchTerm, currentPage, limit]);

  // Filtreler değiştiğinde sayfa 1'e dön
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleEdit = (anime: AnimeSeries) => {
    onEdit?.(anime);
  };

  const handleDelete = (anime: AnimeSeries) => {
    setSelectedAnime(anime);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAnime || isLoading(LOADING_KEYS.ACTIONS.DELETE_ANIME)) return;

    setLoadingStore(LOADING_KEYS.ACTIONS.DELETE_ANIME, true);

    try {
      const result = await deleteAnimeSeriesAction(selectedAnime.id);

      if (!result.success) {
        toast.error('error' in result ? result.error : 'Silme işlemi başarısız oldu');
        return;
      }

      toast.success('Anime serisi başarıyla silindi');
      setDeleteDialogOpen(false);
      setSelectedAnime(null);

      // Tabloyu yenile
      const filters: AnimeSeriesFilters = {
        page: currentPage,
        limit: limit,
      };
      if (searchTerm) filters.search = searchTerm;
      const refreshResult = await getAnimeSeriesAction(filters);
      if (refreshResult.success) {
        const data = refreshResult.data as GetAllAnimeSeriesResponse;
        setAnimeSeries(data.animeSeries);
        setTotalPages(data.totalPages);
        setTotalAnime(data.total);
      }

    } catch (error) {
      console.error('Delete anime error:', error);
      toast.error('Silme işlemi sırasında bir hata oluştu');
    } finally {
      setLoadingStore(LOADING_KEYS.ACTIONS.DELETE_ANIME, false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (isLoading(LOADING_KEYS.PAGES.EDITOR_ANIME_PAGE)) {
    return (
      <div className="space-y-4">
        <div className="glass-card p-4">
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="glass-card p-4">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="glass-card p-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Başlık</TableHead>
                <TableHead>Tür</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Bölümler</TableHead>
                <TableHead>Yıl</TableHead>
                <TableHead>İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {animeSeries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Anime serisi bulunamadı
                  </TableCell>
                </TableRow>
              ) : (
                animeSeries.map((anime) => (
                  <TableRow key={anime.id}>
                    <TableCell className="font-medium">{anime.title}</TableCell>
                    <TableCell>{anime.type}</TableCell>
                    <TableCell>{anime.status}</TableCell>
                    <TableCell>{anime.episodes || '-'}</TableCell>
                    <TableCell>{anime.seasonYear || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(anime)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost-destructive"
                          size="sm"
                          onClick={() => handleDelete(anime)}
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
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Toplam {totalAnime} anime serisi
            </div>
            <div className="flex items-center gap-2">
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
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anime Serisini Sil</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{selectedAnime?.title}&rdquo; anime serisini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isLoading(LOADING_KEYS.ACTIONS.DELETE_ANIME)}
            >
              {isLoading(LOADING_KEYS.ACTIONS.DELETE_ANIME) ? 'Siliniyor...' : 'Sil'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 