'use client';

import { useState, useEffect, useCallback } from 'react';
import { Genre } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toastError, toastSuccess } from '@/components/ui/toast';
import { Edit, Search } from 'lucide-react';
import { GenreForm } from './genre-form';
import { getGenres, updateGenre, deleteGenre } from '../_actions/genre.actions';
import { setFormFieldErrors } from '@/lib/utils/server-action-error-handler';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateGenreSchema, type UpdateGenreInput } from '@/lib/schemas/genre.schema';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DialogFooter } from '@/components/ui/dialog';
import { 
  DeleteAlert, 
  CreateDialog, 
  SearchInput, 
  LoadingSkeleton,
  EditDialog
} from '../../_components';

export function GenreTable() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Edit form
  const editForm = useForm<UpdateGenreInput>({
    resolver: zodResolver(updateGenreSchema),
  });

  // Veri çekme
  const fetchGenres = useCallback(async () => {
    try {
      const result = await getGenres();
      
      if (result.success && result.data) {
        setGenres((result.data as { genres: Genre[] }).genres);
      } else if (!result.success) {
        toastError('Hata', result.error || 'Türler yüklenemedi');
      }
    } catch (error) {
      console.error('Fetch genres error:', error);
      toastError('Hata', 'Türler yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  // Filtreleme
  const filteredGenres = genres.filter(genre =>
    genre.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Edit işlemi
  const handleEdit = useCallback(async (genreId: string, data: UpdateGenreInput) => {
    if (isUpdating) return;
    
    setIsUpdating(genreId);
    try {
      const result = await updateGenre(genreId, data);

      if (!result.success) {
        if (result.fieldErrors) {
          setFormFieldErrors<UpdateGenreInput>(result.fieldErrors, editForm.setError);
        } else {
          toastError('Hata', result.error);
        }
      } else {
        toastSuccess('Başarılı', 'Tür başarıyla güncellendi!');
        editForm.reset();
        fetchGenres(); // Verileri yenile
      }
    } catch (error) {
      console.error('Edit genre error:', error);
      toastError('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsUpdating(null);
    }
  }, [isUpdating, editForm, fetchGenres]);

  // Silme işlemi
  const handleDelete = useCallback(async (id: string) => {
    try {
      const result = await deleteGenre(id);

      if (!result.success) {
        toastError('Hata', result.error);
      } else {
        toastSuccess('Başarılı', 'Tür başarıyla silindi!');
        setGenres(prev => prev.filter(genre => genre.id !== id));
      }
    } catch (error) {
      console.error('Delete genre error:', error);
      toastError('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  }, []);

  // Edit dialog'u aç
  const openEditDialog = useCallback((genre: Genre) => {
    editForm.reset({ name: genre.name });
  }, [editForm]);

  // Loading skeleton
  if (isLoading) {
    return <LoadingSkeleton itemCount={5} showSearch={true} showActionButton={true} />;
  }

  return (
    <Card className="bg-card/80 backdrop-blur-md border border-border/20 shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-foreground">Türler ({filteredGenres.length})</CardTitle>
          <CreateDialog
            title="Yeni Tür Ekle"
            description="Yeni bir anime türü ekleyin. Tür adı benzersiz olmalıdır."
          >
            {({ onClose }) => (
              <GenreForm
                onSuccess={() => {
                  fetchGenres();
                  onClose();
                }}
                onClose={onClose}
              />
            )}
          </CreateDialog>
        </div>
        
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Tür ara..."
        />
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {filteredGenres.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">
                {searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz tür eklenmemiş'}
              </p>
              <p className="text-sm mt-1">
                {searchTerm ? 'Farklı bir arama terimi deneyin' : 'İlk türü eklemek için yukarıdaki butonu kullanın'}
              </p>
            </div>
          ) : (
            filteredGenres.map((genre) => (
              <div
                key={genre.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border/20 rounded-xl hover:bg-muted/30 transition-all duration-200 gap-4 bg-card/60 backdrop-blur-sm hover:shadow-md"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-lg truncate text-foreground">
                    {genre.name}
                  </div>
                  <div className="text-sm text-muted-foreground truncate mt-1">
                    Slug: {genre.slug}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 shrink-0">
                  {/* Edit Dialog */}
                  <EditDialog
                    title="Tür Düzenle"
                    description={`"${genre.name}" türünün adını güncelleyin.`}
                    onEdit={(data) => handleEdit(genre.id, data as UpdateGenreInput)}
                    isLoading={isUpdating === genre.id}
                    trigger={
                      <Button
                        variant="outline"
                        size="sm"
                        loading={isUpdating === genre.id}
                        onClick={() => openEditDialog(genre)}
                        className="hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    }
                  >
                    {({ onClose, onSubmit, isUpdating: isDialogUpdating }) => (
                      <Form {...editForm}>
                        <form onSubmit={editForm.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={editForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Tür adı"
                                    disabled={isDialogUpdating}
                                    className="bg-card/80 backdrop-blur-sm"
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
                              onClick={onClose}
                              disabled={isDialogUpdating}
                              className="hover:bg-muted/80 transition-all duration-200"
                            >
                              İptal
                            </Button>
                            <Button 
                              type="submit"
                              loading={isDialogUpdating}
                              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
                            >
                              Güncelle
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    )}
                  </EditDialog>

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