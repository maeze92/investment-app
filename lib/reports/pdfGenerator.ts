import { jsPDF } from 'jspdf';
import { Investment, Cashflow, Company } from '@/types/entities';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  INVESTMENT_STATUS_NAMES,
  CASHFLOW_STATUS_NAMES,
  CATEGORY_NAMES,
  FINANCING_TYPE_NAMES,
} from '@/types/enums';

/**
 * PDF Report Generator
 * Uses jsPDF to create PDF reports
 */

export function generateInvestmentPDF(
  investment: Investment,
  cashflows: Cashflow[],
  company: Company
): jsPDF {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text('Investitionsbericht', 20, 20);

  // Company
  doc.setFontSize(12);
  doc.text(`Unternehmen: ${company.name}`, 20, 35);

  // Investment Details
  doc.setFontSize(14);
  doc.text('Investment Details', 20, 50);

  doc.setFontSize(10);
  let y = 60;
  doc.text(`Name: ${investment.name}`, 20, y);
  y += 7;
  doc.text(`Kategorie: ${CATEGORY_NAMES[investment.category]}`, 20, y);
  y += 7;
  doc.text(
    `Finanzierung: ${FINANCING_TYPE_NAMES[investment.financing_type]}`,
    20,
    y
  );
  y += 7;
  doc.text(`Betrag: ${formatCurrency(investment.total_amount)}`, 20, y);
  y += 7;
  doc.text(`Status: ${INVESTMENT_STATUS_NAMES[investment.status]}`, 20, y);
  y += 7;
  doc.text(`Erstellt am: ${formatDate(investment.created_at)}`, 20, y);

  // Cashflows
  y += 15;
  doc.setFontSize(14);
  doc.text('Zahlungsplan', 20, y);

  y += 10;
  doc.setFontSize(9);
  doc.text('Datum', 20, y);
  doc.text('Betrag', 70, y);
  doc.text('Typ', 120, y);
  doc.text('Status', 160, y);

  y += 5;
  cashflows.forEach((cf) => {
    doc.text(formatDate(cf.due_date), 20, y);
    doc.text(formatCurrency(cf.amount), 70, y);
    doc.text(cf.type, 120, y);
    doc.text(CASHFLOW_STATUS_NAMES[cf.status], 160, y);
    y += 7;

    // New page if needed
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  // Footer
  doc.setFontSize(8);
  doc.text(
    `Erstellt am: ${new Date().toLocaleString('de-DE')}`,
    20,
    doc.internal.pageSize.height - 10
  );

  return doc;
}

export function downloadPDF(doc: jsPDF, filename: string) {
  doc.save(`${filename}.pdf`);
}
