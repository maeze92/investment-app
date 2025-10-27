'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';
import { Navigation } from '@/components/layout/Navigation';
import { CashflowTable } from '@/components/cashflows/CashflowTable';
import { CashflowConfirmationDialog } from '@/components/cashflows/CashflowConfirmationDialog';
import { PostponeDialog } from '@/components/cashflows/PostponeDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Cashflow } from '@/types/entities';

export default function CashflowsPage() {
  const router = useRouter();
  const { user, userRoles } = useAuthStore();
  const {
    cashflows,
    investments,
    companies,
    confirmCashflowCM,
    confirmCashflowGF,
    postponeCashflow,
    initialize,
  } = useAppStore();

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Dialog states
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [postponeDialogOpen, setPostponeDialogOpen] = useState(false);
  const [selectedCashflow, setSelectedCashflow] = useState<Cashflow | null>(null);

  useEffect(() => {
    const init = async () => {
      await initialize();
      setIsLoading(false);
    };
    init();
  }, [initialize]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const hasAccess = userRoles.some((r) =>
      ['cashflow_manager', 'geschaeftsfuehrer', 'cfo', 'buchhaltung'].includes(r.role)
    );

    if (!hasAccess) {
      router.push('/dashboard');
    }
  }, [user, userRoles, router]);

  const userRole = userRoles.find((r) => r.user_id === user?.id)?.role;

  // Filter cashflows
  const filteredCashflows = useMemo(() => {
    let filtered = cashflows;

    // Filter by month/year
    filtered = filtered.filter((cf) => cf.month === selectedMonth && cf.year === selectedYear);

    // Filter by company
    if (selectedCompany !== 'all') {
      const companyInvestmentIds = investments
        .filter((inv) => inv.company_id === selectedCompany)
        .map((inv) => inv.id);
      filtered = filtered.filter((cf) => companyInvestmentIds.includes(cf.investment_id));
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((cf) => cf.status === selectedStatus);
    }

    // Role-based filtering for GF
    if (userRole === 'geschaeftsfuehrer') {
      const myRole = userRoles.find((r) => r.user_id === user?.id);
      if (myRole?.company_id) {
        const myInvestmentIds = investments
          .filter((inv) => inv.company_id === myRole.company_id)
          .map((inv) => inv.id);
        filtered = filtered.filter((cf) => myInvestmentIds.includes(cf.investment_id));
      }
    }

    return filtered;
  }, [
    cashflows,
    selectedMonth,
    selectedYear,
    selectedCompany,
    selectedStatus,
    investments,
    userRole,
    userRoles,
    user,
  ]);

  // Statistics
  const stats = useMemo(() => {
    const total = filteredCashflows.reduce((sum, cf) => sum + cf.amount, 0);
    const outstanding = filteredCashflows
      .filter((cf) => cf.status === 'ausstehend')
      .reduce((sum, cf) => sum + cf.amount, 0);
    const preConfirmed = filteredCashflows
      .filter((cf) => cf.status === 'vorbestaetigt')
      .reduce((sum, cf) => sum + cf.amount, 0);
    const confirmed = filteredCashflows
      .filter((cf) => cf.status === 'bestaetigt')
      .reduce((sum, cf) => sum + cf.amount, 0);

    return {
      total,
      outstanding,
      preConfirmed,
      confirmed,
      count: filteredCashflows.length,
    };
  }, [filteredCashflows]);

  const handleConfirmCM = (cashflowId: string) => {
    const cashflow = cashflows.find((cf) => cf.id === cashflowId);
    if (cashflow) {
      setSelectedCashflow(cashflow);
      setConfirmDialogOpen(true);
    }
  };

  const handleConfirmGF = (cashflowId: string) => {
    const cashflow = cashflows.find((cf) => cf.id === cashflowId);
    if (cashflow) {
      setSelectedCashflow(cashflow);
      setConfirmDialogOpen(true);
    }
  };

  const handlePostpone = (cashflowId: string) => {
    const cashflow = cashflows.find((cf) => cf.id === cashflowId);
    if (cashflow) {
      setSelectedCashflow(cashflow);
      setPostponeDialogOpen(true);
    }
  };

  const handleConfirmAction = async (comment?: string) => {
    if (!selectedCashflow || !user) return;

    try {
      if (userRole === 'cashflow_manager') {
        await confirmCashflowCM(selectedCashflow.id, user.id, comment);
      } else if (userRole === 'geschaeftsfuehrer') {
        await confirmCashflowGF(selectedCashflow.id, user.id, comment);
      }
      await initialize();
    } catch (error) {
      console.error('Error confirming cashflow:', error);
      alert('Fehler beim Bestätigen der Zahlung');
    }
  };

  const handlePostponeAction = async (newDate: Date, reason: string) => {
    if (!selectedCashflow || !user) return;

    try {
      await postponeCashflow(selectedCashflow.id, user.id, newDate, reason);
      await initialize();
    } catch (error) {
      console.error('Error postponing cashflow:', error);
      alert('Fehler beim Verschieben der Zahlung');
    }
  };

  // Generate month/year options
  const months = [
    { value: 1, label: 'Januar' },
    { value: 2, label: 'Februar' },
    { value: 3, label: 'März' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Dezember' },
  ];

  const years = [2024, 2025, 2026];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Cashflow-Verwaltung</h1>
          <p className="text-muted-foreground">
            Zahlungsströme verwalten und bestätigen
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Gesamt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.total)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.count} Zahlung(en)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ausstehend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {formatCurrency(stats.outstanding)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Wartet auf Vorbestätigung
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Vorbestätigt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(stats.preConfirmed)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Wartet auf finale Freigabe
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Bestätigt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.confirmed)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Final freigegeben
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-4">
              {/* Month */}
              <div className="space-y-2">
                <Label>Monat</Label>
                <Select
                  value={selectedMonth.toString()}
                  onValueChange={(value) => setSelectedMonth(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Year */}
              <div className="space-y-2">
                <Label>Jahr</Label>
                <Select
                  value={selectedYear.toString()}
                  onValueChange={(value) => setSelectedYear(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Company */}
              {userRole !== 'geschaeftsfuehrer' && (
                <div className="space-y-2">
                  <Label>Unternehmen</Label>
                  <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Unternehmen</SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Status */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Status</SelectItem>
                    <SelectItem value="ausstehend">Ausstehend</SelectItem>
                    <SelectItem value="vorbestaetigt">Vorbestätigt</SelectItem>
                    <SelectItem value="bestaetigt">Bestätigt</SelectItem>
                    <SelectItem value="verschoben">Verschoben</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cashflow Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Zahlungen für {months[selectedMonth - 1].label} {selectedYear}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Lädt Cashflows...</p>
              </div>
            ) : (
              <CashflowTable
                cashflows={filteredCashflows}
                investments={investments}
                companies={companies}
                onConfirmCM={userRole === 'cashflow_manager' ? handleConfirmCM : undefined}
                onConfirmGF={userRole === 'geschaeftsfuehrer' ? handleConfirmGF : undefined}
                onPostpone={
                  userRole === 'cashflow_manager' || userRole === 'geschaeftsfuehrer'
                    ? handlePostpone
                    : undefined
                }
                showActions={
                  userRole === 'cashflow_manager' || userRole === 'geschaeftsfuehrer'
                }
                userRole={userRole}
              />
            )}
          </CardContent>
        </Card>
      </main>

      {/* Dialogs */}
      {selectedCashflow && (
        <>
          <CashflowConfirmationDialog
            cashflow={selectedCashflow}
            investment={investments.find((inv) => inv.id === selectedCashflow.investment_id)!}
            open={confirmDialogOpen}
            onOpenChange={setConfirmDialogOpen}
            onConfirm={handleConfirmAction}
            userRole={userRole as 'cashflow_manager' | 'geschaeftsfuehrer'}
          />

          <PostponeDialog
            cashflow={selectedCashflow}
            open={postponeDialogOpen}
            onOpenChange={setPostponeDialogOpen}
            onPostpone={handlePostponeAction}
          />
        </>
      )}
    </div>
  );
}
