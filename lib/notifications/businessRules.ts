import {
  NotificationType,
  NotificationPriority,
  Role,
  CashflowStatus,
  InvestmentStatus,
} from '@/types/enums';
import {
  Cashflow,
  Investment,
  User,
  UserRole,
  Group,
} from '@/types/entities';
import { UUID } from '@/types/enums';

// Business Rule Interface
export interface BusinessRule {
  id: string;
  name: string;
  type: NotificationType;
  priority: NotificationPriority;
  description: string;
  evaluate: (context: RuleContext) => RuleResult | null;
  getRecipients: (context: RuleContext) => UUID[];
  getMessage: (context: RuleContext) => { title: string; message: string };
}

// Rule Evaluation Context
export interface RuleContext {
  cashflow?: Cashflow;
  investment?: Investment;
  user?: User;
  users: User[];
  userRoles: UserRole[];
  groups: Group[];
  currentDate: Date;
  triggeredBy?: UUID;
}

// Rule Evaluation Result
export interface RuleResult {
  shouldTrigger: boolean;
  relatedType?: 'cashflow' | 'investment';
  relatedId?: UUID;
  metadata?: Record<string, any>;
}

// Helper: Get users with specific role in a group/company
function getUsersWithRole(
  roles: Role[],
  userRoles: UserRole[],
  groupId?: UUID,
  companyId?: UUID
): UUID[] {
  return userRoles
    .filter((ur) => {
      const hasRole = roles.includes(ur.role);
      const matchesGroup = !groupId || ur.group_id === groupId;
      const matchesCompany = !companyId || ur.company_id === companyId;
      return hasRole && matchesGroup && matchesCompany;
    })
    .map((ur) => ur.user_id);
}

// Helper: Get days difference
function getDaysDifference(date1: Date, date2: Date): number {
  const diffTime = date1.getTime() - date2.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Helper: Format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

// Helper: Format date
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('de-DE').format(date);
}

// ============================================================================
// RULE 1: Payment Due Soon (7 days before)
// ============================================================================
export const paymentDueSoonRule: BusinessRule = {
  id: 'payment_due_soon',
  name: 'Zahlung bald fällig',
  type: 'payment_due_soon',
  priority: 'medium',
  description: 'Benachrichtigung 7 Tage vor Fälligkeitsdatum',

  evaluate: (context: RuleContext): RuleResult | null => {
    if (!context.cashflow) return null;

    const { cashflow, currentDate } = context;
    const dueDate = cashflow.custom_due_date || cashflow.due_date;

    // Only for outstanding cashflows
    if (cashflow.status !== 'ausstehend') return null;

    // Check if exactly 7 days before
    const daysDiff = getDaysDifference(dueDate, currentDate);

    if (daysDiff === 7) {
      return {
        shouldTrigger: true,
        relatedType: 'cashflow',
        relatedId: cashflow.id,
        metadata: { dueDate, amount: cashflow.amount },
      };
    }

    return null;
  },

  getRecipients: (context: RuleContext): UUID[] => {
    if (!context.cashflow) return [];

    // Get investment to find company
    const investment = context.investment;
    if (!investment) return [];

    // Get CM and GF for this company
    return getUsersWithRole(
      ['cashflow_manager', 'geschaeftsfuehrer'],
      context.userRoles,
      undefined,
      investment.company_id
    );
  },

  getMessage: (context: RuleContext) => {
    const { cashflow, investment } = context;
    if (!cashflow || !investment) {
      return { title: '', message: '' };
    }

    const dueDate = cashflow.custom_due_date || cashflow.due_date;

    return {
      title: 'Zahlung in 7 Tagen fällig',
      message: `Zahlung von ${formatCurrency(cashflow.amount)} für "${investment.name}" ist am ${formatDate(dueDate)} fällig.`,
    };
  },
};

// ============================================================================
// RULE 2: Payment Overdue
// ============================================================================
export const paymentOverdueRule: BusinessRule = {
  id: 'payment_overdue',
  name: 'Zahlung überfällig',
  type: 'payment_overdue',
  priority: 'high',
  description: 'Benachrichtigung wenn Zahlung überfällig ist',

  evaluate: (context: RuleContext): RuleResult | null => {
    if (!context.cashflow) return null;

    const { cashflow, currentDate } = context;
    const dueDate = cashflow.custom_due_date || cashflow.due_date;

    // Only for outstanding cashflows
    if (cashflow.status !== 'ausstehend') return null;

    // Check if overdue (current date > due date)
    if (currentDate > dueDate) {
      const daysOverdue = getDaysDifference(currentDate, dueDate);

      return {
        shouldTrigger: true,
        relatedType: 'cashflow',
        relatedId: cashflow.id,
        metadata: { dueDate, amount: cashflow.amount, daysOverdue },
      };
    }

    return null;
  },

  getRecipients: (context: RuleContext): UUID[] => {
    if (!context.cashflow) return [];

    const investment = context.investment;
    if (!investment) return [];

    // Get CM, GF, and CFO
    return getUsersWithRole(
      ['cashflow_manager', 'geschaeftsfuehrer', 'cfo'],
      context.userRoles,
      undefined,
      investment.company_id
    );
  },

  getMessage: (context: RuleContext) => {
    const { cashflow, investment } = context;
    if (!cashflow || !investment) {
      return { title: '', message: '' };
    }

    const dueDate = cashflow.custom_due_date || cashflow.due_date;
    const daysOverdue = getDaysDifference(context.currentDate, dueDate);

    return {
      title: 'Zahlung überfällig!',
      message: `Zahlung von ${formatCurrency(cashflow.amount)} für "${investment.name}" ist seit ${daysOverdue} Tag(en) überfällig (Fällig am: ${formatDate(dueDate)}).`,
    };
  },
};

// ============================================================================
// RULE 3: Investment Submitted for Approval
// ============================================================================
export const investmentSubmittedRule: BusinessRule = {
  id: 'investment_submitted',
  name: 'Investition zur Genehmigung eingereicht',
  type: 'investment_submitted',
  priority: 'medium',
  description: 'Benachrichtigung an VR wenn Investment zur Genehmigung eingereicht wird',

  evaluate: (context: RuleContext): RuleResult | null => {
    if (!context.investment) return null;

    const { investment } = context;

    // Trigger when status is "zur_genehmigung"
    if (investment.status === 'zur_genehmigung') {
      return {
        shouldTrigger: true,
        relatedType: 'investment',
        relatedId: investment.id,
        metadata: { amount: investment.total_amount, name: investment.name },
      };
    }

    return null;
  },

  getRecipients: (context: RuleContext): UUID[] => {
    if (!context.investment) return [];

    const { investment } = context;

    // Get all VR with approval rights in the group
    return getUsersWithRole(
      ['vr_approval'],
      context.userRoles,
      // Get group from investment's company (would need company lookup)
      undefined,
      undefined
    );
  },

  getMessage: (context: RuleContext) => {
    const { investment } = context;
    if (!investment) {
      return { title: '', message: '' };
    }

    return {
      title: 'Neue Investition zur Genehmigung',
      message: `Investition "${investment.name}" (${formatCurrency(investment.total_amount)}) wurde zur Genehmigung eingereicht.`,
    };
  },
};

// ============================================================================
// RULE 4: Investment Approved
// ============================================================================
export const investmentApprovedRule: BusinessRule = {
  id: 'investment_approved',
  name: 'Investition genehmigt',
  type: 'investment_approved',
  priority: 'medium',
  description: 'Benachrichtigung an Ersteller wenn Investment genehmigt wurde',

  evaluate: (context: RuleContext): RuleResult | null => {
    if (!context.investment) return null;

    const { investment } = context;

    // Trigger when status is "genehmigt"
    if (investment.status === 'genehmigt') {
      return {
        shouldTrigger: true,
        relatedType: 'investment',
        relatedId: investment.id,
        metadata: { name: investment.name },
      };
    }

    return null;
  },

  getRecipients: (context: RuleContext): UUID[] => {
    if (!context.investment) return [];

    // Send to creator only
    return [context.investment.created_by];
  },

  getMessage: (context: RuleContext) => {
    const { investment } = context;
    if (!investment) {
      return { title: '', message: '' };
    }

    return {
      title: 'Investition genehmigt',
      message: `Ihre Investition "${investment.name}" wurde genehmigt.`,
    };
  },
};

// ============================================================================
// RULE 5: Investment Rejected
// ============================================================================
export const investmentRejectedRule: BusinessRule = {
  id: 'investment_rejected',
  name: 'Investition abgelehnt',
  type: 'investment_rejected',
  priority: 'high',
  description: 'Benachrichtigung an Ersteller wenn Investment abgelehnt wurde',

  evaluate: (context: RuleContext): RuleResult | null => {
    if (!context.investment) return null;

    const { investment } = context;

    // Trigger when status is "abgelehnt"
    if (investment.status === 'abgelehnt') {
      return {
        shouldTrigger: true,
        relatedType: 'investment',
        relatedId: investment.id,
        metadata: { name: investment.name },
      };
    }

    return null;
  },

  getRecipients: (context: RuleContext): UUID[] => {
    if (!context.investment) return [];

    // Send to creator only
    return [context.investment.created_by];
  },

  getMessage: (context: RuleContext) => {
    const { investment } = context;
    if (!investment) {
      return { title: '', message: '' };
    }

    return {
      title: 'Investition abgelehnt',
      message: `Ihre Investition "${investment.name}" wurde abgelehnt. Bitte prüfen Sie die Begründung in den Details.`,
    };
  },
};

// ============================================================================
// RULE 6: Cashflow Needs Confirmation (CM confirmed, waiting for GF)
// ============================================================================
export const cashflowNeedsConfirmationRule: BusinessRule = {
  id: 'cashflow_needs_confirmation',
  name: 'Cashflow wartet auf Freigabe',
  type: 'cashflow_needs_confirmation',
  priority: 'medium',
  description: 'Benachrichtigung an GF wenn CM Cashflow bestätigt hat',

  evaluate: (context: RuleContext): RuleResult | null => {
    if (!context.cashflow) return null;

    const { cashflow } = context;

    // Trigger when status is "vorbestaetigt" (CM confirmed, waiting for GF)
    if (cashflow.status === 'vorbestaetigt') {
      return {
        shouldTrigger: true,
        relatedType: 'cashflow',
        relatedId: cashflow.id,
        metadata: { amount: cashflow.amount },
      };
    }

    return null;
  },

  getRecipients: (context: RuleContext): UUID[] => {
    if (!context.cashflow) return [];

    const investment = context.investment;
    if (!investment) return [];

    // Send to GF only
    return getUsersWithRole(
      ['geschaeftsfuehrer'],
      context.userRoles,
      undefined,
      investment.company_id
    );
  },

  getMessage: (context: RuleContext) => {
    const { cashflow, investment } = context;
    if (!cashflow || !investment) {
      return { title: '', message: '' };
    }

    return {
      title: 'Cashflow wartet auf Freigabe',
      message: `Ein Cashflow von ${formatCurrency(cashflow.amount)} für "${investment.name}" wurde vom Cashflow Manager bestätigt und wartet auf Ihre Freigabe.`,
    };
  },
};

// ============================================================================
// RULE 7: Monthly Report Due
// ============================================================================
export const monthlyReportDueRule: BusinessRule = {
  id: 'monthly_report_due',
  name: 'Monatsbericht fällig',
  type: 'monthly_report_due',
  priority: 'high',
  description: 'Benachrichtigung am 5. Tag des Folgemonats',

  evaluate: (context: RuleContext): RuleResult | null => {
    const { currentDate } = context;

    // Trigger on 5th day of month
    if (currentDate.getDate() === 5) {
      const previousMonth = new Date(currentDate);
      previousMonth.setMonth(previousMonth.getMonth() - 1);

      return {
        shouldTrigger: true,
        metadata: {
          month: previousMonth.getMonth() + 1,
          year: previousMonth.getFullYear(),
        },
      };
    }

    return null;
  },

  getRecipients: (context: RuleContext): UUID[] => {
    // Send to all CM and GF
    return getUsersWithRole(
      ['cashflow_manager', 'geschaeftsfuehrer'],
      context.userRoles
    );
  },

  getMessage: (context: RuleContext) => {
    const { currentDate } = context;
    const previousMonth = new Date(currentDate);
    previousMonth.setMonth(previousMonth.getMonth() - 1);

    const monthName = new Intl.DateTimeFormat('de-DE', { month: 'long' }).format(previousMonth);
    const year = previousMonth.getFullYear();

    return {
      title: 'Monatsbericht fällig',
      message: `Der Cashflow-Bericht für ${monthName} ${year} ist fällig. Bitte prüfen und abschließen.`,
    };
  },
};

// ============================================================================
// RULE 8: Cashflow Postponed
// ============================================================================
export const cashflowPostponedRule: BusinessRule = {
  id: 'cashflow_postponed',
  name: 'Zahlung verschoben',
  type: 'cashflow_postponed',
  priority: 'medium',
  description: 'Benachrichtigung wenn Zahlung verschoben wurde',

  evaluate: (context: RuleContext): RuleResult | null => {
    if (!context.cashflow) return null;

    const { cashflow } = context;

    // Trigger when status is "verschoben"
    if (cashflow.status === 'verschoben' && cashflow.postponed_at) {
      return {
        shouldTrigger: true,
        relatedType: 'cashflow',
        relatedId: cashflow.id,
        metadata: {
          amount: cashflow.amount,
          newDate: cashflow.custom_due_date,
          reason: cashflow.postpone_reason,
        },
      };
    }

    return null;
  },

  getRecipients: (context: RuleContext): UUID[] => {
    if (!context.cashflow) return [];

    const investment = context.investment;
    if (!investment) return [];

    // Send to CFO and GF
    return getUsersWithRole(
      ['cfo', 'geschaeftsfuehrer'],
      context.userRoles,
      undefined,
      investment.company_id
    );
  },

  getMessage: (context: RuleContext) => {
    const { cashflow, investment } = context;
    if (!cashflow || !investment) {
      return { title: '', message: '' };
    }

    const newDate = cashflow.custom_due_date || cashflow.due_date;
    const reason = cashflow.postpone_reason || 'Kein Grund angegeben';

    return {
      title: 'Zahlung verschoben',
      message: `Zahlung von ${formatCurrency(cashflow.amount)} für "${investment.name}" wurde auf ${formatDate(newDate)} verschoben. Grund: ${reason}`,
    };
  },
};

// ============================================================================
// All Business Rules Registry
// ============================================================================
export const ALL_BUSINESS_RULES: BusinessRule[] = [
  paymentDueSoonRule,
  paymentOverdueRule,
  investmentSubmittedRule,
  investmentApprovedRule,
  investmentRejectedRule,
  cashflowNeedsConfirmationRule,
  monthlyReportDueRule,
  cashflowPostponedRule,
];

// Export by type for easy access
export const BUSINESS_RULES_BY_TYPE: Record<NotificationType, BusinessRule> = {
  payment_due_soon: paymentDueSoonRule,
  payment_overdue: paymentOverdueRule,
  investment_submitted: investmentSubmittedRule,
  investment_approved: investmentApprovedRule,
  investment_rejected: investmentRejectedRule,
  cashflow_needs_confirmation: cashflowNeedsConfirmationRule,
  monthly_report_due: monthlyReportDueRule,
  monthly_report_overdue: monthlyReportDueRule, // Reuse same rule
  cashflow_postponed: cashflowPostponedRule,
};
