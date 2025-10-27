'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cashflow } from '@/types/entities';
import { Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/dashboardHelpers';

export interface MonthlyStatusWidgetProps {
  cashflows: Cashflow[];
  month: number;
  year: number;
}

export function MonthlyStatusWidget({ cashflows, month, year }: MonthlyStatusWidgetProps) {
  const monthlyCashflows = cashflows.filter(
    (cf) => cf.month === month && cf.year === year
  );

  const pending = monthlyCashflows.filter((cf) => cf.status === 'ausstehend');
  const preconfirmed = monthlyCashflows.filter((cf) => cf.status === 'vorbestaetigt');
  const confirmed = monthlyCashflows.filter((cf) => cf.status === 'bestaetigt');
  const postponed = monthlyCashflows.filter((cf) => cf.status === 'verschoben');

  const pendingAmount = pending.reduce((sum, cf) => sum + cf.amount, 0);
  const preconfirmedAmount = preconfirmed.reduce((sum, cf) => sum + cf.amount, 0);
  const confirmedAmount = confirmed.reduce((sum, cf) => sum + cf.amount, 0);

  const monthName = new Date(year, month - 1).toLocaleDateString('de-DE', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Status für {monthName}</CardTitle>
        <Calendar className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Pending */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50">
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Ausstehend
              </div>
              <div className="text-2xl font-bold">{pending.length}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">{formatCurrency(pendingAmount)}</div>
            </div>
          </div>

          {/* Pre-confirmed */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Vorbestätigt
              </div>
              <div className="text-2xl font-bold">{preconfirmed.length}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">{formatCurrency(preconfirmedAmount)}</div>
            </div>
          </div>

          {/* Confirmed */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Bestätigt
              </div>
              <div className="text-2xl font-bold">{confirmed.length}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">{formatCurrency(confirmedAmount)}</div>
            </div>
          </div>

          {/* Postponed */}
          {postponed.length > 0 && (
            <div className="flex items-center justify-between p-4 border rounded-lg bg-orange-50">
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Verschoben
                </div>
                <div className="text-2xl font-bold">{postponed.length}</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
