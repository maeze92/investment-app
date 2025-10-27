import { Cashflow, PaymentStructure, Investment } from '@/types/entities';
import { CashflowStatus, CashflowType, UUID } from '@/types/enums';
import { addMonths, getMonthYear, calculateNextDueDate, parseDate } from './dateHelpers';
import { generateUUID } from '@/lib/utils';

/**
 * Cashflow Calculator
 * Calculates individual cashflows based on payment structure
 */

interface CashflowInput {
  investment_id: UUID;
  due_date: Date;
  custom_due_date?: Date;
  amount: number;
  type: CashflowType;
  period_number?: number;
  total_periods?: number;
  auto_confirmed: boolean;
  status: CashflowStatus;
}

/**
 * Create a cashflow object from input
 */
export function createCashflow(input: CashflowInput): Omit<Cashflow, 'id'> {
  const effectiveDate = input.custom_due_date || input.due_date;
  const { month, year } = getMonthYear(effectiveDate);

  return {
    investment_id: input.investment_id,
    due_date: input.due_date,
    custom_due_date: input.custom_due_date,
    amount: input.amount,
    type: input.type,
    period_number: input.period_number,
    total_periods: input.total_periods,
    month,
    year,
    status: input.status,
    auto_confirmed: input.auto_confirmed,
  };
}

/**
 * Calculate cashflows for Kauf (Single Payment)
 */
export function calculateKaufCashflows(
  investmentId: UUID,
  paymentStructure: PaymentStructure,
  status: CashflowStatus = 'geplant'
): Omit<Cashflow, 'id'>[] {
  if (!paymentStructure.einmalzahlung) {
    throw new Error('Einmalzahlung structure is required for Kauf');
  }

  const { date, amount, custom_due_date } = paymentStructure.einmalzahlung;
  const dueDate = parseDate(date);

  return [
    createCashflow({
      investment_id: investmentId,
      due_date: dueDate,
      custom_due_date: custom_due_date ? parseDate(custom_due_date) : undefined,
      amount,
      type: 'einmalzahlung',
      auto_confirmed: false,
      status,
    }),
  ];
}

/**
 * Calculate cashflows for Leasing/Miete
 */
export function calculateLeasingCashflows(
  investmentId: UUID,
  paymentStructure: PaymentStructure,
  status: CashflowStatus = 'geplant'
): Omit<Cashflow, 'id'>[] {
  if (!paymentStructure.leasing) {
    throw new Error('Leasing structure is required');
  }

  const {
    anzahlung,
    anzahlung_date,
    monthly_rate,
    duration_months,
    start_month,
    schlussrate,
    auto_confirm,
  } = paymentStructure.leasing;

  const cashflows: Omit<Cashflow, 'id'>[] = [];
  const startDate = parseDate(start_month);

  // Anzahlung (if exists)
  if (anzahlung && anzahlung > 0 && anzahlung_date) {
    cashflows.push(
      createCashflow({
        investment_id: investmentId,
        due_date: parseDate(anzahlung_date),
        amount: anzahlung,
        type: 'anzahlung',
        auto_confirmed: false,
        status,
      })
    );
  }

  // Monthly rates
  for (let i = 0; i < duration_months; i++) {
    const dueDate = addMonths(startDate, i);

    cashflows.push(
      createCashflow({
        investment_id: investmentId,
        due_date: dueDate,
        amount: monthly_rate,
        type: 'rate',
        period_number: i + 1,
        total_periods: duration_months,
        auto_confirmed: auto_confirm ?? true,
        status,
      })
    );
  }

  // Schlussrate (if exists)
  if (schlussrate && schlussrate > 0) {
    const schlussrateDueDate = addMonths(startDate, duration_months);

    cashflows.push(
      createCashflow({
        investment_id: investmentId,
        due_date: schlussrateDueDate,
        amount: schlussrate,
        type: 'schlussrate',
        auto_confirmed: false,
        status,
      })
    );
  }

  return cashflows;
}

/**
 * Calculate cashflows for Ratenzahlung
 */
export function calculateRatenzahlungCashflows(
  investmentId: UUID,
  paymentStructure: PaymentStructure,
  status: CashflowStatus = 'geplant'
): Omit<Cashflow, 'id'>[] {
  if (!paymentStructure.ratenzahlung) {
    throw new Error('Ratenzahlung structure is required');
  }

  const {
    anzahlung,
    anzahlung_date,
    anzahlung_custom_due,
    number_of_rates,
    rate_amount,
    rate_interval,
    first_rate_date,
    rates_custom_due_dates,
    schlussrate,
    schlussrate_date,
    schlussrate_custom_due,
  } = paymentStructure.ratenzahlung;

  const cashflows: Omit<Cashflow, 'id'>[] = [];
  const firstRateDate = parseDate(first_rate_date);

  // Anzahlung (if exists)
  if (anzahlung && anzahlung > 0 && anzahlung_date) {
    cashflows.push(
      createCashflow({
        investment_id: investmentId,
        due_date: parseDate(anzahlung_date),
        custom_due_date: anzahlung_custom_due ? parseDate(anzahlung_custom_due) : undefined,
        amount: anzahlung,
        type: 'anzahlung',
        auto_confirmed: false,
        status,
      })
    );
  }

  // Rates
  for (let i = 0; i < number_of_rates; i++) {
    const dueDate = calculateNextDueDate(firstRateDate, i, rate_interval);
    const customDueDate =
      rates_custom_due_dates && rates_custom_due_dates[i]
        ? parseDate(rates_custom_due_dates[i])
        : undefined;

    cashflows.push(
      createCashflow({
        investment_id: investmentId,
        due_date: dueDate,
        custom_due_date: customDueDate,
        amount: rate_amount,
        type: 'rate',
        period_number: i + 1,
        total_periods: number_of_rates,
        auto_confirmed: false,
        status,
      })
    );
  }

  // Schlussrate (if exists)
  if (schlussrate && schlussrate > 0 && schlussrate_date) {
    cashflows.push(
      createCashflow({
        investment_id: investmentId,
        due_date: parseDate(schlussrate_date),
        custom_due_date: schlussrate_custom_due
          ? parseDate(schlussrate_custom_due)
          : undefined,
        amount: schlussrate,
        type: 'schlussrate',
        auto_confirmed: false,
        status,
      })
    );
  }

  return cashflows;
}

/**
 * Validate that cashflows sum matches the total investment amount
 * (with tolerance for rounding)
 */
export function validateCashflowSum(
  cashflows: Omit<Cashflow, 'id'>[],
  expectedTotal: number,
  tolerancePercent: number = 1
): { valid: boolean; actualTotal: number; difference: number } {
  const actualTotal = cashflows.reduce((sum, cf) => sum + cf.amount, 0);
  const difference = Math.abs(actualTotal - expectedTotal);
  const tolerance = expectedTotal * (tolerancePercent / 100);

  return {
    valid: difference <= tolerance,
    actualTotal,
    difference,
  };
}
