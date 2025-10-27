import { Investment, Cashflow } from '@/types/entities';
import { InvestmentStatus, InvestmentCategory, FinancingType, CashflowStatus } from '@/types/enums';

/**
 * Chart Data Formatting Helpers
 */

export interface ChartDataPoint {
  name: string;
  value?: number;
  [key: string]: string | number | undefined;
}

/**
 * Group investments by status for pie/bar charts
 */
export function groupInvestmentsByStatus(investments: Investment[]): ChartDataPoint[] {
  const statusMap = new Map<InvestmentStatus, number>();

  investments.forEach((inv) => {
    const current = statusMap.get(inv.status) || 0;
    statusMap.set(inv.status, current + 1);
  });

  const statusLabels: Record<InvestmentStatus, string> = {
    entwurf: 'Entwurf',
    zur_genehmigung: 'Zur Genehmigung',
    genehmigt: 'Genehmigt',
    abgelehnt: 'Abgelehnt',
    aktiv: 'Aktiv',
    abgeschlossen: 'Abgeschlossen',
  };

  return Array.from(statusMap.entries()).map(([status, count]) => ({
    name: statusLabels[status],
    value: count,
  }));
}

/**
 * Group investments by category for pie/bar charts
 */
export function groupInvestmentsByCategory(investments: Investment[]): ChartDataPoint[] {
  const categoryMap = new Map<InvestmentCategory, number>();

  investments.forEach((inv) => {
    const current = categoryMap.get(inv.category) || 0;
    categoryMap.set(inv.category, current + inv.total_amount);
  });

  const categoryLabels: Record<InvestmentCategory, string> = {
    fahrzeuge: 'Fahrzeuge',
    it: 'IT',
    maschinen: 'Maschinen',
    immobilien: 'Immobilien',
    sonstige: 'Sonstige',
  };

  return Array.from(categoryMap.entries()).map(([category, amount]) => ({
    name: categoryLabels[category],
    value: amount,
  }));
}

/**
 * Group investments by financing type
 */
export function groupInvestmentsByFinancingType(investments: Investment[]): ChartDataPoint[] {
  const typeMap = new Map<FinancingType, number>();

  investments.forEach((inv) => {
    const current = typeMap.get(inv.financing_type) || 0;
    typeMap.set(inv.financing_type, current + inv.total_amount);
  });

  const typeLabels: Record<FinancingType, string> = {
    kauf: 'Kauf',
    leasing: 'Leasing',
    ratenzahlung: 'Ratenzahlung',
    miete: 'Miete',
  };

  return Array.from(typeMap.entries()).map(([type, amount]) => ({
    name: typeLabels[type],
    value: amount,
  }));
}

/**
 * Group investments by company
 */
export function groupInvestmentsByCompany(
  investments: Investment[],
  companies: { id: string; name: string }[]
): ChartDataPoint[] {
  const companyMap = new Map<string, number>();

  investments.forEach((inv) => {
    const current = companyMap.get(inv.company_id) || 0;
    companyMap.set(inv.company_id, current + inv.total_amount);
  });

  return Array.from(companyMap.entries()).map(([companyId, amount]) => {
    const company = companies.find((c) => c.id === companyId);
    return {
      name: company?.name || 'Unbekannt',
      value: amount,
    };
  });
}

/**
 * Get monthly investment trend (last N months)
 */
export function getMonthlyInvestmentTrend(
  investments: Investment[],
  months: { month: number; year: number; label: string }[]
): ChartDataPoint[] {
  return months.map(({ month, year, label }) => {
    const monthlyInvestments = investments.filter((inv) => {
      const invDate = new Date(inv.start_date);
      return invDate.getMonth() + 1 === month && invDate.getFullYear() === year;
    });

    const totalAmount = monthlyInvestments.reduce((sum, inv) => sum + inv.total_amount, 0);
    const count = monthlyInvestments.length;

    return {
      name: label,
      value: totalAmount,
      count,
    };
  });
}

/**
 * Get monthly cashflow forecast
 */
export function getMonthlyCashflowForecast(
  cashflows: Cashflow[],
  months: { month: number; year: number; label: string }[]
): ChartDataPoint[] {
  return months.map(({ month, year, label }) => {
    const monthlyCashflows = cashflows.filter(
      (cf) => cf.month === month && cf.year === year
    );

    const planned = monthlyCashflows
      .filter((cf) => cf.status === 'geplant')
      .reduce((sum, cf) => sum + cf.amount, 0);

    const pending = monthlyCashflows
      .filter((cf) => cf.status === 'ausstehend')
      .reduce((sum, cf) => sum + cf.amount, 0);

    const confirmed = monthlyCashflows
      .filter((cf) => cf.status === 'bestaetigt')
      .reduce((sum, cf) => sum + cf.amount, 0);

    return {
      name: label,
      geplant: planned,
      ausstehend: pending,
      bestaetigt: confirmed,
      total: planned + pending + confirmed,
    };
  });
}

/**
 * Group cashflows by status
 */
export function groupCashflowsByStatus(cashflows: Cashflow[]): ChartDataPoint[] {
  const statusMap = new Map<CashflowStatus, number>();

  cashflows.forEach((cf) => {
    const current = statusMap.get(cf.status) || 0;
    statusMap.set(cf.status, current + cf.amount);
  });

  const statusLabels: Record<CashflowStatus, string> = {
    geplant: 'Geplant',
    ausstehend: 'Ausstehend',
    vorbestaetigt: 'Vorbestätigt',
    bestaetigt: 'Bestätigt',
    verschoben: 'Verschoben',
    storniert: 'Storniert',
  };

  return Array.from(statusMap.entries()).map(([status, amount]) => ({
    name: statusLabels[status],
    value: amount,
  }));
}

/**
 * Format currency for charts
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format large numbers with K/M suffixes
 */
export function formatCompactNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M €`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K €`;
  }
  return `${value} €`;
}
