'use client';

import { useState, useEffect } from 'react';
import { Genre } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toastError, toastSuccess } from '@/components/ui/toast';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { GenreForm } from './genre-form';
import { updateGenre, deleteGenre } from '../_actions/genre.actions';
import { setFormFieldErrors } from '@/lib/utils/server-action-error-handler';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateGenreSchema, type UpdateGenreInput } from '@/lib/schemas/genre.schema';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function GenreTable() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Edit form
  const editForm = useForm<UpdateGenreInput>({
    resolver: zodResolver(updateGenreSchema),
  });

  // Veri çekme
  const fetchGenres = async () => {
    try {
      const response = await fetch('/api/admin/genres');
      const result = await response.json();
      
      if (result.success) {
        setGenres(result.data.genres);
      } else {
        toastError('Hata', 'Türler yüklenemedi');
      }
    } catch {
      toastError('Hata', 'Türler yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  // Filtreleme
  const filteredGenres = genres.filter(genre =>
    genre.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Edit işlemi
  const handleEdit = async (data: UpdateGenreInput) => {
    if (!editingGenre) return;

    try {
      const result = await updateGenre(editingGenre.id, data);

      if (!result.success) {
        if (result.fieldErrors) {
          setFormFieldErrors<UpdateGenreInput>(result.fieldErrors, editForm.setError);
        } else {
          toastError('Hata', result.error);
        }
      } else {
        toastSuccess('Başarılı', 'Tür başarıyla güncellendi!');
        setEditingGenre(null);
        editForm.reset();
        fetchGenres(); // Verileri yenile
      }
    } catch {
      toastError('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  // Silme işlemi
  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const result = await deleteGenre(id);

      if (!result.success) {
        toastError('Hata', result.error);
      } else {
        toastSuccess('Başarılı', 'Tür başarıyla silindi!');
        fetchGenres(); // Verileri yenile
      }
    } catch {
      toastError('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsDeleting(null);
    }
  };

  // Edit dialog'u aç
  const openEditDialog = (genre: Genre) => {
    setEditingGenre(genre);
    editForm.reset({ name: genre.name });
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-9 w-24" />
          </div>
          <Skeleton className="h-10 w-full" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Türler ({filteredGenres.length})</CardTitle>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Tür
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Tür Ekle</DialogTitle>
                <DialogDescription>
                  Yeni bir anime türü ekleyin. Tür adı benzersiz olmalıdır.
                </DialogDescription>
              </DialogHeader>
              <GenreForm
                onSuccess={() => {
                  setShowCreateDialog(false);
                  fetchGenres();
                }}
                onCancel={() => setShowCreateDialog(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Arama */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tür ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Tablo */}
        <div className="space-y-2">
          {filteredGenres.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'Arama sonucu bulunamadı.' : 'Henüz tür eklenmemiş.'}
            </div>
          ) : (
            filteredGenres.map((genre) => (
              <div
                key={genre.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-medium">{genre.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Slug: {genre.slug}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Edit Dialog */}
                  <Dialog open={editingGenre?.id === genre.id} onOpenChange={(open) => !open && setEditingGenre(null)}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(genre)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Tür Düzenle</DialogTitle>
                        <DialogDescription>
                          &ldquo;{genre.name}&rdquo; türünün adını güncelleyin.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...editForm}>
                        <form onSubmit={editForm.handleSubmit(handleEdit)} className="space-y-4">
                          <FormField
                            control={editForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Tür adı"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <DialogFooter>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setEditingGenre(null)}
                            >
                              İptal
                            </Button>
                            <Button type="submit">
                              Güncelle
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>

                  {/* Delete Alert Dialog */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isDeleting === genre.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Türü Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                          &ldquo;{genre.name}&rdquo; türünü silmek istediğinizden emin misiniz? 
                          Bu işlem geri alınamaz ve tür ile ilişkili tüm anime verileri etkilenebilir.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(genre.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isDeleting === genre.id ? 'Siliniyor...' : 'Sil'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 