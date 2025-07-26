'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Ban, UserCheck } from 'lucide-react';
import { User } from '@prisma/client';
import { getUsersAction, deleteUserAction, banUserAction, unbanUserAction } from '@/lib/actions/user.action';
import { toast } from 'sonner';
import { GetUsersResponse } from '@/lib/types/api/user.api';
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
import { type UserFilters } from '@/lib/schemas/user.schema';

interface UserTableProps {
  onEdit?: (user: User) => void;
  searchTerm?: string;
}

export function UserTable({ onEdit, searchTerm = '' }: UserTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { setLoading: setLoadingStore, isLoading } = useLoadingStore();

  // Kullanıcıları getir (server-side filtreleme)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingStore(LOADING_KEYS.PAGES.USERS, true);
        const filters: UserFilters = {
          page: 1,
          limit: 100,
        };
        if (searchTerm) filters.search = searchTerm;
        const result = await getUsersAction(filters);
        if (!result.success) {
          toast.error(result.error || 'Kullanıcılar yüklenirken bir hata oluştu');
          return;
        }
        const data = result.data as GetUsersResponse;
        setUsers(data.users);
      } catch (error) {
        console.error('Fetch users error:', error);
        toast.error('Kullanıcılar yüklenirken bir hata oluştu');
      } finally {
        setLoadingStore(LOADING_KEYS.PAGES.USERS, false);
      }
    };
    fetchUsers();
  }, [setLoadingStore, searchTerm]);

  // Client-side filtreleme kaldırıldı, direkt users kullanılıyor

  const handleEdit = (user: User) => {
    onEdit?.(user);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleBan = async (user: User) => {
    if (isLoading(LOADING_KEYS.ACTIONS.BAN_USER)) return;

    setLoadingStore(LOADING_KEYS.ACTIONS.BAN_USER, true);

    try {
      const result = await banUserAction(user.id);

      if (!result.success) {
        toast.error(result.error || 'Ban işlemi başarısız oldu');
        return;
      }

      toast.success('Kullanıcı başarıyla banlandı!');
      
      // Tabloyu yenile
      const fetchResult = await getUsersAction();
      if (fetchResult.success) {
        const data = fetchResult.data as GetUsersResponse;
        setUsers(data.users);
      }

    } catch (error) {
      console.error('Ban user error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoadingStore(LOADING_KEYS.ACTIONS.BAN_USER, false);
    }
  };

  const handleUnban = async (user: User) => {
    if (isLoading(LOADING_KEYS.ACTIONS.UNBAN_USER)) return;

    setLoadingStore(LOADING_KEYS.ACTIONS.UNBAN_USER, true);

    try {
      const result = await unbanUserAction(user.id);

      if (!result.success) {
        toast.error(result.error || 'Ban kaldırma işlemi başarısız oldu');
        return;
      }

      toast.success('Kullanıcının banı başarıyla kaldırıldı!');
      
      // Tabloyu yenile
      const fetchResult = await getUsersAction();
      if (fetchResult.success) {
        const data = fetchResult.data as GetUsersResponse;
        setUsers(data.users);
      }

    } catch (error) {
      console.error('Unban user error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoadingStore(LOADING_KEYS.ACTIONS.UNBAN_USER, false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser || isLoading(LOADING_KEYS.ACTIONS.DELETE_USER)) return;

    setLoadingStore(LOADING_KEYS.ACTIONS.DELETE_USER, true);

    try {
      const result = await deleteUserAction(selectedUser.id);

      if (!result.success) {
        toast.error(result.error || 'Silme işlemi başarısız oldu');
        return;
      }

      toast.success('Kullanıcı başarıyla silindi!');
      setDeleteDialogOpen(false);

      // Tabloyu yenile
      const fetchResult = await getUsersAction();
      if (fetchResult.success) {
        const data = fetchResult.data as GetUsersResponse;
        setUsers(data.users);
      }

    } catch (error) {
      console.error('Delete user error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoadingStore(LOADING_KEYS.ACTIONS.DELETE_USER, false);
    }
  };

  if (isLoading(LOADING_KEYS.PAGES.USERS)) {
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
              <TableHead className="w-1/4">Kullanıcı Adı</TableHead>
              <TableHead className="w-1/4">E-posta</TableHead>
              <TableHead className="w-1/4">Roller</TableHead>
              <TableHead className="w-1/4">Durum</TableHead>
              <TableHead className="w-1/4">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell className="text-muted-foreground">
                  {user.roles.join(', ')}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.isBanned 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.isBanned ? 'Banlı' : 'Aktif'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(user)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {user.isBanned ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnban(user)}
                        className="h-8 w-8 p-0"
                        disabled={isLoading(LOADING_KEYS.ACTIONS.UNBAN_USER)}
                      >
                        <UserCheck className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBan(user)}
                        className="h-8 w-8 p-0"
                        disabled={isLoading(LOADING_KEYS.ACTIONS.BAN_USER)}
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost-destructive"
                      size="sm"
                      onClick={() => handleDelete(user)}
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

        {users.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            {searchTerm ? 'Arama kriterlerine uygun kullanıcı bulunamadı.' : 'Henüz kullanıcı bulunmuyor.'}
          </div>
        )}
      </div>

      {/* Silme Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kullanıcıyı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isLoading(LOADING_KEYS.ACTIONS.DELETE_USER)}
            >
              Sil
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 