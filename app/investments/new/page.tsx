'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { InvestmentWizard } from '@/components/investments/InvestmentWizard';
import { Navigation } from '@/components/layout/Navigation';

export default function NewInvestmentPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const selectedRole = useAuthStore((state) => state.selectedRole);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
    // Check if user has permission to create investments
    if (
      selectedRole &&
      !['geschaeftsfuehrer', 'cfo'].includes(selectedRole.role)
    ) {
      router.push('/investments');
    }
  }, [user, selectedRole, router]);

  if (!user || !selectedRole) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold">Neue Investition erstellen</h2>
          <p className="text-muted-foreground">
            Folgen Sie den Schritten, um eine neue Investition anzulegen
          </p>
        </div>

        {/* Wizard */}
        <InvestmentWizard />
      </main>
    </div>
  );
}
