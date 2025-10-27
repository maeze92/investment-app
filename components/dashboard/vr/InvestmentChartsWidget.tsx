'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Investment } from '@/types/entities';
import { MiniChart } from '@/components/dashboard/shared/MiniChart';
import {
  groupInvestmentsByStatus,
  groupInvestmentsByCategory,
  getMonthlyInvestmentTrend,
} from '@/lib/utils/chartHelpers';
import { getLast12Months } from '@/lib/utils/dateRangeHelpers';

export interface InvestmentChartsWidgetProps {
  investments: Investment[];
}

export function InvestmentChartsWidget({ investments }: InvestmentChartsWidgetProps) {
  const statusData = groupInvestmentsByStatus(investments);
  const categoryData = groupInvestmentsByCategory(investments);
  const trendData = getMonthlyInvestmentTrend(investments, getLast12Months());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investitionsübersicht</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="status" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="category">Kategorie</TabsTrigger>
            <TabsTrigger value="trend">Trend</TabsTrigger>
          </TabsList>

          <TabsContent value="status">
            <div className="mt-4">
              <MiniChart
                type="pie"
                data={statusData}
                dataKey="value"
                nameKey="name"
                height={300}
              />
            </div>
          </TabsContent>

          <TabsContent value="category">
            <div className="mt-4">
              <MiniChart
                type="bar"
                data={categoryData}
                dataKey="value"
                nameKey="name"
                height={300}
              />
            </div>
          </TabsContent>

          <TabsContent value="trend">
            <div className="mt-4">
              <MiniChart
                type="line"
                data={trendData}
                dataKey="value"
                nameKey="name"
                height={300}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
