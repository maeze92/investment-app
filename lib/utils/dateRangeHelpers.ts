/**
 * Date Range Helper Functions
 * Provides utilities for working with date ranges in dashboards
 */

export function getStartOfMonth(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getEndOfMonth(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

export function getStartOfYear(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), 0, 1);
}

export function getEndOfYear(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function getDaysFromNow(days: number): Date {
  return addDays(new Date(), days);
}

export function getMonthsFromNow(months: number): Date {
  return addMonths(new Date(), months);
}

/**
 * Get date range for the last N days
 */
export function getLast30Days(): { start: Date; end: Date } {
  return {
    start: addDays(new Date(), -30),
    end: new Date(),
  };
}

export function getLast90Days(): { start: Date; end: Date } {
  return {
    start: addDays(new Date(), -90),
    end: new Date(),
  };
}

/**
 * Get date range for the next N days
 */
export function getNext30Days(): { start: Date; end: Date } {
  return {
    start: new Date(),
    end: addDays(new Date(), 30),
  };
}

export function getNext90Days(): { start: Date; end: Date } {
  return {
    start: new Date(),
    end: addDays(new Date(), 90),
  };
}

/**
 * Get the last 12 months as an array of month/year objects
 */
export function getLast12Months(): { month: number; year: number; label: string }[] {
  const months: { month: number; year: number; label: string }[] = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = addMonths(now, -i);
    const month = date.getMonth() + 1; // 1-12
    const year = date.getFullYear();
    const label = date.toLocaleDateString('de-DE', { month: 'short', year: 'numeric' });

    months.push({ month, year, label });
  }

  return months;
}

/**
 * Get the next 12 months as an array of month/year objects
 */
export function getNext12Months(): { month: number; year: number; label: string }[] {
  const months: { month: number; year: number; label: string }[] = [];
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const date = addMonths(now, i);
    const month = date.getMonth() + 1; // 1-12
    const year = date.getFullYear();
    const label = date.toLocaleDateString('de-DE', { month: 'short', year: 'numeric' });

    months.push({ month, year, label });
  }

  return months;
}

/**
 * Check if a date is within a range
 */
export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}

/**
 * Check if a date is overdue (past today)
 */
export function isOverdue(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

/**
 * Check if a date is due soon (within next N days)
 */
export function isDueSoon(date: Date, days: number = 7): boolean {
  const now = new Date();
  const futureDate = addDays(now, days);
  return date >= now && date <= futureDate;
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Format month/year for display
 */
export function formatMonthYear(month: number, year: number): string {
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
}
