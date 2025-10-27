import * as XLSX from 'xlsx';
import { Investment, Cashflow, Company } from '@/types/entities';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  INVESTMENT_STATUS_NAMES,
  CASHFLOW_STATUS_NAMES,
  CATEGORY_NAMES,
  FINANCING_TYPE_NAMES,
} from '@/types/enums';

/**
 * Excel Report Generator
 * Uses xlsx library to generate Excel reports
 */

// Monthly Cashflow Report
export function generateMonthlyCashflowReport(
  cashflows: Cashflow[],
  investments: Investment[],
  companies: Company[],
  month: number,
  year: number
): XLSX.WorkBook {
  const workbook = XLSX.utils.book_new();

  // Filter cashflows for the specific month/year
  const filteredCashflows = cashflows.filter(
    (cf) => cf.month === month && cf.year === year
  );

  // Summary Sheet
  const summaryData = [
    ['Monatlicher Cashflow-Bericht'],
    ['Monat:', `${month}/${year}`],
    ['Erstellt am:', new Date().toLocaleString('de-DE')],
    [],
    ['Zusammenfassung'],
    ['Gesamt Cashflows:', filteredCashflows.length],
    [
      'Gesamtbetrag:',
      formatCurrency(
        filteredCashflows.reduce((sum, cf) => sum + cf.amount, 0)
      ),
    ],
    [],
    ['Nach Status:'],
  ];

  // Group by status
  const byStatus = filteredCashflows.reduce((acc, cf) => {
    acc[cf.status] = (acc[cf.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  Object.entries(byStatus).forEach(([status, count]) => {
    summaryData.push([CASHFLOW_STATUS_NAMES[status as keyof typeof CASHFLOW_STATUS_NAMES], count]);
  });

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Zusammenfassung');

  // Details Sheet
  const detailsData = filteredCashflows.map((cf) => {
    const investment = investments.find((inv) => inv.id === cf.investment_id);
    const company = companies.find((c) => c.id === investment?.company_id);

    return {
      Unternehmen: company?.name || '-',
      Investment: investment?.name || '-',
      Betrag: cf.amount,
      Fälligkeitsdatum: formatDate(cf.due_date),
      Status: CASHFLOW_STATUS_NAMES[cf.status],
      Typ: cf.type,
      'Bestätigt CM': cf.confirmed_by_cm ? 'Ja' : 'Nein',
      'Bestätigt GF': cf.confirmed_by_gf ? 'Ja' : 'Nein',
    };
  });

  const detailsSheet = XLSX.utils.json_to_sheet(detailsData);
  XLSX.utils.book_append_sheet(workbook, detailsSheet, 'Details');

  return workbook;
}

// Yearly Overview Report
export function generateYearlyOverviewReport(
  investments: Investment[],
  cashflows: Cashflow[],
  companies: Company[],
  year: number
): XLSX.WorkBook {
  const workbook = XLSX.utils.book_new();

  // Filter investments for the year
  const filteredInvestments = investments.filter(
    (inv) => new Date(inv.created_at).getFullYear() === year
  );

  // Summary Sheet
  const summaryData = [
    ['Jahresübersicht Investitionen'],
    ['Jahr:', year],
    ['Erstellt am:', new Date().toLocaleString('de-DE')],
    [],
    ['Zusammenfassung'],
    ['Gesamt Investitionen:', filteredInvestments.length],
    [
      'Gesamtbetrag:',
      formatCurrency(
        filteredInvestments.reduce((sum, inv) => sum + inv.total_amount, 0)
      ),
    ],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Zusammenfassung');

  // Investments Sheet
  const investmentsData = filteredInvestments.map((inv) => {
    const company = companies.find((c) => c.id === inv.company_id);

    return {
      Unternehmen: company?.name || '-',
      Name: inv.name,
      Kategorie: CATEGORY_NAMES[inv.category],
      Finanzierung: FINANCING_TYPE_NAMES[inv.financing_type],
      Betrag: inv.total_amount,
      Status: INVESTMENT_STATUS_NAMES[inv.status],
      'Erstellt am': formatDate(inv.created_at),
    };
  });

  const investmentsSheet = XLSX.utils.json_to_sheet(investmentsData);
  XLSX.utils.book_append_sheet(workbook, investmentsSheet, 'Investitionen');

  // Monthly Breakdown
  const monthlyData = [];
  for (let month = 1; month <= 12; month++) {
    const monthCashflows = cashflows.filter(
      (cf) => cf.month === month && cf.year === year
    );
    const amount = monthCashflows.reduce((sum, cf) => sum + cf.amount, 0);

    monthlyData.push({
      Monat: month,
      Anzahl: monthCashflows.length,
      Betrag: amount,
    });
  }

  const monthlySheet = XLSX.utils.json_to_sheet(monthlyData);
  XLSX.utils.book_append_sheet(workbook, monthlySheet, 'Monatlich');

  return workbook;
}

// Download helper
export function downloadWorkbook(workbook: XLSX.WorkBook, filename: string) {
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}
