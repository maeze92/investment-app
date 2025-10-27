'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cashflow, Investment } from '@/types/entities';
import { formatCurrency } from '@/lib/utils/dashboardHelpers';
import { formatDate } from '@/lib/utils/dateRangeHelpers';
import { CheckCircle } from 'lucide-react';

export interface ConfirmedPaymentsWidgetProps {
  cashflows: Cashflow[];
  investments: Investment[];
  companies: { id: string; name: string }[];
}

export function ConfirmedPaymentsWidget({
  cashflows,
  investments,
  companies,
}: ConfirmedPaymentsWidgetProps) {
  const confirmedCashflows = cashflows
    .filter((cf) => cf.status === 'bestaetigt')
    .sort((a, b) => new Date(b.due_date).getTime() - new Date(a.due_date).getTime())
    .slice(0, 10);

  const getInvestmentName = (investmentId: string) => {
    return investments.find((inv) => inv.id === investmentId)?.name || 'Unbekannt';
  };

  const getCompanyName = (investmentId: string) => {
    const investment = investments.find((inv) => inv.id === investmentId);
    if (!investment) return 'Unbekannt';
    return companies.find((c) => c.id === investment.company_id)?.name || 'Unbekannt';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Bestätigte Zahlungen (Bereit zur Buchung)</CardTitle>
        <CheckCircle className="w-5 h-5 text-green-600" />
      </CardHeader>
      <CardContent>
        {confirmedCashflows.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              Keine bestätigten Zahlungen vorhanden
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {confirmedCashflows.map((cf) => (
              <div
                key={cf.id}
                className="flex items-start justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium">{formatCurrency(cf.amount)}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {getInvestmentName(cf.investment_id)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {getCompanyName(cf.investment_id)} • Fällig: {formatDate(new Date(cf.due_date))}
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 ml-2">
                  Bestätigt
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
