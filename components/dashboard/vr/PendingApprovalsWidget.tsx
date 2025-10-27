'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Investment } from '@/types/entities';
import { formatCurrency } from '@/lib/utils/dashboardHelpers';
import { Clock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface PendingApprovalsWidgetProps {
  investments: Investment[];
  companies: { id: string; name: string }[];
}

export function PendingApprovalsWidget({ investments, companies }: PendingApprovalsWidgetProps) {
  const router = useRouter();

  const pendingInvestments = investments
    .filter((inv) => inv.status === 'zur_genehmigung')
    .slice(0, 5);

  const getCompanyName = (companyId: string) => {
    return companies.find((c) => c.id === companyId)?.name || 'Unbekannt';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Ausstehende Genehmigungen</CardTitle>
        <Clock className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {pendingInvestments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              Keine ausstehenden Genehmigungen
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingInvestments.map((inv) => (
              <div
                key={inv.id}
                className="flex items-start justify-between p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                onClick={() => router.push(`/investments/${inv.id}`)}
              >
                <div className="flex-1">
                  <div className="font-medium">{inv.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {getCompanyName(inv.company_id)}
                  </div>
                  <div className="text-sm font-semibold mt-2">
                    {formatCurrency(inv.total_amount)}
                  </div>
                </div>
                <Badge variant="outline" className="ml-2">
                  {inv.category}
                </Badge>
              </div>
            ))}

            {investments.filter((inv) => inv.status === 'zur_genehmigung').length > 5 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/approvals')}
              >
                Alle anzeigen
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
