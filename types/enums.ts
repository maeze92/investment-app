// Core Enums and Types
export type UUID = string;

export type Role =
  | 'system_admin'
  | 'vr_approval'
  | 'vr_viewer'
  | 'cfo'
  | 'geschaeftsfuehrer'
  | 'cashflow_manager'
  | 'buchhaltung';

export type FinancingType =
  | 'kauf'
  | 'leasing'
  | 'ratenzahlung'
  | 'miete';

export type InvestmentStatus =
  | 'entwurf'
  | 'zur_genehmigung'
  | 'genehmigt'
  | 'abgelehnt'
  | 'aktiv'
  | 'abgeschlossen';

export type CashflowStatus =
  | 'geplant'
  | 'ausstehend'
  | 'vorbestaetigt'
  | 'bestaetigt'
  | 'verschoben'
  | 'storniert';

export type InvestmentCategory =
  | 'fahrzeuge'
  | 'it'
  | 'maschinen'
  | 'immobilien'
  | 'sonstige';

export type NotificationType =
  | 'payment_due_soon'
  | 'payment_overdue'
  | 'investment_submitted'
  | 'investment_approved'
  | 'investment_rejected'
  | 'cashflow_needs_confirmation'
  | 'monthly_report_due'
  | 'monthly_report_overdue'
  | 'cashflow_postponed';

export type NotificationPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'urgent';

export type CashflowType =
  | 'anzahlung'
  | 'rate'
  | 'schlussrate'
  | 'einmalzahlung';

export type RateInterval =
  | 'monthly'
  | 'quarterly'
  | 'yearly';

// Permissions for role-based access control
export type Permission =
  | 'manage_groups'
  | 'manage_companies'
  | 'manage_users'
  | 'manage_roles'
  | 'view_audit_logs'
  | 'manage_system_settings';

// Role Display Names
export const ROLE_NAMES: Record<Role, string> = {
  system_admin: 'System Administrator',
  vr_approval: 'Verwaltungsrat (Genehmigung)',
  vr_viewer: 'Verwaltungsrat (Ansicht)',
  cfo: 'CFO',
  geschaeftsfuehrer: 'Geschäftsführer',
  cashflow_manager: 'Cashflow Manager',
  buchhaltung: 'Buchhaltung',
};

// Financing Type Display Names
export const FINANCING_TYPE_NAMES: Record<FinancingType, string> = {
  kauf: 'Kauf',
  leasing: 'Leasing',
  ratenzahlung: 'Ratenzahlung',
  miete: 'Miete',
};

// Investment Status Display Names
export const INVESTMENT_STATUS_NAMES: Record<InvestmentStatus, string> = {
  entwurf: 'Entwurf',
  zur_genehmigung: 'Zur Genehmigung',
  genehmigt: 'Genehmigt',
  abgelehnt: 'Abgelehnt',
  aktiv: 'Aktiv',
  abgeschlossen: 'Abgeschlossen',
};

// Cashflow Status Display Names
export const CASHFLOW_STATUS_NAMES: Record<CashflowStatus, string> = {
  geplant: 'Geplant',
  ausstehend: 'Ausstehend',
  vorbestaetigt: 'Vorbestätigt',
  bestaetigt: 'Bestätigt',
  verschoben: 'Verschoben',
  storniert: 'Storniert',
};

// Category Display Names
export const CATEGORY_NAMES: Record<InvestmentCategory, string> = {
  fahrzeuge: 'Fahrzeuge',
  it: 'IT',
  maschinen: 'Maschinen',
  immobilien: 'Immobilien',
  sonstige: 'Sonstige',
};
