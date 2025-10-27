'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';
import { Navigation } from '@/components/layout/Navigation';
import { KPICard } from '@/components/dashboard/shared/KPICard';
import { MonthlyStatusWidget } from '@/components/dashboard/cm/MonthlyStatusWidget';
import { Button } from '@/components/ui/button';
import {
  countCashflowsByStatus,
  getCurrentMonthCashflows,
  getOverdueCashflows,
  formatCompactCurrency,
} from '@/lib/utils/dashboardHelpers';
import { CheckCircle, Clock, AlertTriangle, Calendar } from 'lucide-react';

export default function CMDashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const selectedRole = useAuthStore((state) => state.selectedRole);
  const cashflows = useAppStore((state) => state.cashflows);

  useEffect(() => {
    if (!user || !selectedRole) {
      router.push('/login');
      return;
    }

    // Check if user has CM role
    if (selectedRole.role !== 'cashflow_manager') {
      router.push('/dashboard');
    }
  }, [user, selectedRole, router]);

  if (!user || !selectedRole) {
    return null;
  }

  // Get current month/year
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // Filter for current month
  const monthCashflows = getCurrentMonthCashflows(cashflows);

  // Calculate KPIs
  const pendingCount = countCashflowsByStatus(monthCashflows, 'ausstehend');
  const preconfirmedCount = countCashflowsByStatus(monthCashflows, 'vorbestaetigt');
  const confirmedCount = countCashflowsByStatus(monthCashflows, 'bestaetigt');
  const overdueList = getOverdueCashflows(cashflows);

  const pendingAmount = monthCashflows
    .filter((cf) => cf.status === 'ausstehend')
    .reduce((sum, cf) => sum + cf.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Cashflow Manager Dashboard</h2>
          <p className="text-muted-foreground">
            Übersicht und Verwaltung aller Zahlungsströme
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <KPICard
            title="Ausstehend (Monat)"
            value={pendingCount}
            subtitle={formatCompactCurrency(pendingAmount)}
            icon={<Clock className="w-5 h-5" />}
          />

          <KPICard
            title="Vorbestätigt"
            value={preconfirmedCount}
            subtitle="Warten auf GF"
            icon={<Calendar className="w-5 h-5" />}
          />

          <KPICard
            title="Bestätigt"
            value={confirmedCount}
            subtitle="Aktueller Monat"
            icon={<CheckCircle className="w-5 h-5" />}
          />

          <KPICard
            title="Überfällig"
            value={overdueList.length}
            subtitle={overdueList.length > 0 ? 'Sofortige Aktion erforderlich!' : 'Keine'}
            icon={<AlertTriangle className="w-5 h-5" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Monthly Status */}
          <MonthlyStatusWidget
            cashflows={cashflows}
            month={currentMonth}
            year={currentYear}
          />

          {/* Quick Actions */}
          <div className="space-y-4">
            <Button
              className="w-full h-20 text-lg"
              onClick={() => router.push('/cashflows')}
            >
              <CheckCircle className="w-6 h-6 mr-3" />
              Cashflows bestätigen
            </Button>

            <Button
              variant="outline"
              className="w-full h-20 text-lg"
              onClick={() => router.push('/cashflows')}
            >
              <Calendar className="w-6 h-6 mr-3" />
              Monatliche Übersicht öffnen
            </Button>

            {overdueList.length > 0 && (
              <Button
                variant="destructive"
                className="w-full h-20 text-lg"
                onClick={() => router.push('/cashflows')}
              >
                <AlertTriangle className="w-6 h-6 mr-3" />
                Überfällige Zahlungen prüfen ({overdueList.length})
              </Button>
            )}
          </div>
        </div>

        {/* Overdue Warnings */}
        {overdueList.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-4">
              Überfällige Zahlungen
            </h3>
            <div className="space-y-2">
              {overdueList.slice(0, 5).map((cf) => (
                <div
                  key={cf.id}
                  className="flex items-center justify-between p-3 bg-white rounded border border-red-100"
                >
                  <div>
                    <div className="font-medium">
                      {formatCompactCurrency(cf.amount)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Fällig: {new Date(cf.due_date).toLocaleDateString('de-DE')}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push('/cashflows')}
                  >
                    Bearbeiten
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
