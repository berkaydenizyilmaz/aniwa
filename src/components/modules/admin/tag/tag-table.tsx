'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Tag, TagCategory } from '@prisma/client';
import { getTagsAction, deleteTagAction } from '@/lib/actions/admin/tag.action';
import { toast } from 'sonner';
import { GetTagsResponse } from '@/lib/types/api/tag.api';
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

import { MASTER_DATA_DOMAIN } from '@/lib/constants';
import { type TagFilters } from '@/lib/schemas/tag.schema';
import { queryKeys } from '@/lib/constants/query-keys';

interface TagTableProps {
  onEdit?: (tag: Tag) => void;
  searchTerm?: string;
  selectedCategory?: string;
  selectedAdult?: boolean | null;
  selectedSpoiler?: boolean | null;
}

export function TagTable({ onEdit, searchTerm = '', selectedCategory = '', selectedAdult = null, selectedSpoiler = null }: TagTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(50);
  const queryClient = useQueryClient();

  // Tag'leri getir (React Query ile)
  const { data: tagsData, isLoading } = useQuery({
    queryKey: queryKeys.masterData.tag.list({ 
      search: searchTerm, 
      category: selectedCategory, 
      adult: selectedAdult, 
      spoiler: selectedSpoiler, 
      page: currentPage, 
      limit 
    }),
    queryFn: async () => {
      const filters: TagFilters = {
        page: currentPage,
        limit: limit,
      };
      if (searchTerm) filters.search = searchTerm;
      if (selectedCategory) filters.category = selectedCategory as TagCategory;
      if (selectedAdult !== null) filters.isAdult = selectedAdult;
      if (selectedSpoiler !== null) filters.isSpoiler = selectedSpoiler;
      
      const result = await getTagsAction(filters);
      if (!result.success) {
        throw new Error(result.error || 'Etiketler yüklenirken bir hata oluştu');
      }
      return result.data as GetTagsResponse;
    },
  });

  // Filtreler değiştiğinde sayfa 1'e dön
  if ((searchTerm || selectedCategory !== 'all' || selectedAdult !== null || selectedSpoiler !== null) && currentPage !== 1) {
    setCurrentPage(1);
  }

  const handleEdit = (tag: Tag) => {
    onEdit?.(tag);
  };

  const handleDelete = (tag: Tag) => {
    setSelectedTag(tag);
    setDeleteDialogOpen(true);
  };

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTagAction(id),
    onSuccess: () => {
      toast.success('Etiket başarıyla silindi!');
      setDeleteDialogOpen(false);
      setSelectedTag(null);
      // Query'yi invalidate et
      queryClient.invalidateQueries({ queryKey: queryKeys.masterData.tag.all });
    },
    onError: (error) => {
      console.error('Delete tag error:', error);
      toast.error(error.message || 'Silme işlemi başarısız oldu');
    },
  });

  const handleDeleteConfirm = async () => {
    if (!selectedTag) return;
    deleteMutation.mutate(selectedTag.id);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const totalPages = tagsData?.totalPages || 1;

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
              <TableHead className="w-1/4">İsim</TableHead>
              <TableHead className="w-1/4">Slug</TableHead>
              <TableHead className="w-1/6">Kategori</TableHead>
              <TableHead className="w-1/6">Özellikler</TableHead>
              <TableHead className="w-1/6">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tagsData?.data.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell>{tag.name}</TableCell>
                <TableCell className="text-muted-foreground">{tag.slug}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${tag.category ? MASTER_DATA_DOMAIN.UI.TAG_CATEGORY_COLORS[tag.category] : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'}`}>
                    {tag.category ? MASTER_DATA_DOMAIN.UI.TAG_CATEGORY_LABELS[tag.category] || tag.category : '-'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {tag.isAdult && (
                      <span className={`px-2 py-1 rounded-full text-xs ${MASTER_DATA_DOMAIN.UI.TAG_PROPERTY_COLORS.ADULT}`}>
                        Yetişkin
                      </span>
                    )}
                    {tag.isSpoiler && (
                      <span className={`px-2 py-1 rounded-full text-xs ${MASTER_DATA_DOMAIN.UI.TAG_PROPERTY_COLORS.SPOILER}`}>
                        Spoiler
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(tag)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost-destructive"
                      size="sm"
                      onClick={() => handleDelete(tag)}
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

        {(!tagsData?.data || tagsData.data.length === 0) && (
          <div className="p-8 text-center text-muted-foreground">
            {searchTerm ? 'Arama kriterlerine uygun etiket bulunamadı.' : 'Henüz etiket bulunmuyor.'}
          </div>
        )}

        {/* Sayfalama */}
        {tagsData && tagsData.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border/50">
            <div className="text-sm text-muted-foreground">
              Toplam {tagsData.total} etiket, {currentPage}. sayfa / {tagsData.totalPages} sayfa
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
                disabled={currentPage === tagsData.totalPages || isLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Son sayfa */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(tagsData.totalPages)}
                disabled={currentPage === tagsData.totalPages || isLoading}
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
            <AlertDialogTitle>Etiketi Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{selectedTag?.name}</strong> etiketini silmek istediğinizden emin misiniz?
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
