'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAdminStore } from '@/stores/useAdminStore';
import { Navigation } from '@/components/layout/Navigation';
import { Company } from '@/types/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminDataTable } from '@/components/admin/AdminDataTable';
import { CompanyForm } from '@/components/admin/CompanyForm';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Building, Plus, Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function CompaniesManagementPage() {
  const router = useRouter();
  const { isAdmin } = useAuthStore();
  const {
    companies,
    groups,
    loadCompanies,
    loadGroups,
    createCompany,
    updateCompany,
    deleteCompany,
    getGroupById,
  } = useAdminStore();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [deletingCompany, setDeletingCompany] = useState<Company | null>(null);

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/dashboard');
      return;
    }
    loadCompanies();
    loadGroups();
  }, [isAdmin, router, loadCompanies, loadGroups]);

  const handleCreate = async (data: Omit<Company, 'id' | 'created_at'>) => {
    await createCompany(data);
    setShowCreateDialog(false);
  };

  const handleUpdate = async (data: Omit<Company, 'id' | 'created_at'>) => {
    if (editingCompany) {
      await updateCompany(editingCompany.id, data);
      setEditingCompany(null);
    }
  };

  const handleDelete = async () => {
    if (deletingCompany) {
      try {
        await deleteCompany(deletingCompany.id);
        setDeletingCompany(null);
      } catch (error: any) {
        alert(error.message || 'Fehler beim Löschen');
      }
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Unternehmensname',
      sortable: true,
    },
    {
      key: 'company_code',
      label: 'Code',
      sortable: true,
      render: (company: Company) => (
        <Badge variant="outline">{company.company_code}</Badge>
      ),
    },
    {
      key: 'group_id',
      label: 'Gruppe',
      render: (company: Company) => {
        const group = getGroupById(company.group_id);
        return group?.name || '-';
      },
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (company: Company) => (
        <Badge variant={company.is_active ? 'default' : 'secondary'}>
          {company.is_active ? 'Aktiv' : 'Inaktiv'}
        </Badge>
      ),
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
                <Building className="h-8 w-8" />
                Unternehmensverwaltung
              </h1>
              <p className="text-muted-foreground mt-1">
                Erstellen und verwalten Sie Subfirmen
              </p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Neues Unternehmen
            </Button>
          </div>

      <Card>
        <CardHeader>
          <CardTitle>Alle Unternehmen ({companies.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminDataTable
            data={companies}
            columns={columns}
            searchKeys={['name', 'company_code']}
            searchPlaceholder="Unternehmen suchen..."
            emptyMessage="Keine Unternehmen vorhanden"
            actions={(company) => (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingCompany(company)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeletingCompany(company)}
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
            <DialogTitle>Neues Unternehmen erstellen</DialogTitle>
          </DialogHeader>
          <CompanyForm
            groups={groups}
            onSubmit={handleCreate}
            onCancel={() => setShowCreateDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingCompany} onOpenChange={() => setEditingCompany(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Unternehmen bearbeiten</DialogTitle>
          </DialogHeader>
          {editingCompany && (
            <CompanyForm
              company={editingCompany}
              groups={groups}
              onSubmit={handleUpdate}
              onCancel={() => setEditingCompany(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {deletingCompany && (
        <ConfirmDialog
          open={!!deletingCompany}
          onOpenChange={() => setDeletingCompany(null)}
          title="Unternehmen löschen?"
          description={`Möchten Sie "${deletingCompany.name}" wirklich löschen?`}
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
