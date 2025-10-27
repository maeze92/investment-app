'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';
import { Navigation } from '@/components/layout/Navigation';
import { KPICard } from '@/components/dashboard/shared/KPICard';
import { PendingApprovalsWidget } from '@/components/dashboard/vr/PendingApprovalsWidget';
import { InvestmentChartsWidget } from '@/components/dashboard/vr/InvestmentChartsWidget';
import {
  calculateTotalInvestmentValue,
  countInvestmentsByStatus,
  getCurrentYearInvestments,
  formatCompactCurrency,
} from '@/lib/utils/dashboardHelpers';
import { TrendingUp, FileCheck, CheckCircle, Clock } from 'lucide-react';

export default function VRDashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const selectedRole = useAuthStore((state) => state.selectedRole);
  const companies = useAppStore((state) => state.companies);
  const investments = useAppStore((state) => state.investments);

  useEffect(() => {
    if (!user || !selectedRole) {
      router.push('/login');
      return;
    }

    // Check if user has VR role
    if (selectedRole.role !== 'vr_approval' && selectedRole.role !== 'vr_viewer') {
      router.push('/dashboard');
    }
  }, [user, selectedRole, router]);

  if (!user || !selectedRole) {
    return null;
  }

  // Calculate KPIs
  const currentYearInvestments = getCurrentYearInvestments(investments);
  const totalValue = calculateTotalInvestmentValue(currentYearInvestments);
  const pendingCount = countInvestmentsByStatus(investments, 'zur_genehmigung');
  const approvedCount = countInvestmentsByStatus(investments, 'genehmigt');
  const totalCount = investments.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Verwaltungsrat Dashboard</h2>
          <p className="text-muted-foreground">
            Übersicht über alle Investitionen und ausstehende Genehmigungen
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <KPICard
            title="Investitionssumme (Jahr)"
            value={formatCompactCurrency(totalValue)}
            subtitle={`${currentYearInvestments.length} Investitionen`}
            icon={<TrendingUp className="w-5 h-5" />}
          />

          <KPICard
            title="Ausstehende Genehmigungen"
            value={pendingCount}
            subtitle="Warten auf Ihre Entscheidung"
            icon={<Clock className="w-5 h-5" />}
          />

          <KPICard
            title="Genehmigte Investitionen"
            value={approvedCount}
            subtitle={`${((approvedCount / totalCount) * 100).toFixed(0)}% der Gesamtzahl`}
            icon={<CheckCircle className="w-5 h-5" />}
          />

          <KPICard
            title="Alle Investitionen"
            value={totalCount}
            subtitle={`Über ${companies.length} Unternehmen`}
            icon={<FileCheck className="w-5 h-5" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Pending Approvals Widget */}
          <PendingApprovalsWidget investments={investments} companies={companies} />

          {/* Investment Charts */}
          <InvestmentChartsWidget investments={investments} />
        </div>
      </main>
    </div>
  );
}
