import { InvestmentStatus, CashflowStatus, Role } from '@/types/enums';

// Investment Status Transitions
export const INVESTMENT_STATUS_TRANSITIONS: Record<
  InvestmentStatus,
  InvestmentStatus[]
> = {
  entwurf: ['zur_genehmigung'],
  zur_genehmigung: ['genehmigt', 'abgelehnt'],
  genehmigt: ['aktiv'],
  abgelehnt: ['entwurf'], // Can be edited and resubmitted
  aktiv: ['abgeschlossen'],
  abgeschlossen: [], // Final state
};

// Cashflow Status Transitions
export const CASHFLOW_STATUS_TRANSITIONS: Record<
  CashflowStatus,
  CashflowStatus[]
> = {
  geplant: ['ausstehend', 'storniert'],
  ausstehend: ['vorbestaetigt', 'verschoben', 'storniert'],
  vorbestaetigt: ['bestaetigt', 'ausstehend'], // GF can send back
  bestaetigt: [], // Final state
  verschoben: ['ausstehend', 'storniert'],
  storniert: [], // Final state
};

// Investment Status State Machine
export class InvestmentStatusMachine {
  /**
   * Check if a status transition is allowed
   */
  static canTransition(
    currentStatus: InvestmentStatus,
    newStatus: InvestmentStatus
  ): boolean {
    const allowedTransitions = INVESTMENT_STATUS_TRANSITIONS[currentStatus];
    return allowedTransitions.includes(newStatus);
  }

  /**
   * Get all possible next states from current state
   */
  static getNextStates(currentStatus: InvestmentStatus): InvestmentStatus[] {
    return INVESTMENT_STATUS_TRANSITIONS[currentStatus];
  }

  /**
   * Validate and perform transition
   */
  static transition(
    currentStatus: InvestmentStatus,
    newStatus: InvestmentStatus
  ): InvestmentStatus {
    if (!this.canTransition(currentStatus, newStatus)) {
      throw new Error(
        `Invalid transition: ${currentStatus} -> ${newStatus}`
      );
    }
    return newStatus;
  }

  /**
   * Check if status is final (no more transitions possible)
   */
  static isFinalState(status: InvestmentStatus): boolean {
    return INVESTMENT_STATUS_TRANSITIONS[status].length === 0;
  }
}

// Cashflow Status State Machine
export class CashflowStatusMachine {
  /**
   * Check if a status transition is allowed
   */
  static canTransition(
    currentStatus: CashflowStatus,
    newStatus: CashflowStatus
  ): boolean {
    const allowedTransitions = CASHFLOW_STATUS_TRANSITIONS[currentStatus];
    return allowedTransitions.includes(newStatus);
  }

  /**
   * Get all possible next states from current state
   */
  static getNextStates(currentStatus: CashflowStatus): CashflowStatus[] {
    return CASHFLOW_STATUS_TRANSITIONS[currentStatus];
  }

  /**
   * Validate and perform transition
   */
  static transition(
    currentStatus: CashflowStatus,
    newStatus: CashflowStatus
  ): CashflowStatus {
    if (!this.canTransition(currentStatus, newStatus)) {
      throw new Error(
        `Invalid transition: ${currentStatus} -> ${newStatus}`
      );
    }
    return newStatus;
  }

  /**
   * Check if status is final (no more transitions possible)
   */
  static isFinalState(status: CashflowStatus): boolean {
    return CASHFLOW_STATUS_TRANSITIONS[status].length === 0;
  }

  /**
   * Determine initial cashflow status based on investment status
   */
  static getInitialStatus(investmentStatus: InvestmentStatus): CashflowStatus {
    switch (investmentStatus) {
      case 'entwurf':
      case 'zur_genehmigung':
      case 'abgelehnt':
        return 'geplant';
      case 'genehmigt':
      case 'aktiv':
        return 'ausstehend';
      case 'abgeschlossen':
        return 'storniert';
      default:
        return 'geplant';
    }
  }
}

// Status Action Types
export type InvestmentStatusAction =
  | { type: 'SUBMIT_FOR_APPROVAL' }
  | { type: 'APPROVE'; userId: string; comment?: string }
  | { type: 'REJECT'; userId: string; comment: string }
  | { type: 'ACTIVATE' }
  | { type: 'COMPLETE' }
  | { type: 'RESET_TO_DRAFT' };

export type CashflowStatusAction =
  | { type: 'MAKE_OUTSTANDING' }
  | { type: 'PRE_CONFIRM'; userId: string; comment?: string }
  | { type: 'CONFIRM'; userId: string; comment?: string }
  | { type: 'SEND_BACK'; userId: string; reason: string }
  | { type: 'POSTPONE'; userId: string; newDate: Date; reason: string }
  | { type: 'CANCEL' };

// Apply actions to investment status
export function applyInvestmentAction(
  currentStatus: InvestmentStatus,
  action: InvestmentStatusAction
): InvestmentStatus {
  switch (action.type) {
    case 'SUBMIT_FOR_APPROVAL':
      return InvestmentStatusMachine.transition(currentStatus, 'zur_genehmigung');
    case 'APPROVE':
      return InvestmentStatusMachine.transition(currentStatus, 'genehmigt');
    case 'REJECT':
      return InvestmentStatusMachine.transition(currentStatus, 'abgelehnt');
    case 'ACTIVATE':
      return InvestmentStatusMachine.transition(currentStatus, 'aktiv');
    case 'COMPLETE':
      return InvestmentStatusMachine.transition(currentStatus, 'abgeschlossen');
    case 'RESET_TO_DRAFT':
      return InvestmentStatusMachine.transition(currentStatus, 'entwurf');
    default:
      throw new Error(`Unknown action type`);
  }
}

// Apply actions to cashflow status
export function applyCashflowAction(
  currentStatus: CashflowStatus,
  action: CashflowStatusAction
): CashflowStatus {
  switch (action.type) {
    case 'MAKE_OUTSTANDING':
      return CashflowStatusMachine.transition(currentStatus, 'ausstehend');
    case 'PRE_CONFIRM':
      return CashflowStatusMachine.transition(currentStatus, 'vorbestaetigt');
    case 'CONFIRM':
      return CashflowStatusMachine.transition(currentStatus, 'bestaetigt');
    case 'SEND_BACK':
      return CashflowStatusMachine.transition(currentStatus, 'ausstehend');
    case 'POSTPONE':
      return CashflowStatusMachine.transition(currentStatus, 'verschoben');
    case 'CANCEL':
      return CashflowStatusMachine.transition(currentStatus, 'storniert');
    default:
      throw new Error(`Unknown action type`);
  }
}
