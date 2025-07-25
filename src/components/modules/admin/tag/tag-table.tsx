'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Tag } from '@prisma/client';
import { getTagsAction, deleteTagAction } from '@/lib/actions/tag.action';
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

interface TagTableProps {
  onEdit?: (tag: Tag) => void;
  searchTerm?: string;
}

export function TagTable({ onEdit, searchTerm = '' }: TagTableProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Tag'leri getir
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const result = await getTagsAction();

        if (!result.success) {
          toast.error(result.error || 'Etiketler yüklenirken bir hata oluştu');
          return;
        }

        const data = result.data as GetTagsResponse;
        setTags(data.tags);
      } catch (error) {
        console.error('Fetch tags error:', error);
        toast.error('Etiketler yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  // Arama filtreleme
  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tag.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (tag: Tag) => {
    onEdit?.(tag);
  };

  const handleDelete = (tag: Tag) => {
    setSelectedTag(tag);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTag || isDeleting) return;

    setIsDeleting(true);

    try {
      const result = await deleteTagAction(selectedTag.id);

      if (!result.success) {
        toast.error(result.error || 'Silme işlemi başarısız oldu');
        return;
      }

      toast.success('Etiket başarıyla silindi!');
      setDeleteDialogOpen(false);

      // Tabloyu yenile
      const fetchResult = await getTagsAction();
      if (fetchResult.success) {
        const data = fetchResult.data as GetTagsResponse;
        setTags(data.tags);
      }

    } catch (error) {
      console.error('Delete tag error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
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
              <TableHead className="w-1/5">İsim</TableHead>
              <TableHead className="w-1/5">Slug</TableHead>
              <TableHead className="w-1/5">Kategori</TableHead>
              <TableHead className="w-1/5">Oluşturulma Tarihi</TableHead>
              <TableHead className="w-1/5">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell>{tag.name}</TableCell>
                <TableCell className="text-muted-foreground">{tag.slug}</TableCell>
                <TableCell className="text-muted-foreground">
                  {tag.category || '-'}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(tag.createdAt).toLocaleDateString('tr-TR')}
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

        {filteredTags.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            {searchTerm ? 'Arama kriterlerine uygun etiket bulunamadı.' : 'Henüz etiket bulunmuyor.'}
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
            <AlertDialogCancel disabled={isDeleting}>İptal</AlertDialogCancel>
            <Button
              onClick={handleDeleteConfirm}
              loading={isDeleting}
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