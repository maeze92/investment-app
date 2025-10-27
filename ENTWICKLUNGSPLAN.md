# 🚀 Entwicklungsplan - Investitionsplanungs-App

**Letzte Aktualisierung**: 27. Oktober 2025
**Version**: 1.0.0
**Status**: Phase 1-6 abgeschlossen ✅

---

## 📊 Projekt-Übersicht

### **Gesamtfortschritt: 85%**

| Phase | Status | Fortschritt | Geschätzte Zeit | Tatsächliche Zeit |
|-------|--------|-------------|-----------------|-------------------|
| ✅ Phase 1: Foundation | Abgeschlossen | 100% | 2-3 Tage | 2 Tage |
| ✅ Phase 2: Data Layer | Abgeschlossen | 100% | 2-3 Tage | 2 Tage |
| ✅ Phase 3: Authentication | Abgeschlossen | 100% | 2-3 Tage | 2 Tage |
| ✅ Phase 4: Investment Management | Abgeschlossen | 100% | 3-4 Tage | 3 Tage |
| ✅ Phase 5: Approval Workflow | Abgeschlossen | 100% | 2-3 Tage | 2 Tage |
| ✅ Phase 6: Dashboards | Abgeschlossen | 100% | 3-4 Tage | 3 Tage |
| 🚧 Phase 7: Notifications & Reports | In Planung | 0% | 2-3 Tage | - |
| 🚧 Phase 8: Testing & Polish | In Planung | 0% | 2-3 Tage | - |

**Geschätzte Gesamt-Entwicklungszeit**: 16-23 Tage (3-5 Wochen)
**Bisherige Entwicklungszeit**: 14 Tage

---

## ✅ Phase 1: Foundation (ABGESCHLOSSEN)

### **Ziel**: Basis-Infrastruktur aufbauen

### **Implementiert:**
- ✅ Next.js 15 Setup mit TypeScript
- ✅ Tailwind CSS + PostCSS Konfiguration
- ✅ shadcn/ui Integration (6 Components)
- ✅ ESLint + Prettier Setup
- ✅ Projektstruktur definiert
- ✅ Dependencies installiert (25+)

### **Dateien:**
- `package.json` - Dependencies & Scripts
- `tsconfig.json` - TypeScript Config
- `tailwind.config.ts` - Tailwind Setup
- `next.config.ts` - Next.js Config
- `app/layout.tsx` - Root Layout
- `app/globals.css` - Global Styles

### **UI Components:**
- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/input.tsx`
- `components/ui/label.tsx`
- `components/ui/badge.tsx`
- `components/ui/select.tsx`
- `components/ui/alert.tsx`

---

## ✅ Phase 2: Data Layer (ABGESCHLOSSEN)

### **Ziel**: Lokale Datenhaltung mit Migrations-Pfad

### **Implementiert:**
- ✅ LocalStorageService (Singleton Pattern)
- ✅ Data Adapter Pattern (für Supabase-Migration)
- ✅ Mock Data Generator (Faker.js)
- ✅ CRUD Operations für alle Entities
- ✅ Seed & Reset Scripts
- ✅ TypeScript Interfaces (28 Types)

### **Dateien:**
- `lib/storage/LocalStorageService.ts` - Storage Service (287 Zeilen)
- `lib/storage/DataAdapter.ts` - Abstraction Layer (204 Zeilen)
- `lib/utils/mockDataGenerator.ts` - Test-Daten (556 Zeilen)
- `types/entities.ts` - Entity Interfaces (157 Zeilen)
- `types/enums.ts` - Enums & Constants (86 Zeilen)
- `types/dtos.ts` - Data Transfer Objects (134 Zeilen)
- `scripts/seed.ts` - Seed Script
- `scripts/reset.ts` - Reset Script

### **Generierte Mock-Daten:**
- 2 Gruppen
- 6 Unternehmen
- 15 Benutzer (inkl. 5 Demo-User)
- 30 Investitionen
- ~538 Cashflows

---

## ✅ Phase 3: Authentication (ABGESCHLOSSEN)

### **Ziel**: Mock Auth mit Role-based Access Control

### **Implementiert:**
- ✅ Mock Authentication System (JWT-ähnlich)
- ✅ Zustand Store für Auth State
- ✅ Zustand Store für App State
- ✅ Login UI mit Quick-Login Buttons
- ✅ Dashboard mit Basic Overview
- ✅ AppProvider für Store-Initialisierung
- ✅ Role-based Access Control Helpers
- ✅ Storage Status Check Hook
- ✅ Verbessertes Error Handling

### **Dateien:**
- `stores/useAuthStore.ts` - Auth State (200+ Zeilen)
- `stores/useAppStore.ts` - App State (380 Zeilen)
- `components/providers/AppProvider.tsx` - Provider
- `app/login/page.tsx` - Login UI (235 Zeilen)
- `app/dashboard/page.tsx` - Dashboard
- `app/seed/page.tsx` - Seed UI
- `hooks/useStorageStatus.ts` - Storage Check

### **Demo-Benutzer:**
| Rolle | E-Mail | Passwort |
|-------|--------|----------|
| Verwaltungsrat | vr@demo.de | demo |
| CFO | cfo@demo.de | demo |
| Geschäftsführer | gf@demo.de | demo |
| Cashflow Manager | cm@demo.de | demo |
| Buchhaltung | buchhaltung@demo.de | demo |

---

## ✅ Phase 4: Investment Management (ABGESCHLOSSEN)

### **Ziel**: Vollständiges CRUD für Investitionen

### **Status**: ✅ Abgeschlossen
**Tatsächliche Zeit**: 3-4 Tage

### **Implementierte Features:**

#### **4.1 Investment List View** ✅
- ✅ Tabelle mit allen Investitionen
- ✅ Filtering nach:
  - Status (Entwurf, Zur Genehmigung, Genehmigt, etc.)
  - Kategorie (Fahrzeuge, IT, Maschinen, etc.)
  - Finanzierungstyp (Kauf, Leasing, etc.)
  - Unternehmen
  - Datum-Range
- ✅ Sorting nach:
  - Name, Betrag, Datum, Status, Company, Category
- ✅ Search Bar (Volltextsuche)
- ✅ Pagination (50 pro Seite)
- ✅ Statistics Cards (Gesamt, Entwurf, Zur Genehmigung, Genehmigt)

**Erstellte Dateien:**
- ✅ `app/investments/page.tsx` - List View (273 Zeilen)
- ✅ `components/investments/InvestmentTable.tsx` (235 Zeilen)
- ✅ `components/investments/InvestmentFilters.tsx` (118 Zeilen)

#### **4.2 Investment Create Form (Multi-Step Wizard)** ✅

**Step 1: Basic Info** ✅
- ✅ Name (Text Input mit Validation)
- ✅ Beschreibung (Textarea, optional)
- ✅ Kategorie (Select: Fahrzeuge, IT, Maschinen, Immobilien, Sonstige)
- ✅ Unternehmen (Select Dropdown)
- ✅ Gesamtbetrag (Number Input mit EUR Formatierung)
- ✅ Start-Datum (Date Picker)
- ✅ End-Datum (Optional Date Picker)

**Step 2: Finanzierungstyp wählen** ✅
- ✅ Card-basierte Auswahl für:
  - Kauf (Einmalzahlung)
  - Leasing
  - Ratenzahlung
  - Miete

**Step 3: Zahlungsstruktur (dynamisch je nach Typ)** ✅

**Für KAUF:** ✅
- ✅ Einmalzahlung Datum (Date Picker)
- ✅ Custom Due Date (Optional, Checkbox + Date Picker)

**Für LEASING:** ✅
- ✅ Anzahlung (Optional, Number Input)
- ✅ Anzahlung Datum (Date Picker wenn Anzahlung)
- ✅ Anzahlung Custom Due Date (Optional)
- ✅ Monatliche Rate (Number Input)
- ✅ Laufzeit in Monaten (Number Input)
- ✅ Start-Monat (Date Picker)
- ✅ Schlussrate (Optional, Number Input)
- ✅ Schlussrate Datum (Date Picker)
- ✅ Kaufoption (Checkbox)
- ✅ Auto-Confirm (Checkbox, default: true)

**Für RATENZAHLUNG:** ✅
- ✅ Anzahlung (Optional, Number Input)
- ✅ Anzahlung Datum (Date Picker wenn Anzahlung)
- ✅ Anzahlung Custom Due Date (Optional)
- ✅ Anzahl Raten (Number Input)
- ✅ Raten-Betrag (Number Input)
- ✅ Raten-Intervall (Select: Monatlich, Quartalsweise, Jährlich)
- ✅ Erste Rate Datum (Date Picker)
- ✅ Schlussrate (Optional, Number Input)
- ✅ Schlussrate Datum (Date Picker wenn Schlussrate)

**Für MIETE:** ✅
- ✅ Wie Leasing implementiert
- ✅ Monatliche Miete (Number Input)
- ✅ Mietdauer (Number Input)

**Step 4: Metadaten** ✅
- ✅ Lieferant/Vendor (Text Input)
- ✅ Vertragsnummer (Text Input)
- ✅ Interne Referenz (Text Input)

**Step 5: Zusammenfassung & Bestätigung** ✅
- ✅ Übersicht aller eingegebenen Daten
- ✅ "Als Entwurf speichern" Button
- ✅ "Zur Genehmigung einreichen" Button (Placeholder)

**Erstellte Dateien:**
- ✅ `app/investments/new/page.tsx` - Create Wizard (80 Zeilen)
- ✅ `components/investments/InvestmentWizard.tsx` (179 Zeilen)
- ✅ `components/investments/steps/BasicInfoStep.tsx` (162 Zeilen)
- ✅ `components/investments/steps/FinancingTypeStep.tsx` (100 Zeilen)
- ✅ `components/investments/steps/PaymentStructureStep.tsx` (454 Zeilen)
- ✅ `components/investments/steps/MetadataStep.tsx` (63 Zeilen)
- ✅ `components/investments/steps/SummaryStep.tsx` (208 Zeilen)
- ✅ `lib/validation/investmentSchemas.ts` - Zod Schemas (229 Zeilen)
- ✅ `components/ui/checkbox.tsx` - UI Component (29 Zeilen)

#### **4.3 Cashflow Auto-Generation** ✅

**Implementierte Logik:**
- ✅ Cashflow Generator Service erstellt
- ✅ Für KAUF: 1 Cashflow (Einmalzahlung)
- ✅ Für LEASING:
  - Anzahlung (wenn vorhanden)
  - Monatliche Raten (duration_months)
  - Schlussrate (wenn vorhanden)
  - Auto-Confirm Flag setzen
- ✅ Für RATENZAHLUNG:
  - Anzahlung (wenn vorhanden)
  - Raten nach Intervall (monatlich/quartalsweise/jährlich)
  - Schlussrate (wenn vorhanden)
  - Custom Due Dates berücksichtigen
- ✅ Für MIETE: Wie Leasing ohne Kaufoption
- ✅ Month/Year Berechnung aus Due Date
- ✅ Status-Zuordnung basierend auf Investment Status
- ✅ Validierung: Summe aller Cashflows = Total Amount
- ✅ Integration in createInvestment und updateInvestment

**Erstellte Dateien:**
- ✅ `lib/cashflow/cashflowGenerator.ts` (161 Zeilen)
- ✅ `lib/cashflow/cashflowCalculator.ts` (229 Zeilen)
- ✅ `lib/cashflow/dateHelpers.ts` (100 Zeilen)
- ✅ Updated: `stores/useAppStore.ts` - Integration

#### **4.4 Investment Details View** ✅

- ✅ Investment Header (Name, Status Badge, Actions)
- ✅ Basic Info Section
- ✅ Payment Structure Display (dynamisch basierend auf Financing Type)
- ✅ Cashflow Table (alle Zahlungen für diese Investition)
  - Sortable Columns
  - Summary Statistics (Total, Paid, Outstanding)
  - Two-level Confirmation (CM → GF)
  - Status Badges
- ✅ Timeline/History
- ✅ Actions:
  - Bearbeiten (nur wenn Entwurf)
  - Zur Genehmigung einreichen (Placeholder)
  - Löschen (mit Confirmation Dialog)
  - Dropdown Menu (Duplicate, Export PDF - Placeholders)

**Erstellte Dateien:**
- ✅ `app/investments/[id]/page.tsx` (127 Zeilen)
- ✅ `components/investments/InvestmentDetails.tsx` (345 Zeilen)
- ✅ `components/investments/InvestmentHeader.tsx` (141 Zeilen)
- ✅ `components/investments/InvestmentCashflows.tsx` (230 Zeilen)
- ✅ `components/investments/InvestmentTimeline.tsx` (132 Zeilen)
- ✅ `components/ui/dropdown-menu.tsx` - UI Component (205 Zeilen)
- ✅ `components/ui/table.tsx` - UI Component (91 Zeilen)

#### **4.5 Investment Edit** ✅

- ✅ Wie Create Form, aber mit vorausgefüllten Daten
- ✅ Nur editierbar wenn Status = "Entwurf"
- ✅ Automatische Cashflow-Regenerierung beim Update
- ✅ "Änderungen speichern" Button
- ✅ Navigation zurück zu Details nach Save
- ✅ Permission Checks (nur GF & CFO)

**Erstellte Dateien:**
- ✅ `app/investments/[id]/edit/page.tsx` (80 Zeilen)
- ✅ Updated: `components/investments/InvestmentWizard.tsx` - Edit Mode Support
- ✅ Wiederverwendung von allen Wizard Step Components

#### **4.6 Validation & Business Rules** ✅

- ✅ Zod Schema für Investment Creation
- ✅ Zod Schema für Payment Structures (alle 4 Typen)
- ✅ Validation Rules:
  - Total Amount > 0
  - Name min 3 chars, max 100
  - Category required
  - Company required
  - Start Date required
  - Payment Structure basierend auf Financing Type
  - Custom Validations für Anzahlung (required if date set)
- ✅ Error Messages (auf Deutsch)
- ✅ Real-time Validation im Form (React Hook Form + Zod)

**Erstellte Dateien:**
- ✅ `lib/validation/investmentSchemas.ts` - Alle Schemas (229 Zeilen)

### **Zusätzliche Features in Phase 4:**

#### **Navigation System** ✅
- ✅ `components/layout/Navigation.tsx` - Wiederverwendbare Navigation (60 Zeilen)
- ✅ Sticky Header mit User Info
- ✅ Active Link Highlighting
- ✅ Integriert in: Dashboard, Investments, New, Edit, Details
- ✅ Dashboard Quick Access Cards mit Click Handlers

### **Phase 4 Zusammenfassung:**

**Gesamtstatistik:**
- ✅ **20+ neue Komponenten** erstellt
- ✅ **~3500 Zeilen Code** geschrieben
- ✅ **Vollständiges CRUD** für Investitionen
- ✅ **Multi-Step Wizard** mit 5 Steps
- ✅ **Automatische Cashflow-Generierung** für 4 Financing Types
- ✅ **Two-Level Cashflow Confirmation** (CM → GF)
- ✅ **Permission-based UI** für alle Rollen
- ✅ **Responsive Design** mit Tailwind CSS
- ✅ **Type-Safe** mit TypeScript & Zod
- ✅ **Build erfolgreich** - keine Errors

---

## ✅ Phase 5: Approval Workflow (ABGESCHLOSSEN)

### **Ziel**: Genehmigungsprozess implementieren

### **Status**: ✅ Abgeschlossen
**Tatsächliche Zeit**: 2-3 Tage

### **Implementierte Features:**

#### **5.1 Approval Workflow für Investitionen** ✅

**Workflow-Schritte:**
1. Geschäftsführer erstellt Investment (Status: Entwurf) ✅
2. GF reicht zur Genehmigung ein (Status: Zur Genehmigung) ✅
3. Verwaltungsrat genehmigt/ablehnt ✅
4. Bei Genehmigung: Status = Genehmigt, Cashflows = Ausstehend ✅
5. Bei Ablehnung: Status = Abgelehnt, Cashflows = Storniert ✅

**UI Components:**
- ✅ Approval List View (für VR) mit Filtering & Sorting
- ✅ Approval Card mit Investment Details
- ✅ Genehmigen Button (mit optional Comment & Bedingungen)
- ✅ Ablehnen Button (mit required Comment)
- ✅ Conditional Approval (mit Bedingungen)
- ✅ Approval History Timeline anzeigen
- ✅ Status Transitions mit StatusBadge visualisiert

**Erstellte Dateien:**
- ✅ `app/approvals/page.tsx` - Approval List (380 Zeilen)
- ✅ `components/approvals/ApprovalCard.tsx` (125 Zeilen)
- ✅ `components/approvals/ApprovalDialog.tsx` (255 Zeilen)
- ✅ `components/approvals/ApprovalHistory.tsx` (130 Zeilen)

#### **5.2 Two-Stage Cashflow Confirmation** ✅

**Stage 1: Cashflow Manager Confirmation**
- ✅ Monatliche Cashflow-Übersicht (Monat/Jahr Filter)
- ✅ Cashflow Manager markiert Cashflows als "Vorbestätigt"
- ✅ Kommentar-Feld für jede Zahlung
- ✅ Einzelne Confirmation mit Dialog
- ✅ Filter: Ausstehend, Vorbestätigt, Bestätigt, Verschoben
- ✅ Statistik-Cards für alle Status

**Stage 2: Geschäftsführer Approval**
- ✅ GF sieht alle vorbestätigten Cashflows seiner Firma
- ✅ GF gibt finale Freigabe
- ✅ Status wechselt zu "Bestätigt"
- ✅ Kommentar-Feld
- ✅ Zeigt CM Vorbestätigung an

**Erstellte Dateien:**
- ✅ `app/cashflows/page.tsx` - Cashflow Management Page (420 Zeilen)
- ✅ `components/cashflows/CashflowTable.tsx` - Wiederverwendbare Tabelle (265 Zeilen)
- ✅ `components/cashflows/CashflowConfirmationDialog.tsx` (180 Zeilen)
- ✅ `components/cashflows/PostponeDialog.tsx` (170 Zeilen)

#### **5.3 Postponement Logic** ✅

**Zahlungen verschieben:**
- ✅ "Verschieben" Button bei jedem Cashflow
- ✅ Dialog mit:
  - ✅ Neues Datum (Date Picker mit Validierung)
  - ✅ Grund (Textarea, required)
  - ✅ Bestätigen/Abbrechen
- ✅ Original Due Date wird gespeichert
- ✅ Status wechselt zu "Verschoben"
- ✅ Zeigt "Verschoben von X" in Tabelle an

**Erstellte Dateien:**
- ✅ `components/cashflows/PostponeDialog.tsx` (170 Zeilen)
- ✅ Integration in `stores/useAppStore.ts` (postponeCashflow Methode)

#### **5.4 Status Management** ✅

**Status-Automaten implementiert:**

**Investment Status:**
```
Entwurf → Zur Genehmigung → Genehmigt → Aktiv → Abgeschlossen
                ↓
             Abgelehnt → Entwurf (kann neu eingereicht werden)
```

**Cashflow Status:**
```
Geplant → Ausstehend → Vorbestätigt → Bestätigt
              ↓
          Verschoben → Ausstehend
              ↓
          Storniert
```

- ✅ Status Transition Guards (Regeln mit Permission Checks)
- ✅ Status History Tracking (via InvestmentApproval)
- ✅ Status Badge Components (farbcodiert)
- ✅ Status-basierte Actions (role-based enable/disable)

**Erstellte Dateien:**
- ✅ `lib/workflow/statusMachine.ts` - State Machine (180 Zeilen)
- ✅ `lib/workflow/transitionGuards.ts` - Permission Guards (350 Zeilen)
- ✅ `components/shared/StatusBadge.tsx` - Wiederverwendbare Badges (75 Zeilen)

#### **5.5 UI Components (shadcn/ui)** ✅

**Neue Components:**
- ✅ `components/ui/dialog.tsx` - Dialog/Modal Komponente
- ✅ `components/ui/tabs.tsx` - Tabs Komponente
- ✅ `components/ui/tooltip.tsx` - Tooltip Komponente

#### **5.6 Navigation & Integration** ✅

**Updates:**
- ✅ `components/layout/Navigation.tsx` - Role-based Links hinzugefügt
  - Approvals-Link (nur VR)
  - Cashflows-Link (CM, GF, CFO, Buchhaltung)
- ✅ `components/investments/InvestmentDetails.tsx` - ApprovalHistory integriert
- ✅ `app/dashboard/page.tsx` - Quick-Action Cards aktiviert
- ✅ `stores/useAppStore.ts` - Users-Array hinzugefügt

### **Phase 5 Zusammenfassung:**

**Gesamtstatistik:**
- ✅ **30+ neue Dateien** erstellt
- ✅ **~4,500 Zeilen Code** geschrieben
- ✅ **Vollständiger Approval Workflow** für Investitionen
- ✅ **Two-Stage Cashflow Confirmation** System
- ✅ **Status Management** mit Transition Guards
- ✅ **Permission-based UI** für alle Rollen
- ✅ **Responsive Design** mit Tailwind CSS
- ✅ **Type-Safe** mit TypeScript
- ✅ **Build erfolgreich** - keine Errors

**Key Features:**
1. **VR kann Investitionen genehmigen/ablehnen** mit Kommentaren
2. **Cashflow Manager** kann Cashflows vorbestätigen
3. **Geschäftsführer** gibt finale Freigabe für Cashflows
4. **Zahlungen können verschoben werden** mit Begründung
5. **Vollständige Approval-Historie** sichtbar in Investment Details
6. **Role-based Access Control** auf allen Ebenen
7. **Farbcodierte Status-Badges** für bessere UX

---

## ✅ Phase 6: Role-specific Dashboards (ABGESCHLOSSEN)

### **Ziel**: Individuelle Dashboards für jede Rolle

### **Status**: ✅ Abgeschlossen
**Tatsächliche Zeit**: 3 Tage

### **Implementierte Features:**

#### **6.1 Verwaltungsrat Dashboard** ✅

**KPIs:**
- ✅ Investitionssumme (aktuelles Jahr)
- ✅ Ausstehende Genehmigungen (Count)
- ✅ Genehmigte Investitionen (Count + Percentage)
- ✅ Alle Investitionen (Total Count)

**Widgets:**
- ✅ Pending Approvals Widget (Top 5 mit Details)
- ✅ Investment Charts Widget (Tabs: Status / Kategorie / Trend)
  - Status: Pie Chart
  - Kategorie: Bar Chart
  - Trend: Line Chart (letzte 12 Monate)

**Erstellte Dateien:**
- ✅ `app/dashboard/vr/page.tsx`
- ✅ `components/dashboard/vr/PendingApprovalsWidget.tsx`
- ✅ `components/dashboard/vr/InvestmentChartsWidget.tsx`

#### **6.2 CFO Dashboard** ✅

**KPIs:**
- ✅ Gesamtinvestitionswert (alle Unternehmen)
- ✅ Durchschnittliche Investitionsgröße
- ✅ Leasing vs. Kauf Verhältnis
- ✅ Fällige Zahlungen (nächste 30 Tage)

**Widgets:**
- ✅ Cashflow-Prognose (12 Monate Line Chart)
- ✅ Company Comparison (Bar Chart)
- ✅ Financial Summary Cards (Leasing/Kauf Breakdown)

**Erstellte Dateien:**
- ✅ `app/dashboard/cfo/page.tsx`
- ✅ `components/dashboard/cfo/CashflowForecastWidget.tsx`
- ✅ `components/dashboard/cfo/CompanyComparisonWidget.tsx`

#### **6.3 Geschäftsführer Dashboard** ✅

**KPIs:**
- ✅ Investitionssumme (eigenes Unternehmen)
- ✅ Entwürfe in Bearbeitung
- ✅ Genehmigte Investitionen (eigene)
- ✅ Offene Bestätigungen (Cashflows)

**Widgets:**
- ✅ Quick Actions Widget (3 Hauptaktionen)
- ✅ Upcoming Payments Widget (nächste 90 Tage)
- ✅ Investment Status Cards (Zur Genehmigung / Aktiv / Abgeschlossen)

**Erstellte Dateien:**
- ✅ `app/dashboard/gf/page.tsx`
- ✅ `components/dashboard/gf/QuickActionsWidget.tsx`
- ✅ `components/dashboard/gf/UpcomingPaymentsWidget.tsx`

#### **6.4 Cashflow Manager Dashboard** ✅

**KPIs:**
- ✅ Ausstehend (aktueller Monat)
- ✅ Vorbestätigt (Count)
- ✅ Bestätigt (Count)
- ✅ Überfällig (Count + Warning)

**Widgets:**
- ✅ Monthly Status Widget (4 Status-Cards mit Beträgen)
- ✅ Quick Action Buttons (Bestätigen / Monatsbericht / Überfällige)
- ✅ Overdue Warnings (falls vorhanden)

**Erstellte Dateien:**
- ✅ `app/dashboard/cm/page.tsx`
- ✅ `components/dashboard/cm/MonthlyStatusWidget.tsx`

#### **6.5 Buchhaltung Dashboard** ✅

**KPIs:**
- ✅ Bestätigte Zahlungen (Gesamt)
- ✅ Aktueller Monat (Count + Betrag)
- ✅ Auto-Bestätigt (Leasing Payments)
- ✅ Unternehmen (Count)

**Widgets:**
- ✅ Confirmed Payments Widget (Top 10)
- ✅ Export Options Widget (Placeholder für Phase 7)
- ✅ Category & Company Charts (Pie & Bar)

**Erstellte Dateien:**
- ✅ `app/dashboard/buchhaltung/page.tsx`
- ✅ `components/dashboard/buchhaltung/ConfirmedPaymentsWidget.tsx`

#### **6.6 Gemeinsame Dashboard Components** ✅

**Wiederverwendbare Widgets:**
- ✅ KPI Card (mit optionalem Trend-Indikator)
- ✅ Stat Card (einfache Statistik-Karte)
- ✅ Mini Chart Component (Line, Bar, Pie mit Recharts)
- ✅ Data Table (mit Sorting)
- ✅ Loading Skeletons (3 Varianten)
- ✅ Empty States

**Erstellte Dateien:**
- ✅ `components/dashboard/shared/KPICard.tsx`
- ✅ `components/dashboard/shared/StatCard.tsx`
- ✅ `components/dashboard/shared/MiniChart.tsx`
- ✅ `components/dashboard/shared/DataTable.tsx`
- ✅ `components/dashboard/shared/EmptyState.tsx`
- ✅ `components/dashboard/shared/LoadingSkeleton.tsx`

#### **6.7 Dashboard Helper Utilities** ✅

**Erstellte Dateien:**
- ✅ `lib/utils/dateRangeHelpers.ts` (15+ Funktionen)
- ✅ `lib/utils/chartHelpers.ts` (8 Chart-Formatierungsfunktionen)
- ✅ `lib/utils/dashboardHelpers.ts` (18 KPI-Berechnungsfunktionen)

#### **6.8 Dashboard Routing** ✅

**Implementiert:**
- ✅ Automatische Weiterleitung von `/dashboard` zu rollenspezifischem Dashboard
- ✅ Permission Guards für alle Dashboard-Routen
- ✅ Role-based Dashboard Selection

**Aktualisierte Dateien:**
- ✅ `app/dashboard/page.tsx` (Auto-Redirect Logic)

### **Phase 6 Zusammenfassung:**

**Gesamtstatistik:**
- ✅ **25+ neue Dateien** erstellt
- ✅ **~2.800 Zeilen Code** geschrieben
- ✅ **5 Rollenspezifische Dashboards** komplett funktionsfähig
- ✅ **15+ Widgets** implementiert
- ✅ **6 Shared Components** wiederverwendbar
- ✅ **3 Helper Utility Dateien** mit 40+ Funktionen
- ✅ **Charts mit Recharts** (Pie, Bar, Line)
- ✅ **Responsive Design** mit Tailwind CSS
- ✅ **Type-Safe** mit TypeScript
- ✅ **Build erfolgreich** - keine Errors

**Bundle Sizes:**
```
Route (app)                              Size     First Load JS
├ ○ /dashboard/vr                       6.8 kB    241 kB
├ ○ /dashboard/cfo                      3.52 kB   234 kB
├ ○ /dashboard/gf                       3.38 kB   125 kB
├ ○ /dashboard/cm                       2.65 kB   124 kB
├ ○ /dashboard/buchhaltung              3.96 kB   234 kB
```

**Key Features:**
1. **Rollenspezifische KPIs** für jedes Dashboard
2. **Interaktive Charts** mit Recharts
3. **Real-time Data** aus Store
4. **Permission-based Access** auf Dashboard-Ebene
5. **Quick Actions** für häufige Aufgaben
6. **Responsive Layout** für alle Bildschirmgrößen
7. **Empty & Loading States** für bessere UX

---

## 🚧 Phase 7: Notifications & Reports (TODO)

### **Ziel**: Benachrichtigungssystem und Export-Funktionen

### **Priorität**: MITTEL 🟡
**Geschätzte Zeit**: 2-3 Tage

### **Features zu implementieren:**

#### **7.1 Local Notification Service**

**Business Rules Engine:**

**Rule 1: Payment Due Soon (ohne Custom Date)**
- Trigger: 7 Tage vor Zahlung
- Recipients: Cashflow Manager, Geschäftsführer
- Priority: Medium
- Message: "Zahlung in 7 Tagen fällig: {amount} für {investment}"

**Rule 2: Payment Overdue (mit Custom Date)**
- Trigger: Nach Fälligkeitsdatum
- Recipients: Cashflow Manager, Geschäftsführer, CFO
- Priority: High
- Message: "Zahlung überfällig: {amount} für {investment}"

**Rule 3: Investment Submitted**
- Trigger: Status wechselt zu "Zur Genehmigung"
- Recipients: Alle VR mit Genehmigungsrecht
- Priority: Medium
- Message: "Neue Investition zur Genehmigung: {name} ({amount})"

**Rule 4: Investment Approved**
- Trigger: Investment genehmigt
- Recipients: Ersteller (Geschäftsführer)
- Priority: Medium
- Message: "Ihre Investition wurde genehmigt: {name}"

**Rule 5: Investment Rejected**
- Trigger: Investment abgelehnt
- Recipients: Ersteller (Geschäftsführer)
- Priority: High
- Message: "Ihre Investition wurde abgelehnt: {name}. Grund: {comment}"

**Rule 6: Monthly Report Due**
- Trigger: 5. Tag des Folgemonats
- Recipients: Cashflow Manager, Geschäftsführer
- Priority: High
- Message: "Monatlicher Cashflow-Report überfällig für {month} {year}"

**Rule 7: Cashflow Needs Confirmation**
- Trigger: Cashflow Manager hat bestätigt
- Recipients: Geschäftsführer
- Priority: Medium
- Message: "{count} Cashflows warten auf Ihre Freigabe"

**Rule 8: Cashflow Postponed**
- Trigger: Zahlung verschoben
- Recipients: CFO, Geschäftsführer
- Priority: Medium
- Message: "Zahlung verschoben: {amount} auf {new_date}. Grund: {reason}"

**Dateien zu erstellen:**
- `lib/notifications/NotificationService.ts`
- `lib/notifications/businessRules.ts`
- `lib/notifications/ruleEngine.ts`
- `lib/notifications/notificationQueue.ts`

#### **7.2 Notification Center UI**

**Components:**
- [ ] Notification Bell Icon (mit Badge Counter)
- [ ] Notification Dropdown (letzte 10)
- [ ] Notification Center Page (alle)
- [ ] Notification Item (mit Icon, Titel, Message, Zeit)
- [ ] Mark as Read Button
- [ ] Clear All Button
- [ ] Filter by Type
- [ ] Filter by Priority

**Dateien zu erstellen:**
- `components/notifications/NotificationBell.tsx`
- `components/notifications/NotificationDropdown.tsx`
- `components/notifications/NotificationItem.tsx`
- `app/notifications/page.tsx`

#### **7.3 Toast Notifications**

**Verwendung:**
- Success: Nach erfolgreicher Aktion
- Error: Bei Fehlern
- Warning: Bei Warnungen
- Info: Für Hinweise

**Dateien zu erstellen:**
- `components/ui/toast.tsx`
- `components/ui/toaster.tsx`
- `hooks/useToast.ts`

#### **7.4 Report Generation**

**Monthly Report (Excel):**
- [ ] Alle Cashflows für Monat X
- [ ] Gruppiert nach:
  - Status
  - Unternehmen
  - Kategorie
  - Finanzierungstyp
- [ ] Summen und Subtotals
- [ ] Charts (embedded)

**Yearly Overview (Excel):**
- [ ] Alle Investitionen des Jahres
- [ ] Monatlicher Cashflow-Breakdown
- [ ] Pivot Table vorbereitet
- [ ] Summary Sheet

**Investment Report (PDF):**
- [ ] Investment Details
- [ ] Cashflow Schedule
- [ ] Payment History
- [ ] Approval History
- [ ] Company Header/Footer

**Booking Journal (CSV):**
- [ ] Confirmed Cashflows
- [ ] Format für Buchhaltungssoftware
- [ ] Konten-Zuordnung (konfigurierbar)

**Dateien zu erstellen:**
- `lib/reports/excelGenerator.ts`
- `lib/reports/pdfGenerator.ts`
- `lib/reports/csvGenerator.ts`
- `components/reports/ReportDialog.tsx`
- `components/reports/ExportButton.tsx`

#### **7.5 Email Notifications (Preparation)**

**Vorbereitung für zukünftige Email-Integration:**
- [ ] Email Templates (HTML)
- [ ] Email Service Interface
- [ ] Queue System für Batch-Versand
- [ ] Unsubscribe Logic

**Dateien zu erstellen:**
- `lib/email/emailService.ts`
- `lib/email/templates/` (Folder)
- `lib/email/templates/paymentDue.html`
- `lib/email/templates/investmentApproved.html`

---

## 🚧 Phase 8: Testing, Polish & Dev Tools (TODO)

### **Ziel**: Qualitätssicherung und Developer Experience

### **Priorität**: MITTEL 🟡
**Geschätzte Zeit**: 2-3 Tage

### **Features zu implementieren:**

#### **8.1 Dev Tools Panel**

**Features:**
- [ ] Toggle mit Keyboard Shortcut (Ctrl+Shift+D)
- [ ] Storage Info (Used/Available)
- [ ] Current User Info
- [ ] Role Switcher (schneller Rollenwechsel)
- [ ] Time Simulation:
  - Set system date
  - Advance time by X days
  - Trigger notifications manually
- [ ] Data Management:
  - Seed Database
  - Reset Database
  - Clear Notifications
  - Export Data (JSON)
  - Import Data (JSON)
- [ ] Performance Metrics:
  - Render times
  - Storage size
  - Component tree
- [ ] API Call Log (Mock API)

**Dateien zu erstellen:**
- `components/dev-tools/DevToolsPanel.tsx`
- `components/dev-tools/StorageInfo.tsx`
- `components/dev-tools/RoleSwitcher.tsx`
- `components/dev-tools/TimeSimulator.tsx`
- `components/dev-tools/DataManager.tsx`
- `components/dev-tools/PerformanceMetrics.tsx`

#### **8.2 Unit Tests**

**Test Coverage Ziele:**
- [ ] Utils Functions: 100%
- [ ] Business Logic: 90%
- [ ] Components: 70%
- [ ] Stores: 80%

**Tests zu schreiben:**
- [ ] `lib/utils.test.ts` - Utility Functions
- [ ] `lib/cashflow/cashflowGenerator.test.ts`
- [ ] `lib/storage/LocalStorageService.test.ts`
- [ ] `stores/useAuthStore.test.ts`
- [ ] `stores/useAppStore.test.ts`
- [ ] `components/investments/InvestmentForm.test.tsx`

**Dateien zu erstellen:**
- `__tests__/unit/` (Folder)
- Jest Config
- Test Utils
- Mock Factories

#### **8.3 Integration Tests**

**Test Scenarios:**
- [ ] Complete Investment Workflow:
  1. Login als GF
  2. Create Investment
  3. Submit for Approval
  4. Login als VR
  5. Approve Investment
  6. Verify Cashflows generated
  7. Verify Notifications sent

- [ ] Cashflow Confirmation Workflow:
  1. Login als CM
  2. Confirm Cashflows
  3. Login als GF
  4. Final Approval
  5. Verify Status changes

- [ ] Rejection Workflow:
  1. Create Investment
  2. Submit for Approval
  3. Reject with Comment
  4. Verify Status and Notifications

**Dateien zu erstellen:**
- `__tests__/integration/` (Folder)
- Test scenarios files

#### **8.4 E2E Tests (Playwright)**

**Critical User Flows:**
- [ ] Login Flow
- [ ] Create Investment Flow
- [ ] Approval Flow
- [ ] Cashflow Confirmation Flow
- [ ] Report Generation Flow

**Dateien zu erstellen:**
- `playwright.config.ts`
- `e2e/login.spec.ts`
- `e2e/investment-workflow.spec.ts`
- `e2e/approval-workflow.spec.ts`

#### **8.5 Performance Optimization**

**Optimierungen:**
- [ ] React.memo für Heavy Components
- [ ] useMemo für teure Berechnungen
- [ ] useCallback für Event Handlers
- [ ] Virtual Scrolling für lange Listen
- [ ] Lazy Loading für Routes
- [ ] Code Splitting
- [ ] Image Optimization
- [ ] Bundle Size Reduction

**Tools:**
- [ ] React DevTools Profiler
- [ ] Lighthouse Audit
- [ ] Bundle Analyzer

#### **8.6 Accessibility (a11y)**

**Standards:**
- [ ] WCAG 2.1 Level AA
- [ ] Keyboard Navigation
- [ ] Screen Reader Support
- [ ] Color Contrast Check
- [ ] Focus Management
- [ ] ARIA Labels

**Tools:**
- [ ] axe DevTools
- [ ] Lighthouse Accessibility Audit

#### **8.7 Error Boundaries**

**Implementieren:**
- [ ] Global Error Boundary
- [ ] Component-level Error Boundaries
- [ ] Error Logging
- [ ] User-friendly Error Pages
- [ ] 404 Page
- [ ] 500 Page

**Dateien zu erstellen:**
- `components/errors/ErrorBoundary.tsx`
- `app/error.tsx`
- `app/not-found.tsx`

#### **8.8 Loading States**

**Skeleton Screens:**
- [ ] Dashboard Loading
- [ ] Table Loading
- [ ] Form Loading
- [ ] Card Loading
- [ ] Chart Loading

**Dateien zu erstellen:**
- `components/shared/Skeleton.tsx`
- `components/shared/LoadingSpinner.tsx`

---

## 📦 Migration zu Supabase (FUTURE)

### **Wenn Supabase verfügbar wird:**

#### **Schritt 1: Supabase Setup**
- [ ] Supabase Projekt erstellen
- [ ] Database Schema erstellen (via Migrations)
- [ ] Row Level Security (RLS) Policies
- [ ] Auth Setup

#### **Schritt 2: Migration Script**
- [ ] Export Local Storage Data
- [ ] Transform zu Supabase Schema
- [ ] Bulk Insert in richtiger Reihenfolge
- [ ] Verify Migration

#### **Schritt 3: Adapter Switching**
- [ ] SupabaseDataAdapter implementieren
- [ ] Environment Variable setzen
- [ ] Testing mit Supabase

#### **Schritt 4: Real-time Features**
- [ ] Supabase Realtime Subscriptions
- [ ] Notification über Realtime
- [ ] Collaborative Editing

**Dateien zu ändern:**
- `lib/storage/DataAdapter.ts` - SupabaseDataAdapter
- `.env.local` - Supabase Credentials
- `scripts/migrateToSupabase.ts` - Migration Script

---

## 🎨 Design System & Styling

### **UI/UX Richtlinien:**

#### **Farben:**
- Primary: `#2563eb` (Blue)
- Success: `#10b981` (Green)
- Warning: `#f59e0b` (Yellow)
- Destructive: `#ef4444` (Red)
- Muted: `#6b7280` (Gray)

#### **Typography:**
- Font: Inter (sans-serif)
- Heading: Bold, 2xl-4xl
- Body: Normal, sm-base
- Caption: Normal, xs

#### **Spacing:**
- Base Unit: 4px (0.25rem)
- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96

#### **Components zu erstellen:**
- [ ] Dialog/Modal
- [ ] Dropdown Menu
- [ ] Tabs
- [ ] Tooltip
- [ ] Checkbox
- [ ] Radio Group
- [ ] Switch
- [ ] Slider
- [ ] Progress Bar
- [ ] Breadcrumbs
- [ ] Pagination

---

## 🔧 Konfiguration & Environment

### **Environment Variables:**

```bash
# Development
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Storage
NEXT_PUBLIC_USE_SUPABASE=false

# Supabase (wenn verfügbar)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Feature Flags
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_REPORTS=true
NEXT_PUBLIC_ENABLE_DEV_TOOLS=true
```

---

## 📚 Dokumentation TODO

### **Dokumente zu erstellen:**
- [ ] API Documentation (TypeDoc)
- [ ] Component Storybook
- [ ] User Manual (für End-User)
- [ ] Developer Guide
- [ ] Deployment Guide
- [ ] Migration Guide (Local → Supabase)
- [ ] Troubleshooting Guide

---

## 🚀 Deployment Vorbereitung

### **Production Checklist:**
- [ ] Environment Variables konfiguriert
- [ ] Build Errors behoben
- [ ] Tests passing (100%)
- [ ] Lighthouse Score > 90
- [ ] Security Audit
- [ ] Performance Optimierung
- [ ] Error Tracking Setup (Sentry?)
- [ ] Analytics Setup (optional)
- [ ] Backup Strategy
- [ ] Monitoring Setup

---

## 📊 Metriken & KPIs

### **Development Metrics:**
- Lines of Code: ~10,000+ (geschätzt nach Fertigstellung)
- Files: ~150+
- Components: ~80+
- Test Coverage: >80% (Ziel)

### **Performance Metrics:**
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Lighthouse Performance: >90
- Bundle Size: <500kb (gzipped)

---

## 👥 Team & Rollen

### **Empfohlene Team-Größe:**
- **1 Senior Full-Stack Developer** (Phase 4-8)
- **1 Frontend Developer** (Phase 6-7, UI/UX)
- **1 QA Engineer** (Phase 8, Testing)

### **Alternativ:**
- **1 Full-Stack Developer** kann alles solo machen (16-23 Tage)

---

## 🎯 Next Steps für Entwickler

### **Sofort starten mit:**
1. ✅ **Phase 4.1**: Investment List View
2. ✅ **Phase 4.2**: Investment Create Form
3. ✅ **Phase 4.3**: Cashflow Generator

### **Parallel entwickeln:**
- Frontend & Backend können parallel entwickelt werden
- UI Components können unabhängig gebaut werden
- Testing kann parallel laufen

### **Code Review:**
- Nach jeder Phase
- Vor Merge in main branch
- Fokus auf Code Quality, Performance, Security

---

## 📞 Support & Fragen

**Bei Fragen oder Problemen:**
- Siehe README.md für Quick Start
- Siehe PRD_LOCAL.md für Requirements
- Siehe Code-Kommentare für Details

**Tech Stack Dokumentation:**
- Next.js: https://nextjs.org/docs
- TypeScript: https://www.typescriptlang.org/docs
- Zustand: https://docs.pmnd.rs/zustand
- shadcn/ui: https://ui.shadcn.com
- Tailwind CSS: https://tailwindcss.com/docs

---

**Viel Erfolg bei der Entwicklung! 🚀**

*Letzte Aktualisierung: 27. Oktober 2025*
