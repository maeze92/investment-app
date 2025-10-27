import { Investment, Cashflow } from '@/types/entities';
import { CashflowStatus, FinancingType } from '@/types/enums';
import {
  calculateKaufCashflows,
  calculateLeasingCashflows,
  calculateRatenzahlungCashflows,
  validateCashflowSum,
} from './cashflowCalculator';

/**
 * Cashflow Generator Service
 * Main service for generating cashflows from investments
 */

export interface GenerateCashflowsResult {
  cashflows: Omit<Cashflow, 'id'>[];
  validation: {
    valid: boolean;
    actualTotal: number;
    expectedTotal: number;
    difference: number;
  };
  errors: string[];
}

/**
 * Generate cashflows for an investment based on its payment structure
 */
export function generateCashflowsForInvestment(
  investment: Investment
): GenerateCashflowsResult {
  const errors: string[] = [];
  let cashflows: Omit<Cashflow, 'id'>[] = [];

  // Determine initial status based on investment status
  const initialStatus: CashflowStatus =
    investment.status === 'entwurf' ? 'geplant' : 'ausstehend';

  try {
    // Generate cashflows based on financing type
    switch (investment.financing_type) {
      case 'kauf':
        cashflows = calculateKaufCashflows(
          investment.id,
          investment.payment_structure,
          initialStatus
        );
        break;

      case 'leasing':
      case 'miete':
        cashflows = calculateLeasingCashflows(
          investment.id,
          investment.payment_structure,
          initialStatus
        );
        break;

      case 'ratenzahlung':
        cashflows = calculateRatenzahlungCashflows(
          investment.id,
          investment.payment_structure,
          initialStatus
        );
        break;

      default:
        errors.push(`Unbekannter Finanzierungstyp: ${investment.financing_type}`);
        return {
          cashflows: [],
          validation: {
            valid: false,
            actualTotal: 0,
            expectedTotal: investment.total_amount,
            difference: investment.total_amount,
          },
          errors,
        };
    }

    // Validate that cashflows sum matches investment amount
    const validation = validateCashflowSum(cashflows, investment.total_amount);

    if (!validation.valid) {
      errors.push(
        `Cashflow-Summe (${validation.actualTotal}€) stimmt nicht mit Investitionsbetrag (${investment.total_amount}€) überein. Differenz: ${validation.difference}€`
      );
    }

    return {
      cashflows,
      validation: {
        ...validation,
        expectedTotal: investment.total_amount,
      },
      errors,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
    errors.push(`Fehler bei Cashflow-Generierung: ${errorMessage}`);

    return {
      cashflows: [],
      validation: {
        valid: false,
        actualTotal: 0,
        expectedTotal: investment.total_amount,
        difference: investment.total_amount,
      },
      errors,
    };
  }
}

/**
 * Regenerate cashflows for an investment
 * (useful when investment is edited)
 */
export function regenerateCashflows(
  investment: Investment,
  deleteExisting: boolean = true
): GenerateCashflowsResult {
  // Generate new cashflows
  const result = generateCashflowsForInvestment(investment);

  if (deleteExisting) {
    // Note: Actual deletion would be handled by the service layer
    // This function just generates the new cashflows
  }

  return result;
}

/**
 * Preview cashflows before creating an investment
 * (useful for the summary step in the wizard)
 */
export function previewCashflows(
  financingType: FinancingType,
  paymentStructure: any,
  totalAmount: number
): GenerateCashflowsResult {
  // Create a temporary investment object for preview
  const tempInvestment: Partial<Investment> = {
    id: 'preview',
    financing_type: financingType,
    payment_structure: paymentStructure,
    total_amount: totalAmount,
    status: 'entwurf',
  };

  return generateCashflowsForInvestment(tempInvestment as Investment);
}

/**
 * Get cashflow statistics
 */
export function getCashflowStatistics(cashflows: Omit<Cashflow, 'id'>[]) {
  const total = cashflows.reduce((sum, cf) => sum + cf.amount, 0);
  const byType = cashflows.reduce((acc, cf) => {
    acc[cf.type] = (acc[cf.type] || 0) + cf.amount;
    return acc;
  }, {} as Record<string, number>);

  const byMonth = cashflows.reduce((acc, cf) => {
    const key = `${cf.year}-${String(cf.month).padStart(2, '0')}`;
    acc[key] = (acc[key] || 0) + cf.amount;
    return acc;
  }, {} as Record<string, number>);

  return {
    count: cashflows.length,
    total,
    byType,
    byMonth,
    firstPayment: cashflows.length > 0 ? cashflows[0].due_date : null,
    lastPayment:
      cashflows.length > 0 ? cashflows[cashflows.length - 1].due_date : null,
  };
}
