# Onboarding Cockpit — Werner Sobek AG

Web-App zur Verwaltung von Mitarbeiter-Onboarding-Cases, integriert mit SharePoint Online.

## Features

- **Dashboard** mit KPI-Kacheln (Cases gesamt, offen/aktiv, abgeschlossen, Bewertung, NPS)
- **Case Management** — Cases erstellen, bearbeiten, Status aendern
- **Aufgaben-Checkliste** — 8 Onboarding-Tasks mit Zustaendigen (AD, E-Mail, VPN, Hardware, Telefon, Badge, Einweisung, M365)
- **Feedback-Uebersicht** — Bewertungen und NPS anzeigen
- **Aktivitaetsprotokoll** — Alle Aenderungen nachvollziehbar
- **Suche und Filter** — Cases nach Name, Status, Team filtern

## Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **Fluent UI React v9** — Microsoft Design System
- **MSAL.js** — Entra ID Authentifizierung
- **Microsoft Graph API** — SharePoint Online Datenzugriff
- **TanStack React Query** — Server State Management
- **React Hook Form** + **Zod** — Formularvalidierung

## Voraussetzungen

- Node.js >= 18
- Entra ID App Registration (siehe [docs/ENTRA_ID_SETUP.md](docs/ENTRA_ID_SETUP.md))
- SharePoint Online Site mit den 3 Listen (Onboarding_Cases, Onboarding_Feedback, Onboarding_Protokoll)

## Installation

```bash
# Repository klonen
git clone <repo-url>
cd onboarding

# Dependencies installieren
npm install

# Umgebungsvariablen konfigurieren
cp .env.example .env
# .env anpassen falls noetig

# Entwicklungsserver starten
npm run dev
```

Die App ist dann unter `http://localhost:5173` erreichbar.

## Umgebungsvariablen

| Variable | Beschreibung | Default |
|----------|-------------|---------|
| `VITE_CLIENT_ID` | Entra ID App Registration Client ID | `cc86b24c-...` |
| `VITE_TENANT_ID` | Azure AD Tenant | `wernersobek.onmicrosoft.com` |
| `VITE_SP_HOSTNAME` | SharePoint Hostname | `wernersobek.sharepoint.com` |
| `VITE_SP_SITE_PATH` | SharePoint Site-Pfad | `/sites/IT-Onboarding` |

## Produktion

```bash
# Build erstellen
npm run build

# Ausgabe in dist/
```

Der `dist/` Ordner kann auf Azure Static Web Apps, einem Webserver oder SharePoint gehostet werden.

## Projektstruktur

```
src/
  auth/           # MSAL Konfiguration, Auth Provider, useAuth Hook
  api/            # Graph API Client, SharePoint CRUD, Entity APIs
  types/          # TypeScript Interfaces (Case, Feedback, Protocol)
  hooks/          # React Query Hooks, Dashboard Stats
  components/
    layout/       # AppLayout, Header, Sidebar
    common/       # KpiTile, StatusBadge, TaskToggle, etc.
    dashboard/    # Dashboard Screen
    cases/        # Cases Liste, Detail, Neuer Case, Checkliste
    feedback/     # Feedback Uebersicht + Detail
    protocol/     # Aktivitaetsprotokoll
  utils/          # Konstanten, Formatierung
  styles/         # Fluent UI Theme
```

## SharePoint Listen

Die App arbeitet mit 3 bestehenden SharePoint-Listen:

- **Onboarding_Cases** — Hauptliste mit Personaldaten, Status und Aufgaben
- **Onboarding_Feedback** — Bewertungen und NPS-Werte
- **Onboarding_Protokoll** — Aenderungsprotokoll (automatisch gefuellt)
