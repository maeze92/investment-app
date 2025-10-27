'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAdminStore } from '@/stores/useAdminStore';
import { User, UserRole } from '@/types/entities';
import { Role, ROLE_NAMES } from '@/types/enums';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Shield, Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function RolesManagementPage() {
  const router = useRouter();
  const { isAdmin } = useAuthStore();
  const {
    users,
    groups,
    companies,
    userRoles,
    loadUsers,
    loadGroups,
    loadCompanies,
    loadUserRoles,
    assignRole,
    revokeRole,
    getUserById,
    getGroupById,
    getCompanyById,
  } = useAdminStore();

  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [revokingRole, setRevokingRole] = useState<UserRole | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<Role | ''>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedCompany, setSelectedCompany] = useState<string>('');

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/dashboard');
      return;
    }
    loadUsers();
    loadGroups();
    loadCompanies();
    loadUserRoles();
  }, [isAdmin, router, loadUsers, loadGroups, loadCompanies, loadUserRoles]);

  const handleAssign = async () => {
    if (!selectedUser || !selectedRole || !selectedGroup) {
      alert('Bitte alle Pflichtfelder ausfüllen');
      return;
    }

    try {
      await assignRole(
        selectedUser,
        selectedRole as Role,
        selectedGroup,
        selectedCompany || undefined
      );
      setShowAssignDialog(false);
      // Reset form
      setSelectedUser('');
      setSelectedRole('');
      setSelectedGroup('');
      setSelectedCompany('');
    } catch (error: any) {
      alert(error.message || 'Fehler beim Zuweisen der Rolle');
    }
  };

  const handleRevoke = async () => {
    if (revokingRole) {
      try {
        await revokeRole(revokingRole.id);
        setRevokingRole(null);
      } catch (error: any) {
        alert(error.message || 'Fehler beim Entziehen der Rolle');
      }
    }
  };

  const roles: Role[] = [
    'system_admin',
    'vr_approval',
    'vr_viewer',
    'cfo',
    'geschaeftsfuehrer',
    'cashflow_manager',
    'buchhaltung',
  ];

  // Determine if selected role requires company selection
  const requiresCompany = ['geschaeftsfuehrer', 'cashflow_manager', 'buchhaltung'].includes(
    selectedRole as string
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Rollenverwaltung
          </h1>
          <p className="text-muted-foreground mt-1">
            Rollen an Benutzer zuweisen und verwalten
          </p>
        </div>
        <Button onClick={() => setShowAssignDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Rolle zuweisen
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alle Rollenzuweisungen ({userRoles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {userRoles.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Keine Rollenzuweisungen vorhanden
              </p>
            ) : (
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Benutzer</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Rolle</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Gruppe</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Unternehmen</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {userRoles.map((ur) => {
                    const user = getUserById(ur.user_id);
                    const group = getGroupById(ur.group_id);
                    const company = ur.company_id ? getCompanyById(ur.company_id) : null;

                    return (
                      <tr key={ur.id} className="border-t">
                        <td className="px-4 py-3 text-sm">{user?.name || 'Unbekannt'}</td>
                        <td className="px-4 py-3 text-sm">
                          <Badge variant="secondary">{ROLE_NAMES[ur.role]}</Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">{group?.name || '-'}</td>
                        <td className="px-4 py-3 text-sm">{company?.name || '-'}</td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setRevokingRole(ur)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Assign Role Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Rolle zuweisen</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="user">Benutzer *</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Benutzer auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="role">Rolle *</Label>
              <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as Role)}>
                <SelectTrigger>
                  <SelectValue placeholder="Rolle auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {ROLE_NAMES[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="group">Gruppe *</Label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Gruppe auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {requiresCompany && (
              <div>
                <Label htmlFor="company">Unternehmen *</Label>
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger>
                    <SelectValue placeholder="Unternehmen auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies
                      .filter((c) => c.group_id === selectedGroup)
                      .map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleAssign}>Zuweisen</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Revoke Confirmation */}
      {revokingRole && (
        <ConfirmDialog
          open={!!revokingRole}
          onOpenChange={() => setRevokingRole(null)}
          title="Rolle entziehen?"
          description={`Möchten Sie die Rolle "${ROLE_NAMES[revokingRole.role]}" wirklich entziehen?`}
          confirmText="Entziehen"
          variant="destructive"
          onConfirm={handleRevoke}
        />
      )}
    </div>
  );
}
