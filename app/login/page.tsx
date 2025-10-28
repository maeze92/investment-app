'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/useAuthStore';
import { useStorageStatus } from '@/hooks/useStorageStatus';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const error = useAuthStore((state) => state.error);
  const isLoading = useAuthStore((state) => state.isLoading);
  const { isEmpty, isLoading: checkingStorage, userCount } = useStorageStatus();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      // Error is handled by the store
      console.error('Login failed:', err);
    }
  };

  const quickLogin = async (userEmail: string) => {
    setEmail(userEmail);
    setPassword('demo');

    try {
      await login(userEmail, 'demo');
      router.push('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  // Helper to get user-friendly error message
  const getErrorMessage = (errorMsg: string | null) => {
    if (!errorMsg) return null;

    if (errorMsg.includes('NO_DATA_FOUND') || errorMsg.includes('No users found')) {
      return {
        type: 'warning' as const,
        title: 'Keine Daten gefunden',
        message: 'Bitte generieren Sie zuerst Mock-Daten, um sich anmelden zu können.',
        action: (
          <Link href="/seed">
            <Button size="sm" className="mt-2">
              Zu Daten-Generator →
            </Button>
          </Link>
        ),
      };
    }

    if (errorMsg.includes('INVALID_CREDENTIALS') || errorMsg.includes('Invalid credentials')) {
      // Special handling for admin user - might indicate missing seed data
      if (email === 'admin@demo.de' || email.includes('@demo.de')) {
        return {
          type: 'warning' as const,
          title: 'Benutzer nicht gefunden',
          message: 'Dieser Demo-Benutzer existiert nicht in der Datenbank. Möglicherweise wurden die Mock-Daten noch nicht generiert.',
          action: (
            <Link href="/seed">
              <Button size="sm" className="mt-2 w-full">
                Jetzt Mock-Daten generieren →
              </Button>
            </Link>
          ),
        };
      }

      return {
        type: 'destructive' as const,
        title: 'Anmeldung fehlgeschlagen',
        message: 'Ungültige E-Mail oder Passwort. Bitte überprüfen Sie Ihre Eingaben.',
      };
    }

    return {
      type: 'destructive' as const,
      title: 'Fehler',
      message: errorMsg,
    };
  };

  const errorInfo = getErrorMessage(error);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Investitionsplanung</h1>
          <p className="mt-2 text-muted-foreground">
            Multi-Mandanten Investitionsplanungsplattform
          </p>
        </div>

        {/* Warning wenn keine Daten vorhanden */}
        {!checkingStorage && isEmpty && (
          <Alert variant="warning" className="border-2 border-orange-300">
            <AlertTitle className="text-lg font-bold">⚠️ Datenbank ist leer</AlertTitle>
            <AlertDescription>
              <p className="mb-3">
                Es wurden noch keine Mock-Daten generiert. Bitte klicken Sie auf den Button unten,
                um Testdaten (inkl. Admin-User) zu erstellen.
              </p>
              <Link href="/seed">
                <Button size="default" className="w-full bg-orange-500 hover:bg-orange-600">
                  ✨ Jetzt Mock-Daten generieren
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* Info wenn Daten vorhanden */}
        {!checkingStorage && !isEmpty && (
          <Alert variant="success">
            <AlertTitle>✓ Datenbank bereit</AlertTitle>
            <AlertDescription>
              {userCount} Benutzer geladen. Sie können sich jetzt anmelden.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Anmelden</CardTitle>
            <CardDescription>
              Geben Sie Ihre Zugangsdaten ein, um fortzufahren
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading || isEmpty}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Passwort</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading || isEmpty}
                />
              </div>

              {errorInfo && (
                <Alert variant={errorInfo.type}>
                  <AlertTitle>{errorInfo.title}</AlertTitle>
                  <AlertDescription>
                    {errorInfo.message}
                    {errorInfo.action}
                  </AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading || isEmpty}>
                {isLoading ? 'Anmelden...' : 'Anmelden'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Demo-Zugang</CardTitle>
            <CardDescription className="text-xs">
              Schnell-Login für verschiedene Rollen (Passwort: demo)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin('admin@demo.de')}
                disabled={isLoading || isEmpty}
                className="col-span-2 bg-red-50 hover:bg-red-100 border-red-200"
              >
                System Administrator
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin('vr@demo.de')}
                disabled={isLoading || isEmpty}
              >
                Verwaltungsrat
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin('cfo@demo.de')}
                disabled={isLoading || isEmpty}
              >
                CFO
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin('gf@demo.de')}
                disabled={isLoading || isEmpty}
              >
                Geschäftsführer
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin('cm@demo.de')}
                disabled={isLoading || isEmpty}
              >
                Cashflow Manager
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin('buchhaltung@demo.de')}
                disabled={isLoading || isEmpty}
                className="col-span-2"
              >
                Buchhaltung
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Local Development Version - Daten werden im Browser gespeichert
        </p>
      </div>
    </div>
  );
}
