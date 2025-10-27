'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileCheck, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function QuickActionsWidget() {
  const router = useRouter();

  const actions = [
    {
      icon: Plus,
      label: 'Neue Investition erstellen',
      description: 'Investitionsantrag anlegen',
      onClick: () => router.push('/investments/new'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: FileCheck,
      label: 'Cashflows bestätigen',
      description: 'Ausstehende Bestätigungen',
      onClick: () => router.push('/cashflows'),
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: DollarSign,
      label: 'Investitionen prüfen',
      description: 'Übersicht anzeigen',
      onClick: () => router.push('/investments'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schnellzugriff</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start h-auto py-4"
              onClick={action.onClick}
            >
              <div className={`p-2 rounded-lg ${action.bgColor} mr-4`}>
                <action.icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <div className="text-left flex-1">
                <div className="font-medium">{action.label}</div>
                <div className="text-xs text-muted-foreground">
                  {action.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
