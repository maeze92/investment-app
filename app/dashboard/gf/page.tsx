'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';
import { Navigation } from '@/components/layout/Navigation';
import { KPICard } from '@/components/dashboard/shared/KPICard';
import { QuickActionsWidget } from '@/components/dashboard/gf/QuickActionsWidget';
import { UpcomingPaymentsWidget } from '@/components/dashboard/gf/UpcomingPaymentsWidget';
import {
  calculateTotalInvestmentValue,
  countInvestmentsByStatus,
  filterInvestmentsByCompany,
  filterCashflowsByCompany,
  countCashflowsByStatus,
  getCashflowsDueSoon,
  formatCompactCurrency,
} from '@/lib/utils/dashboardHelpers';
import { TrendingUp, FileText, CheckCircle, Clock } from 'lucide-react';

export default function GFDashboardPage() {
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

    // Check if user has GF role
    if (selectedRole.role !== 'geschaeftsfuehrer') {
      router.push('/dashboard');
    }
  }, [user, selectedRole, router]);

  if (!user || !selectedRole || !selectedRole.company_id) {
    return null;
  }

  // Filter data for current company only
  const myInvestments = filterInvestmentsByCompany(investments, selectedRole.company_id);
  const myCashflows = filterCashflowsByCompany(cashflows, investments, selectedRole.company_id);

  // Calculate KPIs
  const totalValue = calculateTotalInvestmentValue(myInvestments);
  const draftCount = countInvestmentsByStatus(myInvestments, 'entwurf');
  const approvedCount = countInvestmentsByStatus(myInvestments, 'genehmigt');

  const pendingConfirmations = myCashflows.filter(cf => cf.status === 'vorbestaetigt');
  const upcomingPayments = getCashflowsDueSoon(myCashflows, 90);

  const company = companies.find((c) => c.id === selectedRole.company_id);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Geschäftsführer Dashboard</h2>
          <p className="text-muted-foreground">
            {company?.name || 'Ihr Unternehmen'}
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <KPICard
            title="Investitionssumme"
            value={formatCompactCurrency(totalValue)}
            subtitle={`${myInvestments.length} Investitionen`}
            icon={<TrendingUp className="w-5 h-5" />}
          />

          <KPICard
            title="Entwürfe"
            value={draftCount}
            subtitle="In Bearbeitung"
            icon={<FileText className="w-5 h-5" />}
          />

          <KPICard
            title="Genehmigt"
            value={approvedCount}
            subtitle="Aktive Investitionen"
            icon={<CheckCircle className="w-5 h-5" />}
          />

          <KPICard
            title="Offene Bestätigungen"
            value={pendingConfirmations.length}
            subtitle="Cashflows warten"
            icon={<Clock className="w-5 h-5" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Quick Actions */}
          <QuickActionsWidget />

          {/* Upcoming Payments */}
          <UpcomingPaymentsWidget cashflows={upcomingPayments} />
        </div>

        {/* Investment Status Overview */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="p-6 bg-white rounded-lg border">
            <h3 className="font-semibold mb-2">Zur Genehmigung</h3>
            <div className="text-3xl font-bold">
              {countInvestmentsByStatus(myInvestments, 'zur_genehmigung')}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Beim Verwaltungsrat
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border">
            <h3 className="font-semibold mb-2">Aktiv</h3>
            <div className="text-3xl font-bold">
              {countInvestmentsByStatus(myInvestments, 'aktiv')}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Laufende Investitionen
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border">
            <h3 className="font-semibold mb-2">Abgeschlossen</h3>
            <div className="text-3xl font-bold">
              {countInvestmentsByStatus(myInvestments, 'abgeschlossen')}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Beendete Investitionen
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
