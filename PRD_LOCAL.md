# Product Requirements Document (PRD) - LOCAL VERSION
## Investitionsplanungs-App für Unternehmensgruppen

### Version 1.0 LOCAL | November 2024

---

## ⚠️ WICHTIGE ÄNDERUNG: LOKALE ENTWICKLUNG

**Dieser PRD ist für die lokale Entwicklung ohne Supabase-Datenbank angepasst.**

### Entwicklungsstrategie:
1. **Phase 1**: Lokale Entwicklung mit Mock-Daten und Local Storage
2. **Phase 2**: Vollständige Funktionalität ohne echte Datenbank
3. **Phase 3**: Migration zu Supabase wenn Datenbank verfügbar

### Datenhaltung während lokaler Entwicklung:
- **Primary Storage**: Local Storage / Session Storage
- **Fallback**: IndexedDB für größere Datenmengen
- **Export/Import**: JSON-Dateien für Datensicherung
- **Mock API**: Next.js API Routes mit In-Memory Storage

---

## 1. Executive Summary

### 1.1 Produktvision
Eine webbasierte Multi-Mandanten-Investitionsplanungsplattform, die es Unternehmensgruppen ermöglicht, Investitionen für das kommende Jahr zu planen, verschiedene Finanzierungsoptionen zu verwalten und einen strukturierten Genehmigungsworkflow mit präziser Cashflow-Zuordnung zu implementieren.

### 1.2 Hauptziele
- Zentrale Investitionsplanung für Unternehmensgruppen
- Präzise monatliche Cashflow-Zuordnung
- Mehrstufiger Genehmigungsworkflow
- Automatisiertes Benachrichtigungssystem
- Konsolidierte Übersichten auf Gruppen- und Unternehmensebene

### 1.3 Zielgruppe
- Verwaltungsräte (mit/ohne Genehmigungsrecht)
- CFOs
- Geschäftsführer von Unterfirmen
- Cashflow-Manager
- Finanzbuchhaltung

---

## 2. Technische Spezifikation - LOCAL SETUP

### 2.1 Tech Stack (Lokale Entwicklung)

```yaml
Frontend & Backend:
  Framework: Next.js 14/15 (App Router)
  Language: TypeScript
  UI Library: shadcn/ui
  Styling: Tailwind CSS
  State Management: Zustand + Context API
  Forms: React Hook Form + Zod
  Charts: Recharts/Tremor
  Date Handling: date-fns
  Export: xlsx, jsPDF

Local Data Management:
  Primary: Local Storage API
  Secondary: IndexedDB (via Dexie.js)
  Mock API: Next.js API Routes
  Data Format: JSON
  Mock Auth: JWT tokens (local)
  File Storage: Browser File API

Development Tools:
  Dev Server: Next.js Dev Server
  Mock Data: Faker.js
  Testing: Jest + React Testing Library
  API Testing: MSW (Mock Service Worker)
  
Future Migration Path:
  Database: Supabase (wenn verfügbar)
  Auth: Supabase Auth
  Storage: Supabase Storage
  Realtime: Supabase Realtime
```

### 2.2 Lokale Datenarchitektur

```typescript
// Local Storage Schema
interface LocalDatabase {
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

// Storage Service
class LocalStorageService {
  private readonly STORAGE_KEY = 'investment_app_data';
  private readonly BACKUP_KEY = 'investment_app_backup';
  
  // Singleton pattern
  private static instance: LocalStorageService;
  
  // In-memory cache
  private cache: LocalDatabase;
  
  // Methods
  async initialize(): Promise<void>;
  async save(): Promise<void>;
  async load(): Promise<LocalDatabase>;
  async backup(): Promise<void>;
  async restore(data: LocalDatabase): Promise<void>;
  async clear(): Promise<void>;
  
  // CRUD operations
  async create<T>(collection: string, item: T): Promise<T>;
  async read<T>(collection: string, id: string): Promise<T>;
  async update<T>(collection: string, id: string, data: Partial<T>): Promise<T>;
  async delete(collection: string, id: string): Promise<void>;
  async query<T>(collection: string, filter: (item: T) => boolean): Promise<T[]>;
}
```

### 2.3 Mock API Implementation

```typescript
// app/api/mock/route.ts
interface MockAPIConfig {
  delay: number; // Simulate network delay
  failureRate: number; // Simulate failures
  offlineMode: boolean;
}

// Mock API endpoints
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/investments
POST   /api/investments
PUT    /api/investments/[id]
DELETE /api/investments/[id]

GET    /api/cashflows
PUT    /api/cashflows/[id]/confirm
PUT    /api/cashflows/[id]/postpone

GET    /api/notifications
PUT    /api/notifications/[id]/read

POST   /api/reports/monthly
POST   /api/reports/export

// WebSocket simulation for real-time updates
GET    /api/subscribe (Server-Sent Events)
```

---

## 3. Datenmodell (Local Storage Version)

### 3.1 TypeScript Interfaces

```typescript
// Core Types
type UUID = string; // Generated locally with crypto.randomUUID()
type Role = 'vr_approval' | 'vr_viewer' | 'cfo' | 'geschaeftsfuehrer' | 'cashflow_manager' | 'buchhaltung';
type FinancingType = 'kauf' | 'leasing' | 'ratenzahlung' | 'miete';
type InvestmentStatus = 'entwurf' | 'zur_genehmigung' | 'genehmigt' | 'abgelehnt' | 'aktiv' | 'abgeschlossen';
type CashflowStatus = 'geplant' | 'ausstehend' | 'vorbestaetigt' | 'bestaetigt' | 'verschoben' | 'storniert';

// Main Entities
interface Group {
  id: UUID;
  name: string;
  created_at: Date;
  settings: {
    fiscal_year_start: number; // 1-12
    currency: string; // 'EUR'
    notification_settings: NotificationSettings;
  };
}

interface Company {
  id: UUID;
  group_id: UUID;
  name: string;
  company_code: string;
  is_active: boolean;
  created_at: Date;
}

interface User {
  id: UUID;
  email: string;
  password_hash: string; // For local mock auth
  name: string;
  avatar?: string;
  created_at: Date;
  last_login?: Date;
}

interface UserRole {
  id: UUID;
  user_id: UUID;
  company_id?: UUID; // null for group-level roles
  group_id: UUID;
  role: Role;
  assigned_at: Date;
  assigned_by: UUID;
}

interface Investment {
  id: UUID;
  company_id: UUID;
  name: string;
  description?: string;
  category: 'fahrzeuge' | 'it' | 'maschinen' | 'immobilien' | 'sonstige';
  total_amount: number;
  financing_type: FinancingType;
  status: InvestmentStatus;
  created_by: UUID;
  created_at: Date;
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

interface PaymentStructure {
  // Kauf
  einmalzahlung?: {
    date: Date;
    amount: number;
    custom_due_date?: Date;
  };
  
  // Ratenzahlung
  ratenzahlung?: {
    anzahlung?: number;
    anzahlung_date?: Date;
    anzahlung_custom_due?: Date;
    
    number_of_rates: number;
    rate_amount: number;
    rate_interval: 'monthly' | 'quarterly' | 'yearly';
    first_rate_date: Date;
    rates_custom_due_dates?: Date[];
    
    schlussrate?: number;
    schlussrate_date?: Date;
    schlussrate_custom_due?: Date;
  };
  
  // Leasing
  leasing?: {
    anzahlung?: number;
    anzahlung_date?: Date;
    
    monthly_rate: number;
    duration_months: number;
    start_month: Date;
    
    schlussrate?: number;
    purchase_option?: boolean;
    auto_confirm: boolean; // default: true
  };
}

interface Cashflow {
  id: UUID;
  investment_id: UUID;
  due_date: Date; // berechnet
  custom_due_date?: Date; // manuell gesetzt
  amount: number;
  type: 'anzahlung' | 'rate' | 'schlussrate' | 'einmalzahlung';
  period_number?: number; // z.B. Rate 3 von 36
  total_periods?: number;
  month: number; // 1-12
  year: number;
  status: CashflowStatus;
  
  // Bestätigungsfelder
  confirmed_by_cm?: UUID;
  confirmed_at_cm?: Date;
  cm_comment?: string;
  
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

interface InvestmentApproval {
  id: UUID;
  investment_id: UUID;
  approved_by: UUID;
  decision: 'genehmigt' | 'abgelehnt';
  comment?: string;
  conditions?: string;
  decided_at: Date;
  valid_until?: Date;
}

interface Notification {
  id: UUID;
  user_id: UUID;
  type: NotificationType;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  related_type?: 'cashflow' | 'investment';
  related_id?: UUID;
  read: boolean;
  read_at?: Date;
  created_at: Date;
}

interface AuditLog {
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
```

### 3.2 Mock Data Generator

```typescript
// utils/mockDataGenerator.ts
import { faker } from '@faker-js/faker';

class MockDataGenerator {
  generateGroups(count: number): Group[];
  generateCompanies(groupIds: UUID[], count: number): Company[];
  generateUsers(count: number): User[];
  generateInvestments(companyIds: UUID[], count: number): Investment[];
  generateCashflows(investments: Investment[]): Cashflow[];
  
  // Seed initial data
  seedDatabase(): LocalDatabase {
    // Generate realistic test data
    const groups = this.generateGroups(2);
    const companies = this.generateCompanies(groups.map(g => g.id), 5);
    const users = this.generateUsers(20);
    // ... etc
    
    return {
      version: '1.0.0',
      lastUpdated: new Date(),
      groups,
      companies,
      users,
      // ... all collections
    };
  }
}
```

---

## 4. State Management (Lokale Version)

### 4.1 Zustand Store Setup

```typescript
// stores/useAppStore.ts
interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // Data
  groups: Group[];
  companies: Company[];
  investments: Investment[];
  cashflows: Cashflow[];
  notifications: Notification[];
  
  // UI State
  selectedCompany: UUID | null;
  selectedMonth: number;
  selectedYear: number;
  filters: FilterState;
  
  // Actions
  login: (email: string, password: string, role: Role) => Promise<void>;
  logout: () => void;
  
  // CRUD Operations
  createInvestment: (data: CreateInvestmentDTO) => Promise<Investment>;
  updateInvestment: (id: UUID, data: Partial<Investment>) => Promise<void>;
  deleteInvestment: (id: UUID) => Promise<void>;
  
  submitForApproval: (investmentId: UUID) => Promise<void>;
  approveInvestment: (investmentId: UUID, comment?: string) => Promise<void>;
  rejectInvestment: (investmentId: UUID, comment?: string) => Promise<void>;
  
  confirmCashflow: (cashflowId: UUID, data: ConfirmCashflowDTO) => Promise<void>;
  approveCashflowReport: (month: number, year: number) => Promise<void>;
  
  // Notifications
  markNotificationAsRead: (notificationId: UUID) => Promise<void>;
  clearNotifications: () => void;
  
  // Data Persistence
  saveToLocalStorage: () => Promise<void>;
  loadFromLocalStorage: () => Promise<void>;
  exportData: () => Promise<Blob>;
  importData: (file: File) => Promise<void>;
}

const useAppStore = create<AppState>((set, get) => ({
  // Implementation
}));
```

### 4.2 Offline-First Approach

```typescript
// services/offlineService.ts
class OfflineService {
  private queue: OfflineAction[] = [];
  
  // Queue actions when offline
  async executeAction(action: OfflineAction): Promise<void> {
    if (navigator.onLine) {
      // Execute immediately
      await this.processAction(action);
    } else {
      // Queue for later
      this.queue.push(action);
      await this.saveQueue();
    }
  }
  
  // Sync when back online
  async syncOfflineActions(): Promise<void> {
    if (!navigator.onLine) return;
    
    for (const action of this.queue) {
      await this.processAction(action);
    }
    
    this.queue = [];
    await this.saveQueue();
  }
  
  // Listen for online/offline events
  initialize() {
    window.addEventListener('online', () => this.syncOfflineActions());
    window.addEventListener('offline', () => this.notifyOffline());
  }
}
```

---

## 5. UI Components (Lokale Version)

### 5.1 Component Structure

```typescript
// components/
├── auth/
│   ├── LoginForm.tsx
│   └── MockUserSelector.tsx // Schneller Rollenwechsel für Tests
├── dashboard/
│   ├── DashboardLayout.tsx
│   ├── VRDashboard.tsx
│   ├── GFDashboard.tsx
│   ├── CFODashboard.tsx
│   └── CashflowManagerDashboard.tsx
├── investments/
│   ├── InvestmentList.tsx
│   ├── InvestmentForm.tsx
│   ├── InvestmentDetails.tsx
│   └── ApprovalWorkflow.tsx
├── cashflow/
│   ├── CashflowTable.tsx
│   ├── CashflowCalendar.tsx
│   ├── ConfirmationDialog.tsx
│   └── MonthlyReport.tsx
├── notifications/
│   ├── NotificationCenter.tsx
│   ├── NotificationBadge.tsx
│   └── NotificationToast.tsx
├── reports/
│   ├── MonthlyReport.tsx
│   ├── YearlyOverview.tsx
│   └── ExportDialog.tsx
└── shared/
    ├── DataTable.tsx
    ├── Charts.tsx
    ├── LoadingStates.tsx
    └── ErrorBoundary.tsx
```

### 5.2 Lokale Notification-Simulation

```typescript
// services/notificationService.ts
class LocalNotificationService {
  private timers: Map<string, NodeJS.Timeout> = new Map();
  
  // Simulate daily notification check
  startDailyCheck() {
    const checkInterval = 60000; // Check every minute in dev mode
    
    setInterval(() => {
      this.checkDuePayments();
      this.checkMonthEndDeadlines();
      this.checkOverdueItems();
    }, checkInterval);
  }
  
  // Generate notifications based on business rules
  checkDuePayments() {
    const store = useAppStore.getState();
    const today = new Date();
    const in7Days = addDays(today, 7);
    
    store.cashflows
      .filter(cf => cf.status === 'ausstehend')
      .forEach(cf => {
        const dueDate = cf.custom_due_date || cf.due_date;
        
        // Without custom date: 7 days before
        if (!cf.custom_due_date && isBefore(dueDate, in7Days)) {
          this.createNotification({
            type: 'payment_due_soon',
            title: `Zahlung in ${differenceInDays(dueDate, today)} Tagen fällig`,
            message: `${cf.amount}€ für Investment ${cf.investment_id}`,
            priority: 'medium'
          });
        }
        
        // With custom date: after due date
        if (cf.custom_due_date && isAfter(today, dueDate)) {
          this.createNotification({
            type: 'payment_overdue',
            title: `Zahlung ${differenceInDays(today, dueDate)} Tage überfällig`,
            message: `${cf.amount}€ für Investment ${cf.investment_id}`,
            priority: 'high'
          });
        }
      });
  }
}
```

---

## 6. Lokale Entwicklungs-Features

### 6.1 Dev Tools Panel

```typescript
// components/dev/DevToolsPanel.tsx
interface DevToolsPanel {
  // Quick Actions
  seedData(): void;
  clearData(): void;
  exportData(): void;
  importData(file: File): void;
  
  // User Switching
  switchUser(userId: UUID): void;
  switchRole(role: Role): void;
  
  // Time Simulation
  setSystemDate(date: Date): void;
  advanceTime(days: number): void;
  
  // Notification Testing
  triggerNotification(type: NotificationType): void;
  simulateMonthEnd(): void;
  
  // Performance
  showPerformanceMetrics(): void;
  clearCache(): void;
}
```

### 6.2 Data Export/Import

```typescript
// services/dataService.ts
class DataExportService {
  // Export to JSON
  async exportToJSON(): Promise<Blob> {
    const data = await this.getAllData();
    const json = JSON.stringify(data, null, 2);
    return new Blob([json], { type: 'application/json' });
  }
  
  // Export to Excel
  async exportToExcel(): Promise<Blob> {
    const XLSX = await import('xlsx');
    const wb = XLSX.utils.book_new();
    
    // Add sheets for each entity
    const data = await this.getAllData();
    
    XLSX.utils.book_append_sheet(wb, 
      XLSX.utils.json_to_sheet(data.investments), 
      'Investments'
    );
    
    XLSX.utils.book_append_sheet(wb, 
      XLSX.utils.json_to_sheet(data.cashflows), 
      'Cashflows'
    );
    
    // ... more sheets
    
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
  
  // Import from JSON
  async importFromJSON(file: File): Promise<void> {
    const text = await file.text();
    const data = JSON.parse(text);
    await this.validateAndImport(data);
  }
}
```

---

## 7. Migration Path zu Supabase

### 7.1 Abstraction Layer

```typescript
// services/dataAdapter.ts
interface DataAdapter {
  // Auth
  login(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  
  // CRUD operations
  create<T>(table: string, data: Partial<T>): Promise<T>;
  read<T>(table: string, id: UUID): Promise<T>;
  update<T>(table: string, id: UUID, data: Partial<T>): Promise<T>;
  delete(table: string, id: UUID): Promise<void>;
  query<T>(table: string, filters: QueryFilters): Promise<T[]>;
  
  // Subscriptions
  subscribe(table: string, callback: (data: any) => void): () => void;
}

// Local implementation
class LocalDataAdapter implements DataAdapter {
  // Uses LocalStorage/IndexedDB
}

// Future Supabase implementation
class SupabaseDataAdapter implements DataAdapter {
  // Uses Supabase client
}

// Factory pattern for easy switching
const dataAdapter = process.env.USE_SUPABASE 
  ? new SupabaseDataAdapter()
  : new LocalDataAdapter();
```

### 7.2 Migration Script

```typescript
// scripts/migrateToSupabase.ts
async function migrateLocalDataToSupabase() {
  // 1. Export local data
  const localData = await localDataAdapter.exportAll();
  
  // 2. Transform to Supabase schema
  const transformed = transformDataForSupabase(localData);
  
  // 3. Upload to Supabase
  const supabase = createClient(url, key);
  
  // 4. Bulk insert with proper order (respecting foreign keys)
  await supabase.from('groups').insert(transformed.groups);
  await supabase.from('companies').insert(transformed.companies);
  await supabase.from('users').insert(transformed.users);
  // ... etc
  
  // 5. Verify migration
  await verifyMigration(localData, supabase);
}
```

---

## 8. Testing Strategy (Lokale Version)

### 8.1 Test Data Sets

```typescript
// __tests__/fixtures/testData.ts
export const testScenarios = {
  // Scenario 1: Small company
  smallCompany: {
    groups: 1,
    companies: 1,
    users: 5,
    investments: 10,
    cashflows: 50
  },
  
  // Scenario 2: Large corporation
  largeCorporation: {
    groups: 3,
    companies: 15,
    users: 100,
    investments: 500,
    cashflows: 5000
  },
  
  // Scenario 3: Month-end stress test
  monthEndStress: {
    overduePayments: 50,
    pendingApprovals: 20,
    unconfirmedReports: 10
  }
};
```

### 8.2 E2E Tests ohne Datenbank

```typescript
// __tests__/e2e/workflow.test.ts
describe('Complete Investment Workflow', () => {
  beforeEach(() => {
    // Reset local storage
    localStorage.clear();
    
    // Seed test data
    mockDataGenerator.seedDatabase();
  });
  
  test('Create and approve investment', async () => {
    // Login as GF
    await loginAs('geschaeftsfuehrer');
    
    // Create investment
    const investment = await createInvestment({...});
    
    // Submit for approval
    await submitForApproval(investment.id);
    
    // Switch to VR role
    await loginAs('vr_approval');
    
    // Approve
    await approveInvestment(investment.id);
    
    // Verify notifications
    expect(notifications).toContainEqual(
      expect.objectContaining({
        type: 'investment_approved'
      })
    );
  });
});
```

---

## 9. Implementierungs-Roadmap (Lokale Version)

### Phase 1: Foundation (Woche 1)
- [x] Next.js Setup
- [ ] TypeScript Interfaces
- [ ] Local Storage Service
- [ ] Mock Authentication
- [ ] Basic Routing

### Phase 2: Core UI (Woche 2)
- [ ] Layout Components
- [ ] Role-based Navigation
- [ ] Dashboard Views
- [ ] shadcn/ui Integration

### Phase 3: Investment Management (Woche 3)
- [ ] Investment CRUD
- [ ] Cashflow Generation
- [ ] Local Data Persistence
- [ ] Form Validation

### Phase 4: Workflow Implementation (Woche 4)
- [ ] Approval Workflow
- [ ] Two-stage Confirmation
- [ ] Status Management
- [ ] Audit Logging

### Phase 5: Notifications (Woche 5)
- [ ] Local Notification System
- [ ] Business Rules Engine
- [ ] Time-based Triggers
- [ ] Notification Center UI

### Phase 6: Reports & Export (Woche 6)
- [ ] Report Generation
- [ ] Excel Export
- [ ] PDF Export
- [ ] Data Backup/Restore

### Phase 7: Testing & Polish (Woche 7)
- [ ] Unit Tests
- [ ] E2E Tests
- [ ] Performance Optimization
- [ ] UI Polish

### Phase 8: Migration Preparation (Woche 8)
- [ ] Data Adapter Pattern
- [ ] Migration Scripts
- [ ] Supabase Schema
- [ ] Documentation

---

## 10. Lokale Entwicklungs-Commands

```bash
# Installation
npm install

# Development
npm run dev           # Start development server
npm run dev:seed      # Seed with test data
npm run dev:reset     # Reset all data

# Testing
npm test             # Run unit tests
npm run test:e2e     # Run E2E tests
npm run test:watch   # Watch mode

# Build
npm run build        # Production build
npm run preview      # Preview production build

# Data Management
npm run data:export  # Export current data
npm run data:import  # Import data from file
npm run data:backup  # Create backup
npm run data:restore # Restore from backup

# Utils
npm run generate:types    # Generate TypeScript types
npm run generate:mock     # Generate mock data
npm run analyze          # Bundle analysis
```

---

## 11. Vorteile der lokalen Entwicklung

### Entwickler-Vorteile:
1. **Keine Infrastruktur-Kosten** während der Entwicklung
2. **Schnellere Entwicklung** ohne Netzwerk-Latenz
3. **Offline-Fähigkeit** von Anfang an
4. **Einfaches Testing** mit Mock-Daten
5. **Vollständige Kontrolle** über Daten

### Feature-Vorteile:
1. **Dev-Tools Panel** für schnelles Testen
2. **Rollenwechsel** on-the-fly
3. **Zeit-Simulation** für Deadline-Tests
4. **Daten-Export/Import** für Backup
5. **Performance-Metriken** direkt sichtbar

### Migration-Vorteile:
1. **Klare Abstraction Layer** von Anfang an
2. **Testbare Business Logic** ohne DB-Abhängigkeit
3. **Einfache Migration** wenn Supabase verfügbar
4. **Hybrid-Modus** möglich (Local + Cloud)

---

## 12. Wichtige Hinweise

### ⚠️ Limitierungen der lokalen Version:
- **Datengröße**: Local Storage hat 5-10MB Limit
- **Keine echte Multi-User**: Nur simuliert
- **Keine echten Notifications**: Nur in-App
- **Kein echter Cron**: Nur während App läuft
- **Browser-abhängig**: Daten pro Browser/Gerät

### ✅ Diese Features funktionieren vollständig:
- Kompletter Workflow
- Alle Rollen und Berechtigungen
- Cashflow-Berechnungen
- Genehmigungsprozesse
- Export/Import
- Benachrichtigungs-Logik

### 🔄 Migration zu Supabase wird einfach sein:
1. Daten-Export aus Local Storage
2. Supabase-Projekt erstellen
3. Schema via Migration erstellen
4. Daten importieren
5. Adapter umschalten
6. Fertig!

---

## Anhang A: Quick Start Guide

```bash
# 1. Clone repository
git clone [repository-url]

# 2. Install dependencies
cd investment-app
npm install

# 3. Start development
npm run dev

# 4. Open browser
http://localhost:3000

# 5. Login with test user
Email: demo@example.com
Password: demo
Role: Select any role

# 6. Or use quick role switch
Press Ctrl+Shift+D to open DevTools Panel
```

---

## Anhang B: Beispiel Local Storage Struktur

```json
{
  "investment_app_data": {
    "version": "1.0.0",
    "lastUpdated": "2024-11-25T10:00:00Z",
    "currentUser": {
      "id": "user-1",
      "email": "gf@schmidt-logistik.de",
      "name": "Max Schmidt",
      "role": "geschaeftsfuehrer"
    },
    "investments": [
      {
        "id": "inv-1",
        "company_id": "comp-1",
        "name": "LKW Mercedes Actros",
        "total_amount": 450000,
        "status": "zur_genehmigung",
        "financing_type": "leasing"
      }
    ],
    "cashflows": [
      {
        "id": "cf-1",
        "investment_id": "inv-1",
        "amount": 10000,
        "due_date": "2026-04-15",
        "status": "ausstehend"
      }
    ]
  }
}
```

---

Dieses lokale PRD ermöglicht die vollständige Entwicklung ohne Supabase-Abhängigkeit. Die App wird voll funktionsfähig sein und kann später einfach auf Supabase migriert werden, wenn eine Datenbank verfügbar ist.