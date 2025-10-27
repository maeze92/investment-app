'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';
import { Navigation } from '@/components/layout/Navigation';
import { ApprovalCard } from '@/components/approvals/ApprovalCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter } from 'lucide-react';

export default function ApprovalsPage() {
  const router = useRouter();
  const { user, userRoles } = useAuthStore();
  const {
    investments,
    companies,
    approveInvestment,
    rejectInvestment,
    initialize,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'company'>('date');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await initialize();
      setIsLoading(false);
    };
    init();
  }, [initialize]);

  // Check if user has approval permissions
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const hasApprovalRole = userRoles.some((r) => r.role === 'vr_approval');
    if (!hasApprovalRole) {
      router.push('/dashboard');
    }
  }, [user, userRoles, router]);

  // Filter investments that need approval
  const pendingInvestments = useMemo(() => {
    let filtered = investments.filter(
      (inv) => inv.status === 'zur_genehmigung'
    );

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (inv) =>
          inv.name.toLowerCase().includes(query) ||
          inv.description?.toLowerCase().includes(query) ||
          companies
            .find((c) => c.id === inv.company_id)
            ?.name.toLowerCase()
            .includes(query)
      );
    }

    // Apply company filter
    if (selectedCompany !== 'all') {
      filtered = filtered.filter((inv) => inv.company_id === selectedCompany);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return (
            new Date(b.submitted_at || b.created_at).getTime() -
            new Date(a.submitted_at || a.created_at).getTime()
          );
        case 'amount':
          return b.total_amount - a.total_amount;
        case 'company':
          const companyA =
            companies.find((c) => c.id === a.company_id)?.name || '';
          const companyB =
            companies.find((c) => c.id === b.company_id)?.name || '';
          return companyA.localeCompare(companyB);
        default:
          return 0;
      }
    });

    return filtered;
  }, [investments, searchQuery, selectedCompany, sortBy, companies]);

  const handleApprove = async (
    investmentId: string,
    comment?: string,
    conditions?: string
  ) => {
    if (!user) return;

    try {
      await approveInvestment(investmentId, user.id, comment);
      // Refresh data
      await initialize();
    } catch (error) {
      console.error('Error approving investment:', error);
      alert('Fehler beim Genehmigen der Investition');
    }
  };

  const handleReject = async (investmentId: string, comment: string) => {
    if (!user) return;

    try {
      await rejectInvestment(investmentId, user.id, comment);
      // Refresh data
      await initialize();
    } catch (error) {
      console.error('Error rejecting investment:', error);
      alert('Fehler beim Ablehnen der Investition');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Genehmigungen</h1>
          <p className="text-muted-foreground">
            Prüfen und genehmigen Sie eingereichte Investitionen
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{pendingInvestments.length}</div>
              <p className="text-xs text-muted-foreground">
                Wartende Genehmigungen
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {investments.filter((inv) => inv.status === 'genehmigt').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Genehmigte Investitionen
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {investments.filter((inv) => inv.status === 'abgelehnt').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Abgelehnte Investitionen
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-3">
              {/* Search */}
              <div className="space-y-2">
                <Label>Suche</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Suche nach Name oder Beschreibung..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Company Filter */}
              <div className="space-y-2">
                <Label>Unternehmen</Label>
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alle Unternehmen" />
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

              {/* Sort By */}
              <div className="space-y-2">
                <Label>Sortieren nach</Label>
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Datum (neueste zuerst)</SelectItem>
                    <SelectItem value="amount">Betrag (höchste zuerst)</SelectItem>
                    <SelectItem value="company">Unternehmen (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investments List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Lädt Genehmigungen...</p>
          </div>
        ) : pendingInvestments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Keine wartenden Genehmigungen
              </h3>
              <p className="text-muted-foreground">
                {searchQuery || selectedCompany !== 'all'
                  ? 'Keine Investitionen entsprechen Ihren Filterkriterien'
                  : 'Aktuell gibt es keine Investitionen, die auf Ihre Genehmigung warten'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingInvestments.map((investment) => {
              const company = companies.find((c) => c.id === investment.company_id);
              if (!company) return null;

              return (
                <ApprovalCard
                  key={investment.id}
                  investment={investment}
                  company={company}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
