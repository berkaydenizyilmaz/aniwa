'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus, Play } from 'lucide-react';
import { AnimeSeries } from '@prisma/client';
import { getAnimeSeriesAction, deleteAnimeSeriesAction } from '@/lib/actions/editor/anime.action';
import { toast } from 'sonner';
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
        setLoadingStore(LOADING_KEYS.PAGES.ANIME, true);
        const filters: AnimeSeriesFilters = {
          page: currentPage,
          limit: limit,
        };
        if (searchTerm) filters.search = searchTerm;
        const result = await getAnimeSeriesAction(filters);
        if (!result.success) {
          const errorMessage = 'error' in result ? result.error : 'Anime serileri yüklenirken bir hata oluştu';
          toast.error(errorMessage);
          return;
        }
        if (result.data) {
          setAnimeSeries(result.data.animeSeries);
          setTotalPages(result.data.totalPages);
          setTotalAnime(result.data.total);
        }
      } catch (error) {
        console.error('Fetch anime series error:', error);
        toast.error('Anime serileri yüklenirken bir hata oluştu');
      } finally {
        setLoadingStore(LOADING_KEYS.PAGES.ANIME, false);
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
        const errorMessage = 'error' in result ? result.error : 'Silme işlemi başarısız oldu';
        toast.error(errorMessage);
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
      if (refreshResult.success && refreshResult.data) {
        setAnimeSeries(refreshResult.data.animeSeries);
        setTotalPages(refreshResult.data.totalPages);
        setTotalAnime(refreshResult.data.total);
      }

    } catch (error) {
      console.error('Delete anime series error:', error);
      toast.error('Silme işlemi sırasında bir hata oluştu');
    } finally {
      setLoadingStore(LOADING_KEYS.ACTIONS.DELETE_ANIME, false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
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

  if (isLoading(LOADING_KEYS.PAGES.ANIME)) {
    return (
      <div className="glass-card">
        <div className="p-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center gap-4 py-3 border-b border-border/50 last:border-b-0">
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 flex-1" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
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
              <TableHead className="w-1/4">Başlık</TableHead>
              <TableHead className="w-1/6">Tür</TableHead>
              <TableHead className="w-1/6">Durum</TableHead>
              <TableHead className="w-1/6">Sezon</TableHead>
              <TableHead className="w-1/6">Yıl</TableHead>
              <TableHead className="w-1/6">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {animeSeries?.map((anime) => (
              <TableRow key={anime.id}>
                <TableCell className="font-medium">{anime.title}</TableCell>
                <TableCell>{anime.type}</TableCell>
                <TableCell>{anime.status}</TableCell>
                <TableCell>{anime.season || '-'}</TableCell>
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
                    {anime.isMultiPart ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Alt Medya Ekle"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Bölüm Ekle"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
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
            ))}
          </TableBody>
        </Table>

        {animeSeries.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            {searchTerm ? 'Arama kriterlerine uygun anime bulunamadı.' : 'Henüz anime bulunmuyor.'}
          </div>
        )}

        {/* Sayfalama */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border/50">
            <div className="text-sm text-muted-foreground">
              Toplam {totalAnime} anime, {currentPage}. sayfa / {totalPages} sayfa
            </div>
            
            <div className="flex items-center gap-2">
              {/* İlk sayfa */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || isLoading(LOADING_KEYS.PAGES.ANIME)}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              
              {/* Önceki sayfa */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading(LOADING_KEYS.PAGES.ANIME)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Sayfa numaraları */}
              {getPageNumbers().map((page, index) => (
                <Button
                  key={index}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => typeof page === 'number' ? handlePageChange(page) : undefined}
                  disabled={typeof page !== 'number' || isLoading(LOADING_KEYS.PAGES.ANIME)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}

              {/* Sonraki sayfa */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading(LOADING_KEYS.PAGES.ANIME)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Son sayfa */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || isLoading(LOADING_KEYS.PAGES.ANIME)}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Silme Onay Dialog'u */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anime Serisini Sil</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{selectedAnime?.title}&quot; anime serisini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading(LOADING_KEYS.ACTIONS.DELETE_ANIME)}>
              İptal
            </AlertDialogCancel>
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