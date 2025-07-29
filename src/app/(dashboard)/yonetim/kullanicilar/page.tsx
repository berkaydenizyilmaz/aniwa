'use client';

import { useState } from 'react';
import { UserFilters } from "@/components/modules/admin/user/user-filters";
import { UserTable } from "@/components/modules/admin/user/user-table";
import { UserFormDialog } from "@/components/modules/admin/user/user-form-dialog";
import { User } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';

export default function UsersPage() {
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedBanned, setSelectedBanned] = useState<boolean | null>(null);
  const queryClient = useQueryClient();

  const handleAddNew = () => {
    setSelectedUser(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormDialogOpen(true);
  };

  const handleSuccess = () => {
    // Query'yi invalidate et
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  const handleSearch = (search: string) => {
    setSearchTerm(search);
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
  };

  const handleBannedChange = (isBanned: boolean | null) => {
    setSelectedBanned(isBanned);
  };

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div>
        <h1 className="text-3xl font-bold">Kullanıcılar</h1>
        <p className="text-muted-foreground">
          Kullanıcıları yönetin
        </p>
      </div>

      {/* Filtreler */}
      <UserFilters 
        onSearch={handleSearch} 
        onRoleChange={handleRoleChange}
        onBannedChange={handleBannedChange}
        onAddNew={handleAddNew} 
      />

      {/* Tablo */}
      <UserTable 
        onEdit={handleEdit}
        searchTerm={searchTerm}
        selectedRole={selectedRole}
        selectedBanned={selectedBanned}
      />

      {/* Form Dialog */}
      <UserFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        user={selectedUser}
        onSuccess={handleSuccess}
      />
    </div>
  );
} 