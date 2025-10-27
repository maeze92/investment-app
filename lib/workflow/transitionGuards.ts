import { Role, InvestmentStatus, CashflowStatus, UUID } from '@/types/enums';
import { Investment, Cashflow, User, UserRole } from '@/types/entities';
import {
  InvestmentStatusMachine,
  CashflowStatusMachine,
  InvestmentStatusAction,
  CashflowStatusAction,
} from './statusMachine';

// Permission definitions for investment actions
export const INVESTMENT_ACTION_PERMISSIONS: Record<
  string,
  Role[]
> = {
  SUBMIT_FOR_APPROVAL: ['geschaeftsfuehrer', 'cfo'],
  APPROVE: ['vr_approval'],
  REJECT: ['vr_approval'],
  ACTIVATE: ['cfo'],
  COMPLETE: ['cfo'],
  RESET_TO_DRAFT: ['geschaeftsfuehrer', 'cfo'],
};

// Permission definitions for cashflow actions
export const CASHFLOW_ACTION_PERMISSIONS: Record<
  string,
  Role[]
> = {
  MAKE_OUTSTANDING: ['cfo'],
  PRE_CONFIRM: ['cashflow_manager'],
  CONFIRM: ['geschaeftsfuehrer'],
  SEND_BACK: ['geschaeftsfuehrer'],
  POSTPONE: ['cashflow_manager', 'geschaeftsfuehrer'],
  CANCEL: ['cfo'],
};

/**
 * Check if user has permission to perform an action
 */
export function hasPermission(userRole: Role, allowedRoles: Role[]): boolean {
  return allowedRoles.includes(userRole);
}

/**
 * Validate if user can perform investment action
 */
export function canPerformInvestmentAction(
  user: User,
  userRoles: UserRole[],
  investment: Investment,
  action: InvestmentStatusAction
): { allowed: boolean; reason?: string } {
  // Get user's role
  const userRole = userRoles.find(
    (r) => r.user_id === user.id && r.group_id
  );

  if (!userRole) {
    return { allowed: false, reason: 'Keine Rolle zugewiesen' };
  }

  // Check permission for action type
  const allowedRoles = INVESTMENT_ACTION_PERMISSIONS[action.type];
  if (!hasPermission(userRole.role, allowedRoles)) {
    return {
      allowed: false,
      reason: `Rolle '${userRole.role}' hat keine Berechtigung für diese Aktion`,
    };
  }

  // Check if status transition is valid
  const currentStatus = investment.status;
  let newStatus: InvestmentStatus;

  try {
    switch (action.type) {
      case 'SUBMIT_FOR_APPROVAL':
        newStatus = 'zur_genehmigung';
        break;
      case 'APPROVE':
        newStatus = 'genehmigt';
        break;
      case 'REJECT':
        newStatus = 'abgelehnt';
        break;
      case 'ACTIVATE':
        newStatus = 'aktiv';
        break;
      case 'COMPLETE':
        newStatus = 'abgeschlossen';
        break;
      case 'RESET_TO_DRAFT':
        newStatus = 'entwurf';
        break;
      default:
        return { allowed: false, reason: 'Unbekannte Aktion' };
    }

    if (!InvestmentStatusMachine.canTransition(currentStatus, newStatus)) {
      return {
        allowed: false,
        reason: `Statusübergang von '${currentStatus}' zu '${newStatus}' nicht erlaubt`,
      };
    }
  } catch (error) {
    return {
      allowed: false,
      reason: error instanceof Error ? error.message : 'Unbekannter Fehler',
    };
  }

  // Additional business rules
  if (action.type === 'SUBMIT_FOR_APPROVAL') {
    // Check if user is creator or from same company
    if (
      investment.created_by !== user.id &&
      (!userRole.company_id || userRole.company_id !== investment.company_id)
    ) {
      return {
        allowed: false,
        reason: 'Kann nur eigene Investitionen einreichen',
      };
    }

    // Check if investment has required fields
    if (!investment.name || !investment.total_amount || !investment.company_id) {
      return {
        allowed: false,
        reason: 'Investition ist nicht vollständig ausgefüllt',
      };
    }
  }

  if (action.type === 'REJECT' && !action.comment) {
    return {
      allowed: false,
      reason: 'Ablehnungsgrund ist erforderlich',
    };
  }

  return { allowed: true };
}

/**
 * Validate if user can perform cashflow action
 */
export function canPerformCashflowAction(
  user: User,
  userRoles: UserRole[],
  cashflow: Cashflow,
  investment: Investment,
  action: CashflowStatusAction
): { allowed: boolean; reason?: string } {
  // Get user's role
  const userRole = userRoles.find(
    (r) => r.user_id === user.id && r.group_id
  );

  if (!userRole) {
    return { allowed: false, reason: 'Keine Rolle zugewiesen' };
  }

  // Check permission for action type
  const allowedRoles = CASHFLOW_ACTION_PERMISSIONS[action.type];
  if (!hasPermission(userRole.role, allowedRoles)) {
    return {
      allowed: false,
      reason: `Rolle '${userRole.role}' hat keine Berechtigung für diese Aktion`,
    };
  }

  // Check if status transition is valid
  const currentStatus = cashflow.status;
  let newStatus: CashflowStatus;

  try {
    switch (action.type) {
      case 'MAKE_OUTSTANDING':
        newStatus = 'ausstehend';
        break;
      case 'PRE_CONFIRM':
        newStatus = 'vorbestaetigt';
        break;
      case 'CONFIRM':
        newStatus = 'bestaetigt';
        break;
      case 'SEND_BACK':
        newStatus = 'ausstehend';
        break;
      case 'POSTPONE':
        newStatus = 'verschoben';
        break;
      case 'CANCEL':
        newStatus = 'storniert';
        break;
      default:
        return { allowed: false, reason: 'Unbekannte Aktion' };
    }

    if (!CashflowStatusMachine.canTransition(currentStatus, newStatus)) {
      return {
        allowed: false,
        reason: `Statusübergang von '${currentStatus}' zu '${newStatus}' nicht erlaubt`,
      };
    }
  } catch (error) {
    return {
      allowed: false,
      reason: error instanceof Error ? error.message : 'Unbekannter Fehler',
    };
  }

  // Additional business rules
  if (action.type === 'PRE_CONFIRM') {
    // Check if investment is approved
    if (investment.status !== 'genehmigt' && investment.status !== 'aktiv') {
      return {
        allowed: false,
        reason: 'Investition muss genehmigt sein',
      };
    }
  }

  if (action.type === 'CONFIRM') {
    // Check if cashflow is pre-confirmed by CM
    if (currentStatus !== 'vorbestaetigt') {
      return {
        allowed: false,
        reason: 'Cashflow muss zuerst vom Cashflow Manager vorbestätigt werden',
      };
    }

    // Check if GF is from same company
    if (userRole.company_id && userRole.company_id !== investment.company_id) {
      return {
        allowed: false,
        reason: 'Kann nur Cashflows der eigenen Firma bestätigen',
      };
    }
  }

  if (action.type === 'SEND_BACK' && !action.reason) {
    return {
      allowed: false,
      reason: 'Grund für Zurückweisung ist erforderlich',
    };
  }

  if (action.type === 'POSTPONE') {
    if (!action.reason) {
      return {
        allowed: false,
        reason: 'Grund für Verschiebung ist erforderlich',
      };
    }

    if (!action.newDate) {
      return {
        allowed: false,
        reason: 'Neues Datum ist erforderlich',
      };
    }

    // Check if new date is in the future
    if (action.newDate <= new Date()) {
      return {
        allowed: false,
        reason: 'Neues Datum muss in der Zukunft liegen',
      };
    }
  }

  return { allowed: true };
}

/**
 * Check if user can edit investment
 */
export function canEditInvestment(
  user: User,
  userRoles: UserRole[],
  investment: Investment
): { allowed: boolean; reason?: string } {
  // Only drafts can be edited
  if (investment.status !== 'entwurf') {
    return {
      allowed: false,
      reason: 'Nur Entwürfe können bearbeitet werden',
    };
  }

  const userRole = userRoles.find(
    (r) => r.user_id === user.id && r.group_id
  );

  if (!userRole) {
    return { allowed: false, reason: 'Keine Rolle zugewiesen' };
  }

  // GF and CFO can edit
  if (!['geschaeftsfuehrer', 'cfo'].includes(userRole.role)) {
    return {
      allowed: false,
      reason: 'Keine Berechtigung zum Bearbeiten',
    };
  }

  // Check if user is creator or from same company
  if (
    investment.created_by !== user.id &&
    (!userRole.company_id || userRole.company_id !== investment.company_id)
  ) {
    return {
      allowed: false,
      reason: 'Kann nur eigene Investitionen bearbeiten',
    };
  }

  return { allowed: true };
}

/**
 * Check if user can delete investment
 */
export function canDeleteInvestment(
  user: User,
  userRoles: UserRole[],
  investment: Investment
): { allowed: boolean; reason?: string } {
  // Only drafts can be deleted
  if (investment.status !== 'entwurf') {
    return {
      allowed: false,
      reason: 'Nur Entwürfe können gelöscht werden',
    };
  }

  const userRole = userRoles.find(
    (r) => r.user_id === user.id && r.group_id
  );

  if (!userRole) {
    return { allowed: false, reason: 'Keine Rolle zugewiesen' };
  }

  // GF and CFO can delete
  if (!['geschaeftsfuehrer', 'cfo'].includes(userRole.role)) {
    return {
      allowed: false,
      reason: 'Keine Berechtigung zum Löschen',
    };
  }

  // Check if user is creator or from same company
  if (
    investment.created_by !== user.id &&
    (!userRole.company_id || userRole.company_id !== investment.company_id)
  ) {
    return {
      allowed: false,
      reason: 'Kann nur eigene Investitionen löschen',
    };
  }

  return { allowed: true };
}

/**
 * Check if user can view investment
 */
export function canViewInvestment(
  user: User,
  userRoles: UserRole[],
  investment: Investment
): boolean {
  const userRole = userRoles.find(
    (r) => r.user_id === user.id && r.group_id
  );

  if (!userRole) {
    return false;
  }

  // VR and CFO can see all investments
  if (['vr_approval', 'vr_viewer', 'cfo'].includes(userRole.role)) {
    return true;
  }

  // Others can only see investments from their company
  return userRole.company_id === investment.company_id;
}
