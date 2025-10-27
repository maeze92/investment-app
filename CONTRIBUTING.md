# Contributing Guide

Willkommen zum Investitionsplanungs-App Projekt! Diese Anleitung hilft dir, zum Projekt beizutragen.

---

## 📚 Vor dem Start

Bitte lies zuerst diese Dokumente:

1. **[README.md](./README.md)** - Projekt-Übersicht & Quick Start
2. **[ENTWICKLUNGSPLAN.md](./ENTWICKLUNGSPLAN.md)** - Detaillierter Plan aller Features
3. **[PRD_LOCAL.md](./PRD_LOCAL.md)** - Product Requirements Document
4. **[CHANGELOG.md](./CHANGELOG.md)** - Versions-Historie

---

## 🚀 Entwicklungsumgebung Setup

### Voraussetzungen

- Node.js 18+ (empfohlen: 20.x)
- npm 9+ oder yarn
- Git
- VS Code (empfohlen) mit Extensions:
  - ESLint
  - Prettier
  - TypeScript
  - Tailwind CSS IntelliSense

### Setup-Schritte

```bash
# 1. Repository clonen
git clone [repository-url]
cd investment-app

# 2. Dependencies installieren
npm install

# 3. Entwicklungsserver starten
npm run dev

# 4. Mock-Daten laden
# Öffne http://localhost:3000/seed und klicke "Daten generieren"
# ODER verwende Browser DevTools Console:
# > await storageService.initialize()
# > await storageService.restore(mockDataGenerator.seedDatabase())

# 5. Einloggen
# Öffne http://localhost:3000/login
# Verwende: vr@demo.de / demo
```

---

## 🏗️ Projektstruktur

```
investment-app/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth-Gruppe (Login)
│   ├── dashboard/         # Dashboard Pages
│   ├── investments/       # Investment Pages
│   ├── cashflows/         # Cashflow Pages
│   ├── seed/              # Data Seeding UI
│   └── api/               # API Routes (Mock)
├── components/
│   ├── ui/                # shadcn/ui Components
│   ├── investments/       # Investment-spezifische Components
│   ├── cashflows/         # Cashflow Components
│   ├── dashboard/         # Dashboard Widgets
│   ├── notifications/     # Notification Components
│   └── providers/         # React Context Providers
├── lib/
│   ├── storage/           # LocalStorage & DataAdapter
│   ├── cashflow/          # Cashflow Business Logic
│   ├── notifications/     # Notification Service
│   ├── reports/           # Report Generators
│   ├── validation/        # Zod Schemas
│   └── utils/             # Helper Functions
├── stores/                # Zustand State Management
│   ├── useAuthStore.ts
│   └── useAppStore.ts
├── types/                 # TypeScript Definitions
│   ├── entities.ts
│   ├── enums.ts
│   └── dtos.ts
├── hooks/                 # Custom React Hooks
├── scripts/               # Utility Scripts
└── __tests__/             # Tests (TODO)
```

---

## 🎯 Workflow

### 1. Feature auswählen

Siehe **[ENTWICKLUNGSPLAN.md](./ENTWICKLUNGSPLAN.md)** für offene Features.

Aktuell in Arbeit: **Phase 4 - Investment Management**

### 2. Branch erstellen

```bash
# Feature Branch
git checkout -b feature/investment-list-view

# Bug Fix Branch
git checkout -b fix/login-error

# Improvement Branch
git checkout -b improve/dashboard-performance
```

### 3. Entwickeln

**Code Style Guidelines:**

#### TypeScript
- ✅ Strikte Type-Safety (keine `any`)
- ✅ Interfaces über Types (für Entities)
- ✅ Descriptive Namen
- ✅ JSDoc Kommentare für Public APIs

```typescript
// ✅ Good
interface Investment {
  id: UUID;
  name: string;
  total_amount: number;
}

// ❌ Bad
type Inv = {
  id: any;
  n: string;
};
```

#### React Components
- ✅ Functional Components mit Hooks
- ✅ Typed Props
- ✅ Destructuring
- ✅ Early Returns

```typescript
// ✅ Good
interface InvestmentCardProps {
  investment: Investment;
  onEdit?: () => void;
}

export function InvestmentCard({ investment, onEdit }: InvestmentCardProps) {
  if (!investment) return null;

  return (
    <Card>
      <CardHeader>{investment.name}</CardHeader>
    </Card>
  );
}

// ❌ Bad
export function InvestmentCard(props: any) {
  return <div>{props.investment.name}</div>;
}
```

#### State Management
- ✅ Zustand für globalen State
- ✅ useState für lokalen State
- ✅ Descriptive Actions

```typescript
// ✅ Good
const createInvestment = async (data: CreateInvestmentDTO) => {
  // ...
};

// ❌ Bad
const create = (d: any) => {
  // ...
};
```

#### Styling
- ✅ Tailwind CSS Utility Classes
- ✅ shadcn/ui Components
- ✅ Responsive Design (mobile-first)
- ✅ Dark Mode Support vorbereitet

```typescript
// ✅ Good
<div className="flex items-center gap-4 p-4 rounded-lg border bg-card">
  <Button variant="outline" size="sm">
    Bearbeiten
  </Button>
</div>

// ❌ Bad
<div style={{ display: 'flex', padding: '16px' }}>
  <button>Bearbeiten</button>
</div>
```

### 4. Testing

```bash
# Unit Tests ausführen (wenn vorhanden)
npm test

# Spezifischen Test
npm test -- InvestmentForm.test

# Coverage
npm test -- --coverage
```

**Test-Strategie:**
- Unit Tests für Business Logic (lib/)
- Integration Tests für Workflows
- Component Tests für UI
- E2E Tests für kritische Flows

### 5. Commit

**Commit Message Format:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: Neues Feature
- `fix`: Bug Fix
- `docs`: Dokumentation
- `style`: Code-Formatierung
- `refactor`: Code-Refactoring
- `test`: Tests hinzufügen/ändern
- `chore`: Build/Config Änderungen

**Beispiele:**

```bash
feat(investments): add investment list view with filtering

- Implement InvestmentTable component
- Add filtering by status, category, and date
- Add search functionality
- Add pagination

Closes #42

---

fix(login): resolve invalid credentials error

- Add defensive error handling in DataAdapter
- Initialize storage before login attempt
- Improve error messages

Fixes #38

---

docs(readme): update quick start guide

- Add seed instructions
- Update demo credentials table
```

### 6. Pull Request

**PR Template:**

```markdown
## Beschreibung
[Was wurde geändert und warum?]

## Type of Change
- [ ] Bug Fix
- [ ] New Feature
- [ ] Breaking Change
- [ ] Documentation Update

## Testing
- [ ] Unit Tests hinzugefügt/aktualisiert
- [ ] Manuell getestet
- [ ] Keine Regression

## Screenshots (wenn UI-Änderung)
[Screenshots einfügen]

## Checklist
- [ ] Code folgt Style Guidelines
- [ ] TypeScript Errors behoben
- [ ] ESLint Warnings behoben
- [ ] Selbst-Review durchgeführt
- [ ] Dokumentation aktualisiert
- [ ] CHANGELOG.md aktualisiert (wenn nötig)
```

---

## 🧪 Testing

### Unit Tests

```typescript
// __tests__/unit/lib/utils.test.ts
import { formatCurrency, formatDate } from '@/lib/utils';

describe('formatCurrency', () => {
  it('should format number as EUR currency', () => {
    expect(formatCurrency(1000)).toBe('1.000,00 €');
  });
});
```

### Integration Tests

```typescript
// __tests__/integration/investment-workflow.test.ts
describe('Investment Workflow', () => {
  it('should create and approve investment', async () => {
    // Login as GF
    await login('gf@demo.de', 'demo');

    // Create investment
    const investment = await createInvestment({...});

    // Submit for approval
    await submitForApproval(investment.id);

    // Verify status
    expect(investment.status).toBe('zur_genehmigung');
  });
});
```

---

## 🐛 Bug Reports

**Bug melden via Issue:**

```markdown
## Bug Beschreibung
[Klare Beschreibung des Bugs]

## Schritte zur Reproduktion
1. Gehe zu '...'
2. Klicke auf '...'
3. Scrolle nach '...'
4. Siehe Fehler

## Erwartetes Verhalten
[Was sollte passieren?]

## Screenshots
[Screenshots wenn möglich]

## Environment
- Browser: [z.B. Chrome 120]
- OS: [z.B. Windows 11]
- Version: [z.B. 0.3.0]

## Zusätzlicher Kontext
[Weitere Informationen]
```

---

## 💡 Feature Requests

**Feature vorschlagen via Issue:**

```markdown
## Feature Beschreibung
[Klare Beschreibung des Features]

## Use Case
[Warum wird das Feature benötigt?]

## Vorgeschlagene Lösung
[Wie könnte es implementiert werden?]

## Alternativen
[Andere Lösungsansätze?]

## Priorität
- [ ] Low
- [ ] Medium
- [ ] High
- [ ] Critical
```

---

## 📋 Code Review Checklist

### Als Author:
- [ ] Code ist self-explanatory
- [ ] Kommentare für komplexe Logik
- [ ] Keine Console.logs im Production Code
- [ ] TypeScript Errors behoben
- [ ] ESLint Warnings behoben
- [ ] Tests hinzugefügt (wenn nötig)
- [ ] Dokumentation aktualisiert
- [ ] CHANGELOG.md aktualisiert

### Als Reviewer:
- [ ] Code folgt Style Guidelines
- [ ] Logik ist korrekt
- [ ] Edge Cases behandelt
- [ ] Performance berücksichtigt
- [ ] Security berücksichtigt
- [ ] Tests ausreichend
- [ ] Dokumentation klar

---

## 🔒 Security

**Sicherheitsrichtlinien:**
- ❌ Keine Secrets im Code
- ❌ Keine API Keys committen
- ✅ Input Validation
- ✅ XSS Prevention
- ✅ CSRF Protection (später mit Supabase)

**Sicherheitslücke melden:**
Bitte nicht öffentlich als Issue, sondern direkt an [security@example.com]

---

## 📚 Ressourcen

### Dokumentation
- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Tools
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Tailwind CSS Playground](https://play.tailwindcss.com)

---

## ❓ FAQ

### Wie starte ich mit einem neuen Feature?
1. Siehe [ENTWICKLUNGSPLAN.md](./ENTWICKLUNGSPLAN.md) für offene Tasks
2. Erstelle Branch: `git checkout -b feature/your-feature`
3. Entwickle lokal
4. Teste gründlich
5. Erstelle Pull Request

### Wo finde ich Mock-Daten?
- Automatisch generiert beim Seeding
- Oder manuell: `lib/utils/mockDataGenerator.ts`

### Wie debugge ich die App?
- React DevTools (Browser Extension)
- Chrome DevTools
- Console.log (nur in Development!)
- Zustand DevTools

### Wie teste ich verschiedene Rollen?
- Verwende Quick-Login Buttons auf Login-Seite
- Oder baue Dev Tools Panel (Phase 8)

### Warum Local Storage statt echter DB?
- Lokale Entwicklung ohne Backend-Setup
- Einfaches Testing
- Offline-fähig
- Migration zu Supabase später

---

## 🤝 Community

**Hilfe benötigt?**
- Erstelle Issue auf GitHub
- Frage im Team-Chat
- Siehe Dokumentation

**Ideen teilen?**
- Feature Request Issue erstellen
- Im Team diskutieren
- PR mit Prototype

---

## 📜 License

Internes Projekt - Alle Rechte vorbehalten

---

**Danke für deinen Beitrag! 🎉**
