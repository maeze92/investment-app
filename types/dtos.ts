import {
  UUID,
  Role,
  InvestmentCategory,
  FinancingType,
} from './enums';
import { PaymentStructure } from './entities';

// Auth DTOs
export interface LoginDTO {
  email: string;
  password: string;
  role?: Role; // For mock auth - quick role selection
}

export interface LoginResponseDTO {
  user: {
    id: UUID;
    email: string;
    name: string;
    avatar?: string;
  };
  token: string;
  roles: Array<{
    role: Role;
    company_id?: UUID;
    group_id: UUID;
  }>;
}

// Investment DTOs
export interface CreateInvestmentDTO {
  company_id: UUID;
  name: string;
  description?: string;
  category: InvestmentCategory;
  total_amount: number;
  financing_type: FinancingType;
  start_date: Date | string;
  end_date?: Date | string;
  metadata?: {
    vendor?: string;
    contract_number?: string;
    internal_reference?: string;
  };
  payment_structure: PaymentStructure;
}

export interface UpdateInvestmentDTO {
  name?: string;
  description?: string;
  category?: InvestmentCategory;
  total_amount?: number;
  start_date?: Date | string;
  end_date?: Date | string;
  metadata?: {
    vendor?: string;
    contract_number?: string;
    internal_reference?: string;
  };
  payment_structure?: PaymentStructure;
}

export interface SubmitInvestmentDTO {
  investment_id: UUID;
}

export interface ApproveInvestmentDTO {
  investment_id: UUID;
  comment?: string;
  conditions?: string;
  valid_until?: Date | string;
}

export interface RejectInvestmentDTO {
  investment_id: UUID;
  comment?: string;
}

// Cashflow DTOs
export interface ConfirmCashflowDTO {
  cashflow_id: UUID;
  comment?: string;
}

export interface PostponeCashflowDTO {
  cashflow_id: UUID;
  new_due_date: Date | string;
  reason: string;
}

export interface UpdateCashflowDTO {
  custom_due_date?: Date | string;
  accounting_reference?: string;
}

// Monthly Report DTOs
export interface MonthlyReportDTO {
  company_id: UUID;
  month: number;
  year: number;
}

export interface ApproveMonthlyReportDTO {
  company_id: UUID;
  month: number;
  year: number;
  comment?: string;
}

// Notification DTOs
export interface CreateNotificationDTO {
  user_id: UUID;
  type: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  related_type?: 'cashflow' | 'investment';
  related_id?: UUID;
}

// Filter DTOs
export interface InvestmentFilterDTO {
  company_id?: UUID;
  status?: string[];
  category?: string[];
  financing_type?: string[];
  created_by?: UUID;
  date_from?: Date | string;
  date_to?: Date | string;
  search?: string;
}

export interface CashflowFilterDTO {
  company_id?: UUID;
  investment_id?: UUID;
  status?: string[];
  month?: number;
  year?: number;
  date_from?: Date | string;
  date_to?: Date | string;
}

// Export DTOs
export interface ExportDTO {
  format: 'xlsx' | 'pdf' | 'json';
  type: 'investments' | 'cashflows' | 'monthly_report' | 'yearly_overview';
  filters?: InvestmentFilterDTO | CashflowFilterDTO;
  month?: number;
  year?: number;
}

// Statistics DTOs
export interface DashboardStatsDTO {
  company_id?: UUID;
  group_id?: UUID;
  period?: 'month' | 'quarter' | 'year';
}

export interface InvestmentStatsDTO {
  total_investments: number;
  total_amount: number;
  by_status: Record<string, number>;
  by_category: Record<string, number>;
  by_financing_type: Record<string, number>;
  pending_approvals: number;
}

export interface CashflowStatsDTO {
  total_cashflows: number;
  total_amount: number;
  by_status: Record<string, number>;
  upcoming_payments: number;
  overdue_payments: number;
  monthly_total: Record<string, number>;
}
