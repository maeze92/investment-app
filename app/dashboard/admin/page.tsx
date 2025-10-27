'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAdminStore } from '@/stores/useAdminStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Building2, Building, TrendingUp, Activity, Shield } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAdmin } = useAuthStore();
  const { systemStats, loadSystemStats, isLoading } = useAdminStore();

  useEffect(() => {
    // Check if user is admin
    if (!isAdmin()) {
      router.push('/dashboard');
      return;
    }

    // Load system stats
    loadSystemStats();
  }, [isAdmin, router, loadSystemStats]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Lade Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!systemStats) {
    return null;
  }

  const quickActions = [
    {
      title: 'Neue Gruppe',
      description: 'Mandant erstellen',
      href: '/dashboard/admin/groups',
      icon: Building2,
      color: 'text-blue-500',
    },
    {
      title: 'Neues Unternehmen',
      description: 'Subfirma anlegen',
      href: '/dashboard/admin/companies',
      icon: Building,
      color: 'text-green-500',
    },
    {
      title: 'Neuer Benutzer',
      description: 'User hinzufügen',
      href: '/dashboard/admin/users',
      icon: Users,
      color: 'text-purple-500',
    },
    {
      title: 'Rollenverwaltung',
      description: 'Rollen zuweisen',
      href: '/dashboard/admin/roles',
      icon: Shield,
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">System Administration</h1>
        <p className="text-muted-foreground mt-1">
          Verwaltung von Mandanten, Unternehmen, Benutzern und Rollen
        </p>
      </div>

      {/* System Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mandanten (Groups)</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalGroups}</div>
            <p className="text-xs text-muted-foreground">Registrierte Gruppen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unternehmen</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalCompanies}</div>
            <p className="text-xs text-muted-foreground">Subfirmen insgesamt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Benutzer</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {systemStats.activeUsers} aktiv (letzte 30 Tage)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investitionen</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalInvestments}</div>
            <p className="text-xs text-muted-foreground">Gesamt im System</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cashflows</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalCashflows}</div>
            <p className="text-xs text-muted-foreground">Zahlungen erfasst</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant="default" className="bg-green-500">
              Operational
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">Alle Systeme aktiv</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Schnellzugriff</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-muted ${action.color}`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{action.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Management Links */}
      <Card>
        <CardHeader>
          <CardTitle>Verwaltungsbereiche</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link href="/dashboard/admin/groups">
            <Button variant="outline" className="w-full justify-start">
              <Building2 className="mr-2 h-4 w-4" />
              Mandantenverwaltung
            </Button>
          </Link>
          <Link href="/dashboard/admin/companies">
            <Button variant="outline" className="w-full justify-start">
              <Building className="mr-2 h-4 w-4" />
              Unternehmensverwaltung
            </Button>
          </Link>
          <Link href="/dashboard/admin/users">
            <Button variant="outline" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Benutzerverwaltung
            </Button>
          </Link>
          <Link href="/dashboard/admin/roles">
            <Button variant="outline" className="w-full justify-start">
              <Shield className="mr-2 h-4 w-4" />
              Rollenverwaltung
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
