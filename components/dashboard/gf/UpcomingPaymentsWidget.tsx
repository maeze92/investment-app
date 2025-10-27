'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cashflow } from '@/types/entities';
import { formatCurrency } from '@/lib/utils/dashboardHelpers';
import { formatDate } from '@/lib/utils/dateRangeHelpers';
import { Calendar } from 'lucide-react';

export interface UpcomingPaymentsWidgetProps {
  cashflows: Cashflow[];
}

export function UpcomingPaymentsWidget({ cashflows }: UpcomingPaymentsWidgetProps) {
  // Sort by due date
  const sortedCashflows = [...cashflows]
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'geplant':
        return 'bg-gray-100 text-gray-800';
      case 'ausstehend':
        return 'bg-yellow-100 text-yellow-800';
      case 'vorbestaetigt':
        return 'bg-blue-100 text-blue-800';
      case 'bestaetigt':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'geplant':
        return 'Geplant';
      case 'ausstehend':
        return 'Ausstehend';
      case 'vorbestaetigt':
        return 'Vorbestätigt';
      case 'bestaetigt':
        return 'Bestätigt';
      case 'verschoben':
        return 'Verschoben';
      case 'storniert':
        return 'Storniert';
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Anstehende Zahlungen (90 Tage)</CardTitle>
        <Calendar className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {sortedCashflows.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              Keine anstehenden Zahlungen
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedCashflows.map((cf) => (
              <div
                key={cf.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium">{formatCurrency(cf.amount)}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Fällig: {formatDate(new Date(cf.due_date))}
                  </div>
                </div>
                <Badge className={getStatusColor(cf.status)}>
                  {getStatusLabel(cf.status)}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
