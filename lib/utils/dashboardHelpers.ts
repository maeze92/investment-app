import { Investment, Cashflow, Company } from '@/types/entities';
import { InvestmentStatus, CashflowStatus } from '@/types/enums';
import { isDateInRange, isOverdue, isDueSoon } from './dateRangeHelpers';

/**
 * Dashboard KPI Calculation Helpers
 */

/**
 * Calculate total investment value
 */
export function calculateTotalInvestmentValue(investments: Investment[]): number {
  return investments.reduce((sum, inv) => sum + inv.total_amount, 0);
}

/**
 * Calculate average investment size
 */
export function calculateAverageInvestmentSize(investments: Investment[]): number {
  if (investments.length === 0) return 0;
  return calculateTotalInvestmentValue(investments) / investments.length;
}

/**
 * Calculate investment count by status
 */
export function countInvestmentsByStatus(
  investments: Investment[],
  status: InvestmentStatus
): number {
  return investments.filter((inv) => inv.status === status).length;
}

/**
 * Calculate cashflow count by status
 */
export function countCashflowsByStatus(
  cashflows: Cashflow[],
  status: CashflowStatus
): number {
  return cashflows.filter((cf) => cf.status === status).length;
}

/**
 * Calculate total cashflow amount by status
 */
export function sumCashflowsByStatus(cashflows: Cashflow[], status: CashflowStatus): number {
  return cashflows
    .filter((cf) => cf.status === status)
    .reduce((sum, cf) => sum + cf.amount, 0);
}

/**
 * Get investments within date range
 */
export function filterInvestmentsByDateRange(
  investments: Investment[],
  startDate: Date,
  endDate: Date
): Investment[] {
  return investments.filter((inv) => {
    const invDate = new Date(inv.start_date);
    return isDateInRange(invDate, startDate, endDate);
  });
}

/**
 * Get cashflows within date range (by due date)
 */
export function filterCashflowsByDateRange(
  cashflows: Cashflow[],
  startDate: Date,
  endDate: Date
): Cashflow[] {
  return cashflows.filter((cf) => {
    const dueDate = new Date(cf.due_date);
    return isDateInRange(dueDate, startDate, endDate);
  });
}

/**
 * Get overdue cashflows
 */
export function getOverdueCashflows(cashflows: Cashflow[]): Cashflow[] {
  return cashflows.filter((cf) => {
    const dueDate = new Date(cf.due_date);
    return (
      isOverdue(dueDate) &&
      (cf.status === 'ausstehend' || cf.status === 'geplant' || cf.status === 'vorbestaetigt')
    );
  });
}

/**
 * Get cashflows due soon (next 7 days)
 */
export function getCashflowsDueSoon(cashflows: Cashflow[], days: number = 7): Cashflow[] {
  return cashflows.filter((cf) => {
    const dueDate = new Date(cf.due_date);
    return (
      isDueSoon(dueDate, days) &&
      (cf.status === 'ausstehend' || cf.status === 'geplant' || cf.status === 'vorbestaetigt')
    );
  });
}

/**
 * Calculate Leasing vs Kauf ratio
 */
export function calculateLeasingVsKaufRatio(investments: Investment[]): {
  leasing: number;
  kauf: number;
  ratio: string;
} {
  const leasingAmount = investments
    .filter((inv) => inv.financing_type === 'leasing' || inv.financing_type === 'miete')
    .reduce((sum, inv) => sum + inv.total_amount, 0);

  const kaufAmount = investments
    .filter((inv) => inv.financing_type === 'kauf' || inv.financing_type === 'ratenzahlung')
    .reduce((sum, inv) => sum + inv.total_amount, 0);

  const total = leasingAmount + kaufAmount;
  const ratio = total > 0 ? `${((leasingAmount / total) * 100).toFixed(0)}/${((kaufAmount / total) * 100).toFixed(0)}` : '0/0';

  return {
    leasing: leasingAmount,
    kauf: kaufAmount,
    ratio,
  };
}

/**
 * Filter investments by company
 */
export function filterInvestmentsByCompany(
  investments: Investment[],
  companyId: string
): Investment[] {
  return investments.filter((inv) => inv.company_id === companyId);
}

/**
 * Filter cashflows by company (through investment)
 */
export function filterCashflowsByCompany(
  cashflows: Cashflow[],
  investments: Investment[],
  companyId: string
): Cashflow[] {
  const companyInvestmentIds = investments
    .filter((inv) => inv.company_id === companyId)
    .map((inv) => inv.id);

  return cashflows.filter((cf) => companyInvestmentIds.includes(cf.investment_id));
}

/**
 * Calculate trend (percentage change)
 */
export function calculateTrend(current: number, previous: number): {
  value: number;
  direction: 'up' | 'down' | 'neutral';
} {
  if (previous === 0) {
    return { value: 0, direction: 'neutral' };
  }

  const percentChange = ((current - previous) / previous) * 100;

  return {
    value: Math.abs(percentChange),
    direction: percentChange > 0 ? 'up' : percentChange < 0 ? 'down' : 'neutral',
  };
}

/**
 * Get cashflows for current month
 */
export function getCurrentMonthCashflows(cashflows: Cashflow[]): Cashflow[] {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  return cashflows.filter((cf) => cf.month === currentMonth && cf.year === currentYear);
}

/**
 * Get investments for current year
 */
export function getCurrentYearInvestments(investments: Investment[]): Investment[] {
  const currentYear = new Date().getFullYear();

  return investments.filter((inv) => {
    const invYear = new Date(inv.start_date).getFullYear();
    return invYear === currentYear;
  });
}

/**
 * Format currency
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format compact currency (for large numbers)
 */
export function formatCompactCurrency(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M €`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K €`;
  }
  return formatCurrency(value);
}

/**
 * Calculate budget utilization percentage
 */
export function calculateBudgetUtilization(
  actual: number,
  planned: number
): { percentage: number; status: 'low' | 'medium' | 'high' | 'over' } {
  if (planned === 0) return { percentage: 0, status: 'low' };

  const percentage = (actual / planned) * 100;

  let status: 'low' | 'medium' | 'high' | 'over';
  if (percentage < 50) status = 'low';
  else if (percentage < 80) status = 'medium';
  else if (percentage < 100) status = 'high';
  else status = 'over';

  return { percentage, status };
}
