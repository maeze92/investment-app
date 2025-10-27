# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt hält sich an [Semantic Versioning](https://semver.org/lang/de/).

---

## [Unreleased]

### Geplant
- Phase 4: Investment Management UI
- Phase 5: Approval Workflow
- Phase 6: Role-specific Dashboards
- Phase 7: Notifications & Reports System
- Phase 8: Testing & Dev Tools

---

## [0.3.0] - 2025-10-27

### Added
- Login Error Handling verbessert
- `useStorageStatus` Hook für Storage-Status Checks
- Alert UI Component (success, warning, destructive, info variants)
- Storage-Status Banner im Login (warnt wenn keine Daten vorhanden)
- Link zu Seed-Seite direkt aus Login-Fehlermeldung
- Deutsche Fehlermeldungen im Auth Store
- Favicon (SVG Icon mit "I")
- Login-Buttons werden deaktiviert wenn keine Daten vorhanden
- Defensive Error Handling im DataAdapter

### Changed
- Login UI komplett überarbeitet mit besseren Fehlermeldungen
- DataAdapter prüft nun Storage-Initialisierung vor Login
- Error Codes standardisiert (NO_DATA_FOUND, INVALID_CREDENTIALS)

### Fixed
- **KRITISCH**: Login-Fehler "Invalid credentials" behoben
- Favicon 404-Fehler behoben
- Race Condition bei Storage-Initialisierung behoben

---

## [0.2.0] - 2025-10-27

### Added
- Mock Data Generator mit Faker.js (realistiche Testdaten)
- Browser-basierte Seed-Seite (`/seed`)
- Seed-UI mit Statistiken und Status-Feedback
- Reset-Funktionalität für Datenbank
- Verbesserte Startseite mit Schritt-für-Schritt Anleitung
- AppProvider für Store-Initialisierung

### Changed
- Startseite zeigt jetzt Onboarding-Flow
- Seed-Process läuft jetzt im Browser (nicht Node.js)

---

## [0.1.0] - 2025-10-27

### Added

#### Phase 1: Foundation
- Next.js 15 Projekt-Setup mit TypeScript
- Tailwind CSS + PostCSS Konfiguration
- shadcn/ui Integration
  - Button Component
  - Card Component
  - Input Component
  - Label Component
  - Badge Component
  - Select Component
- ESLint Configuration
- Projektstruktur (app/, components/, lib/, stores/, types/)
- 25+ Dependencies installiert

#### Phase 2: Data Layer
- LocalStorageService (Singleton Pattern mit In-Memory Cache)
- Data Adapter Pattern (vorbereitet für Supabase-Migration)
- TypeScript Interfaces für alle Entities (28 Types)
  - Group, Company, User, UserRole
  - Investment, Cashflow, InvestmentApproval
  - Notification, AuditLog
  - LocalDatabase
- Enums und Constants (Roles, Status, etc.)
- DTOs für API Communication
- CRUD Operations für alle Entities
- Utility Functions (formatCurrency, formatDate, etc.)
- Seed & Reset Scripts (Terminal-based)

#### Phase 3: Authentication & State Management
- Zustand Store für Authentication
  - Login/Logout
  - Role Management
  - Permission Checks
- Zustand Store für App State
  - Investments
  - Cashflows
  - Companies, Groups
  - Notifications
- Mock Authentication System (JWT-ähnlich, lokal)
- Login Page mit Quick-Login Buttons
- Dashboard mit Basic Overview
- Role-based Access Control Helpers
  - `hasRole()`
  - `hasAnyRole()`
  - `canAccessCompany()`

#### Demo-Benutzer
- vr@demo.de (Verwaltungsrat)
- cfo@demo.de (CFO)
- gf@demo.de (Geschäftsführer)
- cm@demo.de (Cashflow Manager)
- buchhaltung@demo.de (Buchhaltung)
- Alle Passwörter: `demo`

### Technical Details
- **Framework**: Next.js 15.5.6
- **Language**: TypeScript 5.6.3
- **UI Library**: shadcn/ui + Tailwind CSS
- **State Management**: Zustand 5.0.1
- **Forms**: React Hook Form 7.53.2 + Zod 3.23.8
- **Date Handling**: date-fns 4.1.0
- **Mock Data**: @faker-js/faker 9.2.0
- **Charts**: Recharts 2.13.3 (vorbereitet)

### Known Limitations
- Local Storage 5-10MB Limit
- Keine echten Multi-User Features
- Keine echten Email-Notifications
- Browser-abhängige Datenspeicherung

---

## Versions-Schema

- **Major (X.0.0)**: Breaking Changes, große Architektur-Änderungen
- **Minor (0.X.0)**: Neue Features, backwards-compatible
- **Patch (0.0.X)**: Bug Fixes, kleine Verbesserungen

---

## Links

- [README](./README.md) - Projekt-Übersicht und Quick Start
- [ENTWICKLUNGSPLAN](./ENTWICKLUNGSPLAN.md) - Detaillierter Entwicklungsplan
- [PRD_LOCAL](./PRD_LOCAL.md) - Product Requirements Document

---

**Projekt Start**: 27. Oktober 2025
**Aktueller Status**: Phase 1-3 abgeschlossen, Phase 4-8 in Planung
