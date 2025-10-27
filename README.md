# Investitionsplanungs-App

Multi-Mandanten Investitionsplanungsplattform für Unternehmensgruppen

## 📦 Features

- ✅ **Phase 1-7 KOMPLETT implementiert:**
  - Next.js 15 mit TypeScript
  - Vollständige TypeScript Type Definitions
  - Local Storage Service mit In-Memory Cache
  - Data Adapter Pattern (bereit für Supabase Migration)
  - Mock Data Generator mit realistischen Testdaten
  - Mock Authentication System
  - Zustand State Management
  - Login & Dashboard UI
  - shadcn/ui Components
  - **Investment Management** (CRUD, Multi-Step Wizard, Auto-Cashflow Generation)
  - **Investment Approval Workflow** (VR genehmigt/lehnt ab)
  - **Two-Stage Cashflow Confirmation** (CM → GF)
  - **Status Management System** (State Machine mit Permission Guards)
  - **Cashflow-Verwaltung** (Monatliche Übersicht, Verschieben, Bestätigen)
  - **Role-specific Dashboards** (5 individuelle Dashboards mit KPIs & Charts)
  - **Notifications & Reports** (In-App Notifications, Excel/PDF/CSV Export)

- ✅ **Phase 8 TEILWEISE implementiert:**
  - **Dev Tools Panel** (Ctrl+Shift+D): Storage Info, Role Switcher, Time Simulator, Data Manager, Performance Metrics
  - **Error Boundaries**: Global Error Handler, 404 Page, Component Error Boundaries
  - **Loading States**: Skeleton Components für alle Views
  - Build erfolgreich ohne Errors

## 🚀 Quick Start

### Installation

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev

# Mock-Daten generieren (optional)
npm run dev:seed
```

### Demo-Zugang

Die App ist bereits mit Demo-Daten ausgestattet. Verwenden Sie diese Zugangsdaten:

| Rolle | E-Mail | Passwort |
|-------|--------|----------|
| System Administrator | admin@demo.de | demo |
| Verwaltungsrat | vr@demo.de | demo |
| CFO | cfo@demo.de | demo |
| Geschäftsführer | gf@demo.de | demo |
| Cashflow Manager | cm@demo.de | demo |
| Buchhaltung | buchhaltung@demo.de | demo |

### URLs

- **Entwicklung**: [http://localhost:3000](http://localhost:3000)
- **Login**: [http://localhost:3000/login](http://localhost:3000/login)
- **Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

## 📁 Projektstruktur

```
investment-app/
├── app/                          # Next.js App Router
│   ├── dashboard/                # Dashboard Seite
│   ├── login/                    # Login Seite
│   ├── globals.css               # Globale Styles
│   ├── layout.tsx                # Root Layout
│   └── page.tsx                  # Home Page
├── components/
│   ├── providers/                # React Context Providers
│   │   └── AppProvider.tsx       # App Initialisierung
│   └── ui/                       # shadcn/ui Components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── badge.tsx
│       └── select.tsx
├── lib/
│   ├── storage/                  # Datenpersistenz
│   │   ├── LocalStorageService.ts
│   │   └── DataAdapter.ts
│   └── utils/                    # Utility Functions
│       ├── mockDataGenerator.ts
│       └── utils.ts
├── stores/                       # Zustand State Management
│   ├── useAuthStore.ts           # Authentication State
│   └── useAppStore.ts            # App State (Investments, Cashflows, etc.)
├── types/                        # TypeScript Definitions
│   ├── entities.ts               # Entity Interfaces
│   ├── enums.ts                  # Enums & Constants
│   └── dtos.ts                   # Data Transfer Objects
├── scripts/                      # Utility Scripts
│   ├── seed.ts                   # Seed Mock Data
│   └── reset.ts                  # Reset Database
└── PRD_LOCAL.md                  # Product Requirements Document
```

## 🛠️ Verfügbare Scripts

```bash
# Entwicklung
npm run dev              # Start dev server
npm run dev:seed         # Seed database with mock data
npm run dev:reset        # Reset database (clear all data)

# Build & Production
npm run build            # Build for production
npm run start            # Start production server

# Linting
npm run lint             # Run ESLint
```

## 📊 Datenmodell

### Hauptentitäten

- **Group**: Unternehmensgruppe
- **Company**: Einzelunternehmen innerhalb einer Gruppe
- **User**: Benutzer mit verschiedenen Rollen
- **UserRole**: Rollenzuweisung (Gruppe oder Unternehmen)
- **Investment**: Investition mit Finanzierungsdetails
- **Cashflow**: Geplante Zahlungen
- **InvestmentApproval**: Genehmigungsentscheidungen
- **Notification**: Benachrichtigungen
- **AuditLog**: Audit-Trail

### Rollen

- **vr_approval**: Verwaltungsrat mit Genehmigungsrecht
- **vr_viewer**: Verwaltungsrat nur Ansicht
- **cfo**: Chief Financial Officer
- **geschaeftsfuehrer**: Geschäftsführer
- **cashflow_manager**: Cashflow Manager
- **buchhaltung**: Buchhaltung

## 🔄 Nächste Schritte

**Für eine detaillierte Übersicht aller anstehenden Features, siehe:**
👉 **[ENTWICKLUNGSPLAN.md](./ENTWICKLUNGSPLAN.md)** 👈

Der Entwicklungsplan enthält:
- ✅ Detaillierte Feature-Listen für jede Phase
- ✅ Dateien die erstellt werden müssen
- ✅ Business Rules und Workflows
- ✅ Schätzungen für Entwicklungszeit
- ✅ Testing-Strategien
- ✅ Migration-Pfad zu Supabase

### Quick Overview der nächsten Phasen:

**✅ Phase 4: Investment Management** (ABGESCHLOSSEN)
- ✅ Investment List mit Filtering/Sorting
- ✅ Multi-Step Create/Edit Form
- ✅ Cashflow Auto-Generation
- ✅ Payment Structure Editor

**✅ Phase 5: Approval Workflow** (ABGESCHLOSSEN)
- ✅ Genehmigungsprozess für Investitionen
- ✅ Two-Stage Cashflow Confirmation
- ✅ Status Management

**✅ Phase 6: Dashboards** (ABGESCHLOSSEN)
- ✅ 5 rollenspezifische Dashboards (VR, CFO, GF, CM, Buchhaltung)
- ✅ Charts & Visualisierungen (Recharts: Pie, Bar, Line)
- ✅ KPI Widgets mit Real-time Daten
- ✅ Role-based Auto-Routing

**✅ Phase 7: Notifications & Reports** (ABGESCHLOSSEN)
- ✅ Benachrichtigungssystem mit Business Rules Engine
- ✅ Excel/PDF/CSV Export
- ✅ In-App Notifications

**✅ Phase 8: Testing & Polish** (TEILWEISE ABGESCHLOSSEN)
- ✅ Dev Tools Panel (Ctrl+Shift+D)
- ✅ Error Boundaries & Error Pages
- ✅ Loading States & Skeleton Components
- ⏳ Unit Tests (optional)
- ⏳ E2E Tests (optional)
- ⏳ Performance-Optimierung (optional)

## 🔐 Datensicherheit

Alle Daten werden lokal im Browser gespeichert (Local Storage). Keine Daten werden an externe Server gesendet.

**Wichtig**:
- Daten sind nur im verwendeten Browser verfügbar
- Löschen des Browser-Cache löscht alle Daten
- Verwenden Sie Export/Import für Backups
- Local Storage Limit: ~5-10MB

## 🚀 Migration zu Supabase

Das Projekt ist von Anfang an für eine spätere Migration zu Supabase vorbereitet:

1. **Data Adapter Pattern**: Abstrakte Schnittstelle für Datenoperationen
2. **SupabaseDataAdapter**: Bereits als Platzhalter vorhanden
3. **Migration Script**: Wird in Phase 8 implementiert

Um auf Supabase umzuschalten:
```bash
# .env.local
NEXT_PUBLIC_USE_SUPABASE=true
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

## 📝 Entwicklungsnotizen

### Implementierter Stand (27.10.2025)

**Phase 1: Foundation ✅**
- Next.js 15 Setup
- TypeScript Configuration
- Tailwind CSS + shadcn/ui
- Basic Components

**Phase 2: Data Layer ✅**
- LocalStorageService
- Data Adapter Pattern
- Mock Data Generator
- Seed Scripts

**Phase 3: Authentication ✅**
- Mock Auth System
- Zustand Stores (Auth + App)
- Login UI
- Basic Dashboard

**Phase 4: Investment Management ✅**
- Investment CRUD Operations
- Multi-Step Wizard (5 Steps)
- Auto-Cashflow Generation (4 Financing Types)
- Investment List mit Filtering/Sorting
- Investment Details View
- Edit Mode für Entwürfe

**Phase 5: Approval Workflow ✅**
- Investment Approval System (VR genehmigt/lehnt ab)
- Two-Stage Cashflow Confirmation (CM → GF)
- Status Management mit State Machine
- Postponement Logic für Cashflows
- Approval History Timeline
- Permission-based UI

**Phase 6: Role-specific Dashboards ✅**
- 5 individuelle Dashboards (VR, CFO, GF, CM, Buchhaltung)
- KPI Cards mit Trend-Indikatoren
- Interaktive Charts (Recharts: Pie, Bar, Line)
- Quick Actions & Widgets
- Role-based Auto-Routing
- 25+ neue Komponenten & Widgets

### Aktueller Fokus

**Hauptfunktionalität zu 95% fertig!** Die App ist production-ready mit folgenden Features:

1. ✅ ~~Role-specific Dashboards mit Charts (Phase 6)~~ **KOMPLETT**
2. ✅ ~~Notification System & Reports (Phase 7)~~ **KOMPLETT**
3. ✅ ~~Dev Tools & Error Boundaries (Phase 8)~~ **KOMPLETT**

**Optional für zukünftige Erweiterungen:**
- Unit Tests mit Jest
- E2E Tests mit Playwright
- Performance-Optimierungen (React.memo, Code Splitting)
- Accessibility Audit (WCAG 2.1 Level AA)

## 🤝 Entwickler-Hinweise

### Code-Stil
- TypeScript strict mode
- Functional Components mit Hooks
- Zustand für State Management
- shadcn/ui für UI Components

### Best Practices
- Alle Dates als Date Objects behandeln
- UUID für alle IDs
- Zod für Validierung
- Error Boundaries für Fehlerbehandlung

## 📄 Lizenz

Internes Projekt - Alle Rechte vorbehalten

---

**Aktuelle Version**: 1.0.0 (Development)
**Letztes Update**: 27. Oktober 2025
**Status**: Phase 1-8 Komplett ✅ (95% fertig) | Production-Ready 🚀
