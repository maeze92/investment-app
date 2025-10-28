'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAdminStore } from '@/stores/useAdminStore';
import { Navigation } from '@/components/layout/Navigation';
import { Group } from '@/types/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import { GroupForm } from '@/components/admin/GroupForm';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Building2, Plus, Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function GroupsManagementPage() {
  const router = useRouter();
  const { isAdmin } = useAuthStore();
  const { groups, loadGroups, createGroup, updateGroup, deleteGroup, getCompaniesByGroup } =
    useAdminStore();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<Group | null>(null);

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/dashboard');
      return;
    }
    loadGroups();
  }, [isAdmin, router, loadGroups]);

  const handleCreate = async (data: Omit<Group, 'id' | 'created_at'>) => {
    await createGroup(data);
    setShowCreateDialog(false);
  };

  const handleUpdate = async (data: Omit<Group, 'id' | 'created_at'>) => {
    if (editingGroup) {
      await updateGroup(editingGroup.id, data);
      setEditingGroup(null);
    }
  };

  const handleDelete = async () => {
    if (deletingGroup) {
      try {
        await deleteGroup(deletingGroup.id);
        setDeletingGroup(null);
      } catch (error: any) {
        alert(error.message || 'Fehler beim Löschen');
      }
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Gruppenname',
      sortable: true,
    },
    {
      key: 'created_at',
      label: 'Erstellt am',
      sortable: true,
      render: (group: Group) =>
        new Date(group.created_at).toLocaleDateString('de-DE'),
    },
    {
      key: 'settings',
      label: 'Unternehmen',
      render: (group: Group) => {
        const companies = getCompaniesByGroup(group.id);
        return <Badge variant="secondary">{companies.length}</Badge>;
      },
    },
    {
      key: 'currency',
      label: 'Währung',
      render: (group: Group) => group.settings.currency,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Building2 className="h-8 w-8" />
                Mandantenverwaltung
              </h1>
              <p className="text-muted-foreground mt-1">
                Erstellen und verwalten Sie Unternehmensgruppen
              </p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Neue Gruppe
            </Button>
          </div>

      <Card>
        <CardHeader>
          <CardTitle>Alle Gruppen ({groups.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminDataTable
            data={groups}
            columns={columns}
            searchKeys={['name']}
            searchPlaceholder="Gruppe suchen..."
            emptyMessage="Keine Gruppen vorhanden"
            actions={(group) => (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingGroup(group)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeletingGroup(group)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          />
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Neue Gruppe erstellen</DialogTitle>
          </DialogHeader>
          <GroupForm
            onSubmit={handleCreate}
            onCancel={() => setShowCreateDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingGroup} onOpenChange={() => setEditingGroup(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gruppe bearbeiten</DialogTitle>
          </DialogHeader>
          {editingGroup && (
            <GroupForm
              group={editingGroup}
              onSubmit={handleUpdate}
              onCancel={() => setEditingGroup(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      {deletingGroup && (
        <ConfirmDialog
          open={!!deletingGroup}
          onOpenChange={() => setDeletingGroup(null)}
          title="Gruppe löschen?"
          description={`Möchten Sie die Gruppe "${deletingGroup.name}" wirklich löschen? Dies kann nicht rückgängig gemacht werden.`}
          confirmText="Löschen"
          variant="destructive"
          onConfirm={handleDelete}
        />
      )}
        </div>
      </main>
    </div>
  );
}
