'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { StreamingPlatform } from '@prisma/client';
import { getStreamingPlatformsAction, deleteStreamingPlatformAction } from '@/lib/actions/streaming-platform.action';
import { toast } from 'sonner';
import { GetAllStreamingPlatformsResponse } from '@/lib/types/api/streaming.api';
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
import { type StreamingPlatformFilters } from '@/lib/schemas/streaming.schema';

interface StreamingPlatformTableProps {
  onEdit?: (platform: StreamingPlatform) => void;
  searchTerm?: string;
}

export function StreamingPlatformTable({ onEdit, searchTerm = '' }: StreamingPlatformTableProps) {
  const [platforms, setPlatforms] = useState<StreamingPlatform[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<StreamingPlatform | null>(null);
  const { setLoading: setLoadingStore, isLoading } = useLoadingStore();

  // Platform'ları getir (server-side filtreleme)
  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        setLoadingStore(LOADING_KEYS.PAGES.STREAMING_PLATFORMS, true);
        const filters: StreamingPlatformFilters = {
          page: 1,
          limit: 100,
        };
        if (searchTerm) filters.search = searchTerm;
        const result = await getStreamingPlatformsAction(filters);
        if (!result.success) {
          toast.error(result.error || 'Platformlar yüklenirken bir hata oluştu');
          return;
        }
        const data = result.data as GetAllStreamingPlatformsResponse;
        setPlatforms(data.platforms);
      } catch (error) {
        console.error('Fetch platforms error:', error);
        toast.error('Platformlar yüklenirken bir hata oluştu');
      } finally {
        setLoadingStore(LOADING_KEYS.PAGES.STREAMING_PLATFORMS, false);
      }
    };
    fetchPlatforms();
  }, [setLoadingStore, searchTerm]);

  // Client-side filtreleme kaldırıldı, direkt platforms kullanılıyor
  const handleEdit = (platform: StreamingPlatform) => {
    onEdit?.(platform);
  };

  const handleDelete = (platform: StreamingPlatform) => {
    setSelectedPlatform(platform);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPlatform || isLoading(LOADING_KEYS.ACTIONS.DELETE_STREAMING_PLATFORM)) return;

    setLoadingStore(LOADING_KEYS.ACTIONS.DELETE_STREAMING_PLATFORM, true);

    try {
      const result = await deleteStreamingPlatformAction(selectedPlatform.id);

      if (!result.success) {
        toast.error(result.error || 'Silme işlemi başarısız oldu');
        return;
      }

      toast.success('Platform başarıyla silindi!');
      setDeleteDialogOpen(false);

      // Tabloyu yenile
      const fetchResult = await getStreamingPlatformsAction();
      if (fetchResult.success) {
        const data = fetchResult.data as GetAllStreamingPlatformsResponse;
        setPlatforms(data.platforms);
      }

    } catch (error) {
      console.error('Delete platform error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoadingStore(LOADING_KEYS.ACTIONS.DELETE_STREAMING_PLATFORM, false);
    }
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
            {platforms.map((platform) => (
              <TableRow key={platform.id}>
                <TableCell>{platform.name}</TableCell>
                <TableCell className="text-muted-foreground">{platform.baseUrl}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(platform)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost-destructive"
                      size="sm"
                      onClick={() => handleDelete(platform)}
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

        {platforms.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            {searchTerm ? 'Arama kriterlerine uygun platform bulunamadı.' : 'Henüz platform bulunmuyor.'}
          </div>
        )}
      </div>

      {/* Delete Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Platformu Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{selectedPlatform?.name}</strong> platformunu silmek istediğinizden emin misiniz?
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