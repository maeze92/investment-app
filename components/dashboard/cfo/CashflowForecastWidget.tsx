'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cashflow } from '@/types/entities';
import { MiniChart } from '@/components/dashboard/shared/MiniChart';
import { getMonthlyCashflowForecast } from '@/lib/utils/chartHelpers';
import { getNext12Months } from '@/lib/utils/dateRangeHelpers';
import { TrendingUp } from 'lucide-react';

export interface CashflowForecastWidgetProps {
  cashflows: Cashflow[];
}

export function CashflowForecastWidget({ cashflows }: CashflowForecastWidgetProps) {
  const forecastData = getMonthlyCashflowForecast(cashflows, getNext12Months());

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Cashflow-Prognose (12 Monate)</CardTitle>
        <TrendingUp className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <MiniChart
          type="line"
          data={forecastData}
          dataKey="total"
          nameKey="name"
          height={300}
        />
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-muted-foreground">Geplant</div>
            <div className="text-lg font-semibold text-gray-600">
              {forecastData.reduce((sum, d) => sum + (d.geplant as number), 0).toLocaleString('de-DE')} €
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Ausstehend</div>
            <div className="text-lg font-semibold text-yellow-600">
              {forecastData.reduce((sum, d) => sum + (d.ausstehend as number), 0).toLocaleString('de-DE')} €
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Bestätigt</div>
            <div className="text-lg font-semibold text-green-600">
              {forecastData.reduce((sum, d) => sum + (d.bestaetigt as number), 0).toLocaleString('de-DE')} €
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
