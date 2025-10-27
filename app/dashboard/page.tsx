'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/layout/Navigation';

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const selectedRole = useAuthStore((state) => state.selectedRole);
  const companies = useAppStore((state) => state.companies);
  const investments = useAppStore((state) => state.investments);
  const cashflows = useAppStore((state) => state.cashflows);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      router.push('/login');
      return;
    }

    // Redirect to role-specific dashboard
    if (selectedRole) {
      switch (selectedRole.role) {
        case 'vr_approval':
        case 'vr_viewer':
          router.push('/dashboard/vr');
          break;
        case 'cfo':
          router.push('/dashboard/cfo');
          break;
        case 'geschaeftsfuehrer':
          router.push('/dashboard/gf');
          break;
        case 'cashflow_manager':
          router.push('/dashboard/cm');
          break;
        case 'buchhaltung':
          router.push('/dashboard/buchhaltung');
          break;
        default:
          // Stay on generic dashboard for unknown roles
          break;
      }
    }
  }, [user, selectedRole, router]);

  if (!user || !selectedRole) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">
            Willkommen zurück, {user.name.split(' ')[0]}!
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Companies Card */}
          <Card>
            <CardHeader>
              <CardTitle>Unternehmen</CardTitle>
              <CardDescription>Anzahl der Unternehmen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{companies.length}</div>
              <p className="text-sm text-muted-foreground mt-2">
                {companies.filter((c) => c.is_active).length} aktiv
              </p>
            </CardContent>
          </Card>

          {/* Investments Card */}
          <Card>
            <CardHeader>
              <CardTitle>Investitionen</CardTitle>
              <CardDescription>Gesamtanzahl Investitionen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{investments.length}</div>
              <p className="text-sm text-muted-foreground mt-2">
                {investments.filter((i) => i.status === 'genehmigt').length} genehmigt
              </p>
            </CardContent>
          </Card>

          {/* Cashflows Card */}
          <Card>
            <CardHeader>
              <CardTitle>Zahlungsströme</CardTitle>
              <CardDescription>Anzahl geplanter Zahlungen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{cashflows.length}</div>
              <p className="text-sm text-muted-foreground mt-2">
                {cashflows.filter((cf) => cf.status === 'bestaetigt').length} bestätigt
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Schnellzugriff</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Card
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => router.push('/investments')}
            >
              <CardHeader>
                <CardTitle className="text-lg">Investitionen verwalten</CardTitle>
                <CardDescription>
                  Neue Investitionen erstellen und bestehende verwalten
                </CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => router.push('/cashflows')}
            >
              <CardHeader>
                <CardTitle className="text-lg">Cashflow-Übersicht</CardTitle>
                <CardDescription>
                  Zahlungsströme einsehen und bestätigen
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:bg-accent transition-colors opacity-50">
              <CardHeader>
                <CardTitle className="text-lg">Berichte</CardTitle>
                <CardDescription>
                  Monatliche und jährliche Berichte generieren (Coming Soon)
                </CardDescription>
              </CardHeader>
            </Card>

            {selectedRole.role === 'vr_approval' ? (
              <Card
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => router.push('/approvals')}
              >
                <CardHeader>
                  <CardTitle className="text-lg">Genehmigungen</CardTitle>
                  <CardDescription>
                    Offene Genehmigungen prüfen und bearbeiten
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <Card className="cursor-pointer hover:bg-accent transition-colors opacity-50">
                <CardHeader>
                  <CardTitle className="text-lg">Genehmigungen</CardTitle>
                  <CardDescription>
                    Offene Genehmigungen prüfen und bearbeiten (Keine Berechtigung)
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </div>

        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="mt-8 border-dashed">
            <CardHeader>
              <CardTitle className="text-sm">Debug Info</CardTitle>
            </CardHeader>
            <CardContent className="text-xs font-mono space-y-1">
              <div>User ID: {user.id}</div>
              <div>Role: {selectedRole.role}</div>
              <div>Company ID: {selectedRole.company_id || 'Group Level'}</div>
              <div>Group ID: {selectedRole.group_id}</div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
