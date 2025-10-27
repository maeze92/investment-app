'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Investment, Company } from '@/types/entities';
import { MiniChart } from '@/components/dashboard/shared/MiniChart';
import { groupInvestmentsByCompany } from '@/lib/utils/chartHelpers';
import { Building2 } from 'lucide-react';

export interface CompanyComparisonWidgetProps {
  investments: Investment[];
  companies: Company[];
}

export function CompanyComparisonWidget({
  investments,
  companies,
}: CompanyComparisonWidgetProps) {
  const companyData = groupInvestmentsByCompany(investments, companies);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Investitionen nach Unternehmen</CardTitle>
        <Building2 className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <MiniChart
          type="bar"
          data={companyData}
          dataKey="value"
          nameKey="name"
          height={300}
        />
      </CardContent>
    </Card>
  );
}
