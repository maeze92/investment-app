'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAdminStore } from '@/stores/useAdminStore';
import { User } from '@/types/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import { UserForm } from '@/components/admin/UserForm';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Users, Plus, Pencil, Trash2, Key } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ROLE_NAMES } from '@/types/enums';

export default function UsersManagementPage() {
  const router = useRouter();
  const { isAdmin } = useAuthStore();
  const {
    users,
    userRoles,
    loadUsers,
    loadUserRoles,
    createUser,
    updateUser,
    deleteUser,
    resetUserPassword,
    getRolesByUser,
  } = useAdminStore();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [resettingPassword, setResettingPassword] = useState<User | null>(null);

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/dashboard');
      return;
    }
    loadUsers();
    loadUserRoles();
  }, [isAdmin, router, loadUsers, loadUserRoles]);

  const handleCreate = async (data: Omit<User, 'id' | 'created_at'>) => {
    await createUser(data);
    setShowCreateDialog(false);
  };

  const handleUpdate = async (data: Omit<User, 'id' | 'created_at'>) => {
    if (editingUser) {
      await updateUser(editingUser.id, data);
      setEditingUser(null);
    }
  };

  const handleDelete = async () => {
    if (deletingUser) {
      try {
        await deleteUser(deletingUser.id);
        setDeletingUser(null);
      } catch (error: any) {
        alert(error.message || 'Fehler beim Löschen');
      }
    }
  };

  const handleResetPassword = async () => {
    if (resettingPassword) {
      await resetUserPassword(resettingPassword.id, 'demo');
      setResettingPassword(null);
      alert('Passwort wurde auf "demo" zurückgesetzt');
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'email',
      label: 'E-Mail',
      sortable: true,
    },
    {
      key: 'roles',
      label: 'Rollen',
      render: (user: User) => {
        const roles = getRolesByUser(user.id);
        return (
          <div className="flex gap-1 flex-wrap">
            {roles.length > 0 ? (
              roles.map((ur) => (
                <Badge key={ur.id} variant="secondary" className="text-xs">
                  {ROLE_NAMES[ur.role]}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">Keine Rollen</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'last_login',
      label: 'Letzter Login',
      render: (user: User) =>
        user.last_login
          ? new Date(user.last_login).toLocaleDateString('de-DE')
          : 'Noch nie',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Benutzerverwaltung
          </h1>
          <p className="text-muted-foreground mt-1">
            Erstellen und verwalten Sie Benutzer
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Neuer Benutzer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alle Benutzer ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminDataTable
            data={users}
            columns={columns}
            searchKeys={['name', 'email']}
            searchPlaceholder="Benutzer suchen..."
            emptyMessage="Keine Benutzer vorhanden"
            actions={(user) => (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setResettingPassword(user)}
                  title="Passwort zurücksetzen"
                >
                  <Key className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingUser(user)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeletingUser(user)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          />
        </CardContent>
      </Card>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Neuen Benutzer erstellen</DialogTitle>
          </DialogHeader>
          <UserForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreateDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Benutzer bearbeiten</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <UserForm
              user={editingUser}
              onSubmit={handleUpdate}
              onCancel={() => setEditingUser(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {deletingUser && (
        <ConfirmDialog
          open={!!deletingUser}
          onOpenChange={() => setDeletingUser(null)}
          title="Benutzer löschen?"
          description={`Möchten Sie "${deletingUser.name}" wirklich löschen?`}
          confirmText="Löschen"
          variant="destructive"
          onConfirm={handleDelete}
        />
      )}

      {resettingPassword && (
        <ConfirmDialog
          open={!!resettingPassword}
          onOpenChange={() => setResettingPassword(null)}
          title="Passwort zurücksetzen?"
          description={`Das Passwort von "${resettingPassword.name}" wird auf "demo" zurückgesetzt.`}
          confirmText="Zurücksetzen"
          onConfirm={handleResetPassword}
        />
      )}
    </div>
  );
}
