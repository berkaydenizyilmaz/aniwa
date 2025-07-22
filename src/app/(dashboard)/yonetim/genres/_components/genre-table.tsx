'use client';

import { useState, useEffect } from 'react';
import { Genre } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toastError, toastSuccess } from '@/components/ui/toast';
import { Edit } from 'lucide-react';
import { GenreForm } from './genre-form';
import { updateGenre, deleteGenre } from '../_actions/genre.actions';
import { setFormFieldErrors } from '@/lib/utils/server-action-error-handler';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateGenreSchema, type UpdateGenreInput } from '@/lib/schemas/genre.schema';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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
  DeleteAlert, 
  CreateDialog, 
  SearchInput, 
  LoadingSkeleton 
} from '../../_components';

export function GenreTable() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

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

    setIsUpdating(editingGenre.id);
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
    } finally {
      setIsUpdating(null);
    }
  };

  // Silme işlemi
  const handleDelete = async (id: string) => {
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
    }
  };

  // Edit dialog'u aç
  const openEditDialog = (genre: Genre) => {
    setEditingGenre(genre);
    editForm.reset({ name: genre.name });
  };

  // Loading skeleton
  if (isLoading) {
    return <LoadingSkeleton itemCount={5} showSearch={true} showActionButton={true} />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Türler ({filteredGenres.length})</CardTitle>
          <CreateDialog
            title="Yeni Tür Ekle"
            description="Yeni bir anime türü ekleyin. Tür adı benzersiz olmalıdır."
          >
            <GenreForm
              onSuccess={() => {
                fetchGenres();
              }}
            />
          </CreateDialog>
        </div>
        
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Tür ara..."
        />
      </CardHeader>
      
      <CardContent>
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
                        loading={isUpdating === genre.id}
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
                                    disabled={isUpdating === editingGenre?.id}
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
                              disabled={isUpdating === editingGenre?.id}
                            >
                              İptal
                            </Button>
                            <Button 
                              type="submit"
                              loading={isUpdating === editingGenre?.id}
                            >
                              Güncelle
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>

                  {/* Delete Alert */}
                  <DeleteAlert
                    title="Türü Sil"
                    description={`"${genre.name}" türünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve tür ile ilişkili tüm anime verileri etkilenebilir.`}
                    onDelete={() => handleDelete(genre.id)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 