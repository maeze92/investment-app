import { Cashflow, Investment, Company } from '@/types/entities';
import { formatDate } from '@/lib/utils';
import { CASHFLOW_STATUS_NAMES } from '@/types/enums';

/**
 * CSV Export Generator
 * For booking journal and other CSV exports
 */

export function generateBookingJournalCSV(
  cashflows: Cashflow[],
  investments: Investment[],
  companies: Company[]
): string {
  // Filter only confirmed cashflows
  const confirmedCashflows = cashflows.filter((cf) => cf.status === 'bestaetigt');

  // CSV Header
  const header = [
    'Datum',
    'Unternehmen',
    'Investment',
    'Betrag',
    'Typ',
    'Status',
    'Referenz',
  ].join(';');

  // CSV Rows
  const rows = confirmedCashflows.map((cf) => {
    const investment = investments.find((inv) => inv.id === cf.investment_id);
    const company = companies.find((c) => c.id === investment?.company_id);

    return [
      formatDate(cf.due_date),
      company?.name || '-',
      investment?.name || '-',
      cf.amount.toFixed(2),
      cf.type,
      CASHFLOW_STATUS_NAMES[cf.status],
      cf.accounting_reference || '-',
    ].join(';');
  });

  return [header, ...rows].join('\n');
}

export function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
