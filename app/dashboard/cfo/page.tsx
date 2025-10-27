'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';
import { Navigation } from '@/components/layout/Navigation';
import { KPICard } from '@/components/dashboard/shared/KPICard';
import { CashflowForecastWidget } from '@/components/dashboard/cfo/CashflowForecastWidget';
import { CompanyComparisonWidget } from '@/components/dashboard/cfo/CompanyComparisonWidget';
import {
  calculateTotalInvestmentValue,
  calculateAverageInvestmentSize,
  calculateLeasingVsKaufRatio,
  getCashflowsDueSoon,
  sumCashflowsByStatus,
  formatCompactCurrency,
} from '@/lib/utils/dashboardHelpers';
import { TrendingUp, DollarSign, PieChart, Calendar } from 'lucide-react';

export default function CFODashboardPage() {
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

    // Check if user has CFO role
    if (selectedRole.role !== 'cfo') {
      router.push('/dashboard');
    }
  }, [user, selectedRole, router]);

  if (!user || !selectedRole) {
    return null;
  }

  // Calculate KPIs
  const totalValue = calculateTotalInvestmentValue(investments);
  const avgSize = calculateAverageInvestmentSize(investments);
  const leasingRatio = calculateLeasingVsKaufRatio(investments);
  const upcomingPayments = getCashflowsDueSoon(cashflows, 30);
  const upcomingAmount = upcomingPayments.reduce((sum, cf) => sum + cf.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">CFO Dashboard</h2>
          <p className="text-muted-foreground">
            Konsolidierte Übersicht über alle Unternehmen und Finanzströme
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <KPICard
            title="Gesamtinvestitionswert"
            value={formatCompactCurrency(totalValue)}
            subtitle={`${investments.length} Investitionen`}
            icon={<TrendingUp className="w-5 h-5" />}
          />

          <KPICard
            title="Durchschnittsgröße"
            value={formatCompactCurrency(avgSize)}
            subtitle="Pro Investition"
            icon={<DollarSign className="w-5 h-5" />}
          />

          <KPICard
            title="Leasing vs. Kauf"
            value={leasingRatio.ratio}
            subtitle="Verhältnis"
            icon={<PieChart className="w-5 h-5" />}
          />

          <KPICard
            title="Fällig (30 Tage)"
            value={formatCompactCurrency(upcomingAmount)}
            subtitle={`${upcomingPayments.length} Zahlungen`}
            icon={<Calendar className="w-5 h-5" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Cashflow Forecast */}
          <CashflowForecastWidget cashflows={cashflows} />

          {/* Company Comparison */}
          <CompanyComparisonWidget investments={investments} companies={companies} />
        </div>

        {/* Additional Info */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="p-6 bg-white rounded-lg border">
            <h3 className="font-semibold mb-2">Unternehmen</h3>
            <div className="text-3xl font-bold">{companies.length}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {companies.filter((c) => c.is_active).length} aktiv
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border">
            <h3 className="font-semibold mb-2">Leasing-Summe</h3>
            <div className="text-3xl font-bold">
              {formatCompactCurrency(leasingRatio.leasing)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Leasing & Miete
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border">
            <h3 className="font-semibold mb-2">Kauf-Summe</h3>
            <div className="text-3xl font-bold">
              {formatCompactCurrency(leasingRatio.kauf)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Kauf & Ratenzahlung
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
