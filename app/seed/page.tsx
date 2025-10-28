'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { storageService } from '@/lib/storage/LocalStorageService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SeedPage() {
  const router = useRouter();
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSeeded, setIsSeeded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  const handleSeed = async () => {
    try {
      setIsSeeding(true);
      setError(null);

      // Initialize storage
      await storageService.initialize();

      // Create backup of existing data
      await storageService.backup();

      // Dynamically import mockDataGenerator to avoid SSR issues with faker.js
      const { mockDataGenerator } = await import('@/lib/utils/mockDataGenerator');

      // Generate mock data
      const mockData = mockDataGenerator.seedDatabase();

      // Restore with mock data
      await storageService.restore(mockData);

      setStats({
        groups: mockData.groups.length,
        companies: mockData.companies.length,
        users: mockData.users.length,
        investments: mockData.investments.length,
        cashflows: mockData.cashflows.length,
      });

      setIsSeeded(true);
      setIsSeeding(false);
    } catch (err) {
      console.error('Seeding failed:', err);
      setError(err instanceof Error ? err.message : 'Seeding failed');
      setIsSeeding(false);
    }
  };

  const handleReset = async () => {
    try {
      setIsSeeding(true);
      setError(null);

      await storageService.initialize();
      await storageService.clear();

      setStats(null);
      setIsSeeded(false);
      setIsSeeding(false);
    } catch (err) {
      console.error('Reset failed:', err);
      setError(err instanceof Error ? err.message : 'Reset failed');
      setIsSeeding(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Datenbank Setup</h1>
          <p className="mt-2 text-muted-foreground">
            Generiere Mock-Daten für die lokale Entwicklung
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mock-Daten generieren</CardTitle>
            <CardDescription>
              Dies erstellt realistische Testdaten für die Entwicklung
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isSeeded ? (
              <>
                <div className="space-y-2">
                  <h3 className="font-semibold">Was wird generiert:</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>2 Unternehmensgruppen</li>
                    <li>6 Unternehmen</li>
                    <li>15 Benutzer (inkl. 5 Demo-Benutzer)</li>
                    <li>30 Investitionen mit verschiedenen Finanzierungstypen</li>
                    <li>~500+ Cashflows über 2026</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Demo-Login Zugänge:</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-muted p-3 rounded">
                    <div className="col-span-2 font-bold text-red-600">admin@demo.de</div>
                    <div className="col-span-2">demo</div>
                    <div>vr@demo.de</div>
                    <div>demo</div>
                    <div>cfo@demo.de</div>
                    <div>demo</div>
                    <div>gf@demo.de</div>
                    <div>demo</div>
                    <div>cm@demo.de</div>
                    <div>demo</div>
                    <div>buchhaltung@demo.de</div>
                    <div>demo</div>
                  </div>
                </div>

                {error && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <Button
                  onClick={handleSeed}
                  disabled={isSeeding}
                  className="w-full"
                  size="lg"
                >
                  {isSeeding ? 'Generiere Daten...' : 'Mock-Daten generieren'}
                </Button>
              </>
            ) : (
              <>
                <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-green-600 text-2xl">✓</div>
                    <div>
                      <h3 className="font-semibold text-green-900">
                        Daten erfolgreich generiert!
                      </h3>
                      <p className="text-sm text-green-700 mt-1">
                        Die Datenbank wurde mit Mock-Daten gefüllt.
                      </p>
                    </div>
                  </div>
                </div>

                {stats && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted p-3 rounded">
                      <div className="text-2xl font-bold">{stats.groups}</div>
                      <div className="text-sm text-muted-foreground">Gruppen</div>
                    </div>
                    <div className="bg-muted p-3 rounded">
                      <div className="text-2xl font-bold">{stats.companies}</div>
                      <div className="text-sm text-muted-foreground">Unternehmen</div>
                    </div>
                    <div className="bg-muted p-3 rounded">
                      <div className="text-2xl font-bold">{stats.users}</div>
                      <div className="text-sm text-muted-foreground">Benutzer</div>
                    </div>
                    <div className="bg-muted p-3 rounded">
                      <div className="text-2xl font-bold">{stats.investments}</div>
                      <div className="text-sm text-muted-foreground">Investitionen</div>
                    </div>
                    <div className="bg-muted p-3 rounded col-span-2">
                      <div className="text-2xl font-bold">{stats.cashflows}</div>
                      <div className="text-sm text-muted-foreground">Cashflows</div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => router.push('/login')}
                    className="flex-1"
                    size="lg"
                  >
                    Zum Login
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="lg"
                  >
                    Daten zurücksetzen
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Hinweis</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-2">
            <p>
              • Alle Daten werden im Browser Local Storage gespeichert
            </p>
            <p>
              • Die Daten sind nur in diesem Browser verfügbar
            </p>
            <p>
              • Löschen Sie den Browser-Cache NICHT, sonst gehen die Daten verloren
            </p>
            <p>
              • Sie können diese Seite jederzeit aufrufen um neue Daten zu generieren
            </p>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
          >
            ← Zurück zur Startseite
          </Button>
        </div>
      </div>
    </div>
  );
}
