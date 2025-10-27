'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InvestmentTable } from '@/components/investments/InvestmentTable';
import { InvestmentFilters } from '@/components/investments/InvestmentFilters';
import { Investment } from '@/types/entities';
import { InvestmentStatus, InvestmentCategory, FinancingType } from '@/types/enums';
import { Navigation } from '@/components/layout/Navigation';

// Filter State
interface FilterState {
  status: InvestmentStatus | 'all';
  category: InvestmentCategory | 'all';
  financingType: FinancingType | 'all';
  companyId: string | 'all';
  search: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export default function InvestmentsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const selectedRole = useAuthStore((state) => state.selectedRole);

  const investments = useAppStore((state) => state.investments);
  const companies = useAppStore((state) => state.companies);
  const getCompany = useAppStore((state) => state.getCompany);

  const [filteredInvestments, setFilteredInvestments] = useState<Investment[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    category: 'all',
    financingType: 'all',
    companyId: 'all',
    search: '',
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Apply filters
  useEffect(() => {
    let filtered = [...investments];

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter((inv) => inv.status === filters.status);
    }

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter((inv) => inv.category === filters.category);
    }

    // Filter by financing type
    if (filters.financingType !== 'all') {
      filtered = filtered.filter((inv) => inv.financing_type === filters.financingType);
    }

    // Filter by company
    if (filters.companyId !== 'all') {
      filtered = filtered.filter((inv) => inv.company_id === filters.companyId);
    }

    // Search filter (name, description)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (inv) =>
          inv.name.toLowerCase().includes(searchLower) ||
          inv.description?.toLowerCase().includes(searchLower)
      );
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter((inv) => new Date(inv.start_date) >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      filtered = filtered.filter((inv) => new Date(inv.start_date) <= filters.dateTo!);
    }

    setFilteredInvestments(filtered);
  }, [investments, filters]);

  const handleCreateInvestment = () => {
    router.push('/investments/new');
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      category: 'all',
      financingType: 'all',
      companyId: 'all',
      search: '',
    });
  };

  if (!user || !selectedRole) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Investitionen</h2>
            <p className="text-muted-foreground">
              Verwalten Sie alle Investitionen Ihrer Unternehmensgruppe
            </p>
          </div>
          {(selectedRole.role === 'geschaeftsfuehrer' || selectedRole.role === 'cfo') && (
            <Button onClick={handleCreateInvestment}>Neue Investition erstellen</Button>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Gesamt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{investments.length}</div>
              <p className="text-xs text-muted-foreground">Investitionen</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Entwurf</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {investments.filter((i) => i.status === 'entwurf').length}
              </div>
              <p className="text-xs text-muted-foreground">In Bearbeitung</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Zur Genehmigung</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {investments.filter((i) => i.status === 'zur_genehmigung').length}
              </div>
              <p className="text-xs text-muted-foreground">Warten auf Freigabe</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Genehmigt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {investments.filter((i) => i.status === 'genehmigt').length}
              </div>
              <p className="text-xs text-muted-foreground">Freigegeben</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Filter</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleResetFilters}>
                Zurücksetzen
              </Button>
            </div>
            <CardDescription>
              Filtern Sie die Investitionen nach verschiedenen Kriterien
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InvestmentFilters
              filters={filters}
              onFiltersChange={setFilters}
              companies={companies}
            />
          </CardContent>
        </Card>

        {/* Results Info */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredInvestments.length} von {investments.length} Investitionen
          </p>
        </div>

        {/* Investment Table */}
        <Card>
          <CardContent className="p-0">
            <InvestmentTable
              investments={filteredInvestments}
              companies={companies}
              onViewDetails={(id) => router.push(`/investments/${id}`)}
              onEdit={(id) => router.push(`/investments/${id}/edit`)}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
