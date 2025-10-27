import {
  UUID,
  Role,
  FinancingType,
  InvestmentStatus,
  CashflowStatus,
  InvestmentCategory,
  NotificationType,
  NotificationPriority,
  CashflowType,
  RateInterval,
} from './enums';

// Notification Settings
export interface NotificationSettings {
  email_enabled: boolean;
  in_app_enabled: boolean;
  payment_reminder_days: number; // default: 7
  monthly_report_deadline_day: number; // default: 5
}

// Group Entity
export interface Group {
  id: UUID;
  name: string;
  created_at: Date;
  settings: {
    fiscal_year_start: number; // 1-12
    currency: string; // 'EUR'
    notification_settings: NotificationSettings;
  };
}

// Company Entity
export interface Company {
  id: UUID;
  group_id: UUID;
  name: string;
  company_code: string;
  is_active: boolean;
  created_at: Date;
}

// User Entity
export interface User {
  id: UUID;
  email: string;
  password_hash: string; // For local mock auth
  name: string;
  avatar?: string;
  created_at: Date;
  last_login?: Date;
}

// User Role Entity
export interface UserRole {
  id: UUID;
  user_id: UUID;
  company_id?: UUID; // null for group-level roles
  group_id: UUID;
  role: Role;
  assigned_at: Date;
  assigned_by: UUID;
}

// File Reference
export interface FileReference {
  id: UUID;
  name: string;
  size: number;
  type: string;
  url: string;
  uploaded_at: Date;
}

// Payment Structure Components
export interface Einmalzahlung {
  date: Date;
  amount: number;
  custom_due_date?: Date;
}

export interface Ratenzahlung {
  anzahlung?: number;
  anzahlung_date?: Date;
  anzahlung_custom_due?: Date;

  number_of_rates: number;
  rate_amount: number;
  rate_interval: RateInterval;
  first_rate_date: Date;
  rates_custom_due_dates?: Date[];

  schlussrate?: number;
  schlussrate_date?: Date;
  schlussrate_custom_due?: Date;
}

export interface Leasing {
  anzahlung?: number;
  anzahlung_date?: Date;

  monthly_rate: number;
  duration_months: number;
  start_month: Date;

  schlussrate?: number;
  purchase_option?: boolean;
  auto_confirm: boolean; // default: true
}

export interface PaymentStructure {
  // Kauf
  einmalzahlung?: Einmalzahlung;

  // Ratenzahlung
  ratenzahlung?: Ratenzahlung;

  // Leasing
  leasing?: Leasing;
}

// Investment Entity
export interface Investment {
  id: UUID;
  company_id: UUID;
  name: string;
  description?: string;
  category: InvestmentCategory;
  total_amount: number;
  financing_type: FinancingType;
  status: InvestmentStatus;
  created_by: UUID;
  created_at: Date;
  updated_at?: Date;
  submitted_at?: Date;
  start_date: Date;
  end_date?: Date;
  metadata: {
    vendor?: string;
    contract_number?: string;
    internal_reference?: string;
    attachments?: FileReference[];
  };
  payment_structure: PaymentStructure;
}

// Cashflow Entity
export interface Cashflow {
  id: UUID;
  investment_id: UUID;
  due_date: Date; // berechnet
  custom_due_date?: Date; // manuell gesetzt
  amount: number;
  type: CashflowType;
  period_number?: number; // z.B. Rate 3 von 36
  total_periods?: number;
  month: number; // 1-12
  year: number;
  status: CashflowStatus;

  // Bestätigungsfelder - Cashflow Manager
  confirmed_by_cm?: UUID;
  confirmed_at_cm?: Date;
  cm_comment?: string;

  // Bestätigungsfelder - Geschäftsführer
  confirmed_by_gf?: UUID;
  confirmed_at_gf?: Date;
  gf_comment?: string;

  // Verschiebung
  original_due_date?: Date;
  postponed_by?: UUID;
  postponed_at?: Date;
  postpone_reason?: string;

  // Buchhaltung (für Leasing)
  auto_confirmed: boolean;
  accounting_reference?: string;
}

// Investment Approval Entity
export interface InvestmentApproval {
  id: UUID;
  investment_id: UUID;
  approved_by: UUID;
  decision: 'genehmigt' | 'abgelehnt';
  comment?: string;
  conditions?: string;
  decided_at: Date;
  valid_until?: Date;
}

// Notification Entity
export interface Notification {
  id: UUID;
  user_id: UUID;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  related_type?: 'cashflow' | 'investment';
  related_id?: UUID;
  read: boolean;
  read_at?: Date;
  created_at: Date;
}

// Audit Log Entity
export interface AuditLog {
  id: UUID;
  user_id: UUID;
  action: string;
  entity_type: string;
  entity_id: UUID;
  old_values?: any;
  new_values?: any;
  metadata?: any;
  created_at: Date;
}

// Local Database Schema
export interface LocalDatabase {
  version: string;
  lastUpdated: Date;

  // Auth
  currentUser: User | null;
  authToken: string | null;

  // Core Data
  groups: Group[];
  companies: Company[];
  users: User[];
  userRoles: UserRole[];
  investments: Investment[];
  cashflows: Cashflow[];
  investmentApprovals: InvestmentApproval[];
  notifications: Notification[];
  auditLogs: AuditLog[];
}
