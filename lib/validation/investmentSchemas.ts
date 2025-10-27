import { z } from 'zod';

/**
 * Investment Validation Schemas
 * Using Zod for runtime type checking and validation
 */

// Step 1: Basic Info Schema
export const basicInfoSchema = z.object({
  name: z
    .string()
    .min(3, 'Name muss mindestens 3 Zeichen lang sein')
    .max(100, 'Name darf maximal 100 Zeichen lang sein'),
  description: z
    .string()
    .max(500, 'Beschreibung darf maximal 500 Zeichen lang sein')
    .optional(),
  category: z.enum(['fahrzeuge', 'it', 'maschinen', 'immobilien', 'sonstige'], {
    errorMap: () => ({ message: 'Bitte wählen Sie eine Kategorie' }),
  }),
  company_id: z.string().min(1, 'Bitte wählen Sie ein Unternehmen'),
  total_amount: z
    .number({ invalid_type_error: 'Betrag muss eine Zahl sein' })
    .positive('Betrag muss größer als 0 sein')
    .max(100000000, 'Betrag darf maximal 100.000.000 € sein'),
  start_date: z.date({
    errorMap: () => ({ message: 'Bitte geben Sie ein gültiges Startdatum an' }),
  }),
  end_date: z.date().optional(),
});

// Step 2: Financing Type Schema
export const financingTypeSchema = z.object({
  financing_type: z.enum(['kauf', 'leasing', 'ratenzahlung', 'miete'], {
    errorMap: () => ({ message: 'Bitte wählen Sie einen Finanzierungstyp' }),
  }),
});

// Step 3: Payment Structure Schemas

// Kauf (Single Payment)
export const kaufPaymentSchema = z.object({
  payment_date: z.date({
    errorMap: () => ({ message: 'Bitte geben Sie ein Zahlungsdatum an' }),
  }),
  has_custom_due_date: z.boolean().default(false),
  custom_due_date: z.date().optional(),
});

// Leasing
export const leasingPaymentSchema = z
  .object({
    anzahlung: z
      .number()
      .nonnegative('Anzahlung muss 0 oder größer sein')
      .optional(),
    anzahlung_date: z.date().optional(),
    monthly_rate: z
      .number({ invalid_type_error: 'Monatliche Rate muss eine Zahl sein' })
      .positive('Monatliche Rate muss größer als 0 sein'),
    duration_months: z
      .number({ invalid_type_error: 'Laufzeit muss eine Zahl sein' })
      .int('Laufzeit muss eine ganze Zahl sein')
      .min(1, 'Laufzeit muss mindestens 1 Monat sein')
      .max(240, 'Laufzeit darf maximal 240 Monate sein'),
    start_month: z.date({
      errorMap: () => ({ message: 'Bitte geben Sie den Startmonat an' }),
    }),
    schlussrate: z
      .number()
      .nonnegative('Schlussrate muss 0 oder größer sein')
      .optional(),
    purchase_option: z.boolean().default(false),
    auto_confirm: z.boolean().default(true),
  })
  .refine(
    (data) => {
      if (data.anzahlung && data.anzahlung > 0 && !data.anzahlung_date) {
        return false;
      }
      return true;
    },
    {
      message: 'Wenn eine Anzahlung angegeben ist, muss auch ein Anzahlungsdatum angegeben werden',
      path: ['anzahlung_date'],
    }
  )
  .refine(
    (data) => {
      const totalAmount = (data.anzahlung || 0) + data.monthly_rate * data.duration_months + (data.schlussrate || 0);
      // Allow 1% tolerance for rounding
      return totalAmount > 0;
    },
    {
      message: 'Die Summe aller Zahlungen muss größer als 0 sein',
      path: ['monthly_rate'],
    }
  );

// Ratenzahlung
export const ratenzahlungPaymentSchema = z
  .object({
    anzahlung: z
      .number()
      .nonnegative('Anzahlung muss 0 oder größer sein')
      .optional(),
    anzahlung_date: z.date().optional(),
    anzahlung_has_custom_due: z.boolean().default(false),
    anzahlung_custom_due: z.date().optional(),
    number_of_rates: z
      .number({ invalid_type_error: 'Anzahl der Raten muss eine Zahl sein' })
      .int('Anzahl der Raten muss eine ganze Zahl sein')
      .min(2, 'Es müssen mindestens 2 Raten sein')
      .max(120, 'Es dürfen maximal 120 Raten sein'),
    rate_amount: z
      .number({ invalid_type_error: 'Ratenbetrag muss eine Zahl sein' })
      .positive('Ratenbetrag muss größer als 0 sein'),
    rate_interval: z.enum(['monthly', 'quarterly', 'yearly'], {
      errorMap: () => ({ message: 'Bitte wählen Sie ein Intervall' }),
    }),
    first_rate_date: z.date({
      errorMap: () => ({ message: 'Bitte geben Sie das Datum der ersten Rate an' }),
    }),
    has_custom_due_dates: z.boolean().default(false),
    schlussrate: z
      .number()
      .nonnegative('Schlussrate muss 0 oder größer sein')
      .optional(),
    schlussrate_date: z.date().optional(),
    schlussrate_has_custom_due: z.boolean().default(false),
    schlussrate_custom_due: z.date().optional(),
  })
  .refine(
    (data) => {
      if (data.anzahlung && data.anzahlung > 0 && !data.anzahlung_date) {
        return false;
      }
      return true;
    },
    {
      message: 'Wenn eine Anzahlung angegeben ist, muss auch ein Anzahlungsdatum angegeben werden',
      path: ['anzahlung_date'],
    }
  )
  .refine(
    (data) => {
      if (data.schlussrate && data.schlussrate > 0 && !data.schlussrate_date) {
        return false;
      }
      return true;
    },
    {
      message: 'Wenn eine Schlussrate angegeben ist, muss auch ein Datum angegeben werden',
      path: ['schlussrate_date'],
    }
  );

// Step 4: Metadata Schema
export const metadataSchema = z.object({
  vendor: z.string().max(100, 'Lieferantenname darf maximal 100 Zeichen lang sein').optional(),
  contract_number: z.string().max(50, 'Vertragsnummer darf maximal 50 Zeichen lang sein').optional(),
  internal_reference: z.string().max(50, 'Interne Referenz darf maximal 50 Zeichen lang sein').optional(),
});

// Combined Schema for Form Data
export const investmentFormSchema = z
  .object({
    // Step 1
    name: z.string().min(3).max(100),
    description: z.string().max(500).optional(),
    category: z.enum(['fahrzeuge', 'it', 'maschinen', 'immobilien', 'sonstige']),
    company_id: z.string().min(1),
    total_amount: z.number().positive(),
    start_date: z.date(),
    end_date: z.date().optional(),

    // Step 2
    financing_type: z.enum(['kauf', 'leasing', 'ratenzahlung', 'miete']),

    // Step 3 - Payment Structure (conditional based on financing_type)
    payment_structure: z.any(), // Will be validated based on financing_type

    // Step 4
    vendor: z.string().max(100).optional(),
    contract_number: z.string().max(50).optional(),
    internal_reference: z.string().max(50).optional(),
  })
  .refine(
    (data) => {
      if (data.end_date && data.start_date && data.end_date < data.start_date) {
        return false;
      }
      return true;
    },
    {
      message: 'Enddatum muss nach dem Startdatum liegen',
      path: ['end_date'],
    }
  );

// Type exports
export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
export type FinancingTypeFormData = z.infer<typeof financingTypeSchema>;
export type KaufPaymentFormData = z.infer<typeof kaufPaymentSchema>;
export type LeasingPaymentFormData = z.infer<typeof leasingPaymentSchema>;
export type RatenzahlungPaymentFormData = z.infer<typeof ratenzahlungPaymentSchema>;
export type MetadataFormData = z.infer<typeof metadataSchema>;
export type InvestmentFormData = z.infer<typeof investmentFormSchema>;
