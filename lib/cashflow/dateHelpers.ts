/**
 * Date Helper Functions for Cashflow Calculations
 */

/**
 * Add months to a date
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Get month and year from a date
 */
export function getMonthYear(date: Date): { month: number; year: number } {
  return {
    month: date.getMonth() + 1, // 1-12
    year: date.getFullYear(),
  };
}

/**
 * Calculate the due date for a payment based on interval
 */
export function calculateNextDueDate(
  startDate: Date,
  periodNumber: number,
  interval: 'monthly' | 'quarterly' | 'yearly'
): Date {
  switch (interval) {
    case 'monthly':
      return addMonths(startDate, periodNumber);
    case 'quarterly':
      return addMonths(startDate, periodNumber * 3);
    case 'yearly':
      return addMonths(startDate, periodNumber * 12);
    default:
      return startDate;
  }
}

/**
 * Get the first day of the month for a given date
 */
export function getFirstDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Get the last day of the month for a given date
 */
export function getLastDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * Check if two dates are in the same month
 */
export function isSameMonth(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
}

/**
 * Format date as ISO string (YYYY-MM-DD)
 */
export function toISODateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Parse date from various formats
 */
export function parseDate(dateInput: Date | string): Date {
  if (dateInput instanceof Date) {
    return dateInput;
  }
  return new Date(dateInput);
}

/**
 * Ensure date is not in the past (use today as minimum)
 */
export function ensureNotPast(date: Date): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date < today) {
    return today;
  }

  return date;
}
