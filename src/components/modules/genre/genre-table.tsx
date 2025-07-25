'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Genre } from '@prisma/client';
import { getGenresAction } from '@/lib/actions/genre.action';
import { toast } from 'sonner';
import { GetGenresResponse } from '@/lib/types/api/genre.api';
import { Skeleton } from '@/components/ui/skeleton';

interface GenreTableProps {
  onEdit?: (genre: Genre) => void;
  onDelete?: (genre: Genre) => void;
}

export function GenreTable({ onEdit, onDelete }: GenreTableProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  // Genre'leri getir
  useEffect(() => {
      const fetchGenres = async () => {
    try {
      const result = await getGenresAction();
      
      if (!result.success) {
        toast.error(result.error || 'Türler yüklenirken bir hata oluştu');
        return;
      }

      const data = result.data as GetGenresResponse;
      setGenres(data.genres);
    } catch (error) {
      console.error('Fetch genres error:', error);
      toast.error('Türler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  fetchGenres();
}, []);

  const handleEdit = (genre: Genre) => {
    // TODO: Edit dialog açılacak
    toast.info('Tür düzenleme özelliği yakında eklenecek');
    onEdit?.(genre);
  };

  const handleDelete = (genre: Genre) => {
    // TODO: Delete dialog açılacak
    toast.info('Tür silme özelliği yakında eklenecek');
    onDelete?.(genre);
  };

  if (loading) {
    return (
      <div className="glass-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-semibold">İsim</th>
                <th className="text-left p-4 font-semibold">Slug</th>
                <th className="text-left p-4 font-semibold">Oluşturulma Tarihi</th>
                <th className="text-left p-4 font-semibold">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="border-b border-border/50">
                  <td className="p-4">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="p-4">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="p-4">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 font-semibold">İsim</th>
              <th className="text-left p-4 font-semibold">Slug</th>
              <th className="text-left p-4 font-semibold">Oluşturulma Tarihi</th>
              <th className="text-left p-4 font-semibold">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {genres.map((genre) => (
              <tr key={genre.id} className="border-b border-border/50">
                <td className="p-4">{genre.name}</td>
                <td className="p-4 text-muted-foreground">{genre.slug}</td>
                <td className="p-4 text-muted-foreground">
                  {new Date(genre.createdAt).toLocaleDateString('tr-TR')}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(genre)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(genre)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {genres.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          Henüz tür bulunmuyor.
        </div>
      )}
    </div>
  );
} 