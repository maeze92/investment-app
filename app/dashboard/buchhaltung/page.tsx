'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';
import { Navigation } from '@/components/layout/Navigation';
import { KPICard } from '@/components/dashboard/shared/KPICard';
import { ConfirmedPaymentsWidget } from '@/components/dashboard/buchhaltung/ConfirmedPaymentsWidget';
import { MiniChart } from '@/components/dashboard/shared/MiniChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  countCashflowsByStatus,
  sumCashflowsByStatus,
  getCurrentMonthCashflows,
  formatCompactCurrency,
} from '@/lib/utils/dashboardHelpers';
import { groupInvestmentsByCategory, groupInvestmentsByCompany } from '@/lib/utils/chartHelpers';
import { CheckCircle, DollarSign, FileText, Download } from 'lucide-react';

export default function BuchhaltungDashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const selectedRole = useAuthStore((state) => state.selectedRole);
  const companies = useAppStore((state) => state.companies);
  const investments = useAppStore((state) => state.investments);
  const cashflows = useAppStore((state) => state.cashflows);

  useEffect(() => {
    if (!user || !selectedRole) {
      router.push('/login');
      return;
    }

    // Check if user has Buchhaltung role
    if (selectedRole.role !== 'buchhaltung') {
      router.push('/dashboard');
    }
  }, [user, selectedRole, router]);

  if (!user || !selectedRole) {
    return null;
  }

  // Get current month cashflows
  const monthCashflows = getCurrentMonthCashflows(cashflows);

  // Calculate KPIs
  const confirmedCount = countCashflowsByStatus(cashflows, 'bestaetigt');
  const confirmedAmount = sumCashflowsByStatus(cashflows, 'bestaetigt');

  const monthConfirmedCount = countCashflowsByStatus(monthCashflows, 'bestaetigt');
  const monthConfirmedAmount = sumCashflowsByStatus(monthCashflows, 'bestaetigt');

  // Auto-confirmed (from leasing)
  const autoConfirmedCount = cashflows.filter(
    (cf) => cf.status === 'bestaetigt' && cf.auto_confirmed === true
  ).length;

  // Chart data
  const categoryData = groupInvestmentsByCategory(investments);
  const companyData = groupInvestmentsByCompany(investments, companies);

  const currentMonthName = new Date().toLocaleDateString('de-DE', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Buchhaltung Dashboard</h2>
          <p className="text-muted-foreground">
            Übersicht bestätigter Zahlungen und Export-Funktionen
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <KPICard
            title="Bestätigte Zahlungen (Gesamt)"
            value={confirmedCount}
            subtitle={formatCompactCurrency(confirmedAmount)}
            icon={<CheckCircle className="w-5 h-5" />}
          />

          <KPICard
            title="Aktueller Monat"
            value={monthConfirmedCount}
            subtitle={formatCompactCurrency(monthConfirmedAmount)}
            icon={<DollarSign className="w-5 h-5" />}
          />

          <KPICard
            title="Auto-Bestätigt (Leasing)"
            value={autoConfirmedCount}
            subtitle="Automatisch verarbeitet"
            icon={<FileText className="w-5 h-5" />}
          />

          <KPICard
            title="Unternehmen"
            value={companies.length}
            subtitle="In der Gruppe"
            icon={<FileText className="w-5 h-5" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Confirmed Payments */}
          <ConfirmedPaymentsWidget
            cashflows={cashflows}
            investments={investments}
            companies={companies}
          />

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle>Export-Optionen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-4"
                  onClick={() => alert('Export-Funktion wird in Phase 7 implementiert')}
                >
                  <Download className="w-5 h-5 mr-3 text-green-600" />
                  <div className="text-left flex-1">
                    <div className="font-medium">Monatsbericht (Excel)</div>
                    <div className="text-xs text-muted-foreground">
                      Alle Cashflows für {currentMonthName}
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-4"
                  onClick={() => alert('Export-Funktion wird in Phase 7 implementiert')}
                >
                  <Download className="w-5 h-5 mr-3 text-blue-600" />
                  <div className="text-left flex-1">
                    <div className="font-medium">Buchungsjournal (CSV)</div>
                    <div className="text-xs text-muted-foreground">
                      Bestätigte Zahlungen für Import
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-4"
                  onClick={() => alert('Export-Funktion wird in Phase 7 implementiert')}
                >
                  <Download className="w-5 h-5 mr-3 text-red-600" />
                  <div className="text-left flex-1">
                    <div className="font-medium">Jahresübersicht (PDF)</div>
                    <div className="text-xs text-muted-foreground">
                      Alle Investitionen und Cashflows
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Investitionen nach Kategorie</CardTitle>
            </CardHeader>
            <CardContent>
              <MiniChart
                type="pie"
                data={categoryData}
                dataKey="value"
                nameKey="name"
                height={300}
              />
            </CardContent>
          </Card>

          {/* Company Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Investitionen nach Unternehmen</CardTitle>
            </CardHeader>
            <CardContent>
              <MiniChart
                type="bar"
                data={companyData}
                dataKey="value"
                nameKey="name"
                height={300}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
