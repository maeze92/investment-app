'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';
import { Navigation } from '@/components/layout/Navigation';
import { InvestmentWizard } from '@/components/investments/InvestmentWizard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function EditInvestmentPage() {
  const router = useRouter();
  const params = useParams();
  const investmentId = params.id as string;

  const user = useAuthStore((state) => state.user);
  const selectedRole = useAuthStore((state) => state.selectedRole);
  const investments = useAppStore((state) => state.investments);

  const investment = investments.find((inv) => inv.id === investmentId);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      router.push('/login');
      return;
    }

    // Check permissions
    if (selectedRole?.role !== 'geschaeftsfuehrer' && selectedRole?.role !== 'cfo') {
      router.push('/investments');
      return;
    }

    // Check if investment exists
    if (!investment) {
      router.push('/investments');
      return;
    }

    // Only allow editing of draft investments
    if (investment.status !== 'entwurf') {
      router.push(`/investments/${investmentId}`);
      return;
    }
  }, [user, selectedRole, investment, router, investmentId]);

  if (!user || !selectedRole || !investment || investment.status !== 'entwurf') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">Investition bearbeiten</h2>
          <p className="text-muted-foreground">
            Bearbeiten Sie die Investition: {investment.name}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Investitionsdetails</CardTitle>
            <CardDescription>
              Aktualisieren Sie die Details dieser Investition
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InvestmentWizard mode="edit" existingInvestment={investment} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
