'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAppStore } from '@/stores/useAppStore';
import { Button } from '@/components/ui/button';
import { InvestmentDetails } from '@/components/investments/InvestmentDetails';
import { ROLE_NAMES } from '@/types/enums';
import { Investment } from '@/types/entities';

export default function InvestmentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const investmentId = params.id as string;

  const user = useAuthStore((state) => state.user);
  const selectedRole = useAuthStore((state) => state.selectedRole);
  const logout = useAuthStore((state) => state.logout);

  const investments = useAppStore((state) => state.investments);
  const [investment, setInvestment] = useState<Investment | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Find investment
  useEffect(() => {
    const found = investments.find((inv) => inv.id === investmentId);
    if (found) {
      setInvestment(found);
    } else {
      // Investment not found
      setInvestment(null);
    }
  }, [investmentId, investments]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleBack = () => {
    router.push('/investments');
  };

  if (!user || !selectedRole) {
    return null;
  }

  if (!investment) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="border-b bg-white">
          <div className="container mx-auto flex items-center justify-between px-4 py-4">
            <div>
              <h1 className="text-2xl font-bold">Investitionsplanung</h1>
              <p className="text-sm text-muted-foreground">
                {user.name} - {ROLE_NAMES[selectedRole.role]}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Dashboard
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Abmelden
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Investition nicht gefunden</h2>
            <p className="text-muted-foreground mb-6">
              Die angeforderte Investition existiert nicht oder wurde gelöscht.
            </p>
            <Button onClick={handleBack}>Zurück zur Übersicht</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold">Investitionsplanung</h1>
            <p className="text-sm text-muted-foreground">
              {user.name} - {ROLE_NAMES[selectedRole.role]}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              Dashboard
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Abmelden
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            ← Zurück zur Übersicht
          </Button>
        </div>

        <InvestmentDetails investment={investment} />
      </main>
    </div>
  );
}
