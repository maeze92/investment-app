import { create } from 'zustand';
import {
  Investment,
  Cashflow,
  Company,
  Group,
  User,
  Notification,
  InvestmentApproval,
} from '@/types/entities';
import { UUID, InvestmentStatus, CashflowStatus } from '@/types/enums';
import { storageService } from '@/lib/storage/LocalStorageService';
import { CreateInvestmentDTO, UpdateInvestmentDTO } from '@/types/dtos';
import { generateCashflowsForInvestment } from '@/lib/cashflow/cashflowGenerator';
import {
  triggerInvestmentNotifications,
  triggerCashflowNotifications,
  checkDailyNotifications,
} from '@/lib/notifications/notificationHelper';

interface AppState {
  // Data
  groups: Group[];
  companies: Company[];
  users: User[];
  investments: Investment[];
  cashflows: Cashflow[];
  notifications: Notification[];
  investmentApprovals: InvestmentApproval[];

  // UI State
  selectedCompanyId: UUID | null;
  selectedMonth: number;
  selectedYear: number;
  isLoading: boolean;

  // Actions - Initialization
  initialize: () => Promise<void>;
  refresh: () => Promise<void>;

  // Actions - Investments
  createInvestment: (data: CreateInvestmentDTO) => Promise<Investment>;
  updateInvestment: (id: UUID, data: UpdateInvestmentDTO) => Promise<Investment>;
  deleteInvestment: (id: UUID) => Promise<void>;
  submitInvestmentForApproval: (id: UUID) => Promise<void>;
  approveInvestment: (id: UUID, userId: UUID, comment?: string) => Promise<void>;
  rejectInvestment: (id: UUID, userId: UUID, comment?: string) => Promise<void>;

  // Actions - Cashflows
  confirmCashflowCM: (id: UUID, userId: UUID, comment?: string) => Promise<void>;
  confirmCashflowGF: (id: UUID, userId: UUID, comment?: string) => Promise<void>;
  postponeCashflow: (
    id: UUID,
    userId: UUID,
    newDate: Date,
    reason: string
  ) => Promise<void>;

  // Actions - Notifications
  markNotificationAsRead: (id: UUID) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  getUnreadCount: () => number;

  // Selectors
  getInvestmentsByCompany: (companyId: UUID) => Investment[];
  getCashflowsByInvestment: (investmentId: UUID) => Cashflow[];
  getCashflowsByMonth: (month: number, year: number, companyId?: UUID) => Cashflow[];
  getCompany: (id: UUID) => Company | undefined;
  getGroup: (id: UUID) => Group | undefined;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial State
  groups: [],
  companies: [],
  users: [],
  investments: [],
  cashflows: [],
  notifications: [],
  investmentApprovals: [],
  selectedCompanyId: null,
  selectedMonth: new Date().getMonth() + 1,
  selectedYear: new Date().getFullYear(),
  isLoading: false,

  // Initialize - Load data from storage
  initialize: async () => {
    try {
      set({ isLoading: true });

      const db = storageService.getDatabase();

      set({
        groups: db.groups,
        companies: db.companies,
        users: db.users,
        investments: db.investments,
        cashflows: db.cashflows,
        notifications: db.notifications,
        investmentApprovals: db.investmentApprovals,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to initialize app store:', error);
      set({ isLoading: false });
    }
  },

  // Refresh data from storage
  refresh: async () => {
    await get().initialize();
  },

  // Create Investment
  createInvestment: async (data: CreateInvestmentDTO) => {
    const currentUser = storageService.getDatabase().currentUser;

    const investment = await storageService.create<Investment>('investments', {
      ...data,
      status: 'entwurf',
      created_by: currentUser?.id || 'unknown',
      created_at: new Date(),
    } as any);

    // Generate cashflows based on payment structure
    const { cashflows, validation, errors } = generateCashflowsForInvestment(investment);

    if (errors.length > 0) {
      console.warn('Cashflow generation warnings:', errors);
    }

    // Create cashflows in storage
    for (const cashflowData of cashflows) {
      await storageService.create<Cashflow>('cashflows', cashflowData as any);
    }

    await get().refresh();
    return investment;
  },

  // Update Investment
  updateInvestment: async (id: UUID, data: UpdateInvestmentDTO) => {
    const updated = await storageService.update<Investment>('investments', id, {
      ...data,
      updated_at: new Date(),
    } as any);

    if (!updated) throw new Error('Investment not found');

    // Regenerate cashflows if payment structure changed
    if (data.payment_structure) {
      // Delete existing cashflows for this investment
      const existingCashflows = get().cashflows.filter((cf) => cf.investment_id === id);
      for (const cf of existingCashflows) {
        await storageService.delete('cashflows', cf.id);
      }

      // Generate new cashflows
      const { cashflows } = generateCashflowsForInvestment(updated);
      for (const cashflowData of cashflows) {
        await storageService.create<Cashflow>('cashflows', cashflowData as any);
      }
    }

    await get().refresh();
    return updated;
  },

  // Delete Investment
  deleteInvestment: async (id: UUID) => {
    // Delete associated cashflows
    const cashflows = get().cashflows.filter((cf) => cf.investment_id === id);

    for (const cf of cashflows) {
      await storageService.delete('cashflows', cf.id);
    }

    // Delete investment
    await storageService.delete('investments', id);

    await get().refresh();
  },

  // Submit Investment for Approval
  submitInvestmentForApproval: async (id: UUID) => {
    await storageService.update<Investment>('investments', id, {
      status: 'zur_genehmigung' as InvestmentStatus,
      submitted_at: new Date(),
    } as any);

    // Update associated cashflows
    const cashflows = get().cashflows.filter((cf) => cf.investment_id === id);

    for (const cf of cashflows) {
      await storageService.update<Cashflow>('cashflows', cf.id, {
        status: 'ausstehend' as CashflowStatus,
      } as any);
    }

    await get().refresh();

    // Create notifications for approvers
    const investment = get().investments.find((inv) => inv.id === id);
    if (investment) {
      await triggerInvestmentNotifications(investment);
      await get().refresh();
    }
  },

  // Approve Investment
  approveInvestment: async (id: UUID, userId: UUID, comment?: string) => {
    // Update investment status
    await storageService.update<Investment>('investments', id, {
      status: 'genehmigt' as InvestmentStatus,
    } as any);

    // Create approval record
    await storageService.create<InvestmentApproval>('investmentApprovals', {
      investment_id: id,
      approved_by: userId,
      decision: 'genehmigt',
      comment,
      decided_at: new Date(),
    } as any);

    await get().refresh();

    // Create notification for investment creator
    const investment = get().investments.find((inv) => inv.id === id);
    if (investment) {
      await triggerInvestmentNotifications(investment);
      await get().refresh();
    }
  },

  // Reject Investment
  rejectInvestment: async (id: UUID, userId: UUID, comment?: string) => {
    // Update investment status
    await storageService.update<Investment>('investments', id, {
      status: 'abgelehnt' as InvestmentStatus,
    } as any);

    // Create approval record
    await storageService.create<InvestmentApproval>('investmentApprovals', {
      investment_id: id,
      approved_by: userId,
      decision: 'abgelehnt',
      comment,
      decided_at: new Date(),
    } as any);

    // Update associated cashflows
    const cashflows = get().cashflows.filter((cf) => cf.investment_id === id);

    for (const cf of cashflows) {
      await storageService.update<Cashflow>('cashflows', cf.id, {
        status: 'storniert' as CashflowStatus,
      } as any);
    }

    await get().refresh();

    // Create notification for investment creator
    const investment = get().investments.find((inv) => inv.id === id);
    if (investment) {
      await triggerInvestmentNotifications(investment);
      await get().refresh();
    }
  },

  // Confirm Cashflow (Cashflow Manager)
  confirmCashflowCM: async (id: UUID, userId: UUID, comment?: string) => {
    await storageService.update<Cashflow>('cashflows', id, {
      status: 'vorbestaetigt' as CashflowStatus,
      confirmed_by_cm: userId,
      confirmed_at_cm: new Date(),
      cm_comment: comment,
    } as any);

    await get().refresh();

    // Create notification for Geschäftsführer
    const cashflow = get().cashflows.find((cf) => cf.id === id);
    const investment = cashflow
      ? get().investments.find((inv) => inv.id === cashflow.investment_id)
      : undefined;

    if (cashflow && investment) {
      await triggerCashflowNotifications(cashflow, investment);
      await get().refresh();
    }
  },

  // Confirm Cashflow (Geschäftsführer)
  confirmCashflowGF: async (id: UUID, userId: UUID, comment?: string) => {
    await storageService.update<Cashflow>('cashflows', id, {
      status: 'bestaetigt' as CashflowStatus,
      confirmed_by_gf: userId,
      confirmed_at_gf: new Date(),
      gf_comment: comment,
    } as any);

    await get().refresh();
  },

  // Postpone Cashflow
  postponeCashflow: async (id: UUID, userId: UUID, newDate: Date, reason: string) => {
    const cashflow = get().cashflows.find((cf) => cf.id === id);

    if (!cashflow) throw new Error('Cashflow not found');

    await storageService.update<Cashflow>('cashflows', id, {
      status: 'verschoben' as CashflowStatus,
      custom_due_date: newDate,
      original_due_date: cashflow.due_date,
      postponed_by: userId,
      postponed_at: new Date(),
      postpone_reason: reason,
    } as any);

    await get().refresh();

    // Create notification
    const updatedCashflow = get().cashflows.find((cf) => cf.id === id);
    const investment = updatedCashflow
      ? get().investments.find((inv) => inv.id === updatedCashflow.investment_id)
      : undefined;

    if (updatedCashflow && investment) {
      await triggerCashflowNotifications(updatedCashflow, investment);
      await get().refresh();
    }
  },

  // Mark Notification as Read
  markNotificationAsRead: async (id: UUID) => {
    await storageService.update<Notification>('notifications', id, {
      read: true,
      read_at: new Date(),
    } as any);

    await get().refresh();
  },

  // Clear All Notifications
  clearAllNotifications: async () => {
    const { notifications } = get();

    for (const notification of notifications) {
      await storageService.delete('notifications', notification.id);
    }

    await get().refresh();
  },

  // Get Unread Notification Count
  getUnreadCount: () => {
    const { notifications } = get();
    return notifications.filter((n) => !n.read).length;
  },

  // Get Investments by Company
  getInvestmentsByCompany: (companyId: UUID) => {
    const { investments } = get();
    return investments.filter((inv) => inv.company_id === companyId);
  },

  // Get Cashflows by Investment
  getCashflowsByInvestment: (investmentId: UUID) => {
    const { cashflows } = get();
    return cashflows.filter((cf) => cf.investment_id === investmentId);
  },

  // Get Cashflows by Month
  getCashflowsByMonth: (month: number, year: number, companyId?: UUID) => {
    const { cashflows, investments } = get();

    let filtered = cashflows.filter((cf) => cf.month === month && cf.year === year);

    if (companyId) {
      const companyInvestmentIds = investments
        .filter((inv) => inv.company_id === companyId)
        .map((inv) => inv.id);

      filtered = filtered.filter((cf) => companyInvestmentIds.includes(cf.investment_id));
    }

    return filtered;
  },

  // Get Company
  getCompany: (id: UUID) => {
    const { companies } = get();
    return companies.find((c) => c.id === id);
  },

  // Get Group
  getGroup: (id: UUID) => {
    const { groups } = get();
    return groups.find((g) => g.id === id);
  },
}));
