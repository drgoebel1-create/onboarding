# Entra ID App Registration — Konfiguration

Diese Anleitung beschreibt die Konfiguration der bestehenden App Registration für die Onboarding Cockpit Web-App.

## Voraussetzungen

- Azure Portal Zugang mit **Application Administrator** oder **Global Administrator** Rolle
- App Registration ID: `cc86b24c-f47b-43e7-8fb5-12eb6f0f86d6`
- Tenant: `wernersobek.onmicrosoft.com`

## 1. Plattform hinzufuegen (SPA)

1. Azure Portal > **App registrations** > App `cc86b24c-f47b-43e7-8fb5-12eb6f0f86d6` oeffnen
2. **Authentication** > **Add a platform** > **Single-page application**
3. Redirect URIs eintragen:
   - `http://localhost:5173` (Entwicklung)
   - `https://<production-domain>` (Produktion, z.B. Azure Static Web Apps URL)
4. **Speichern**

> Hinweis: MSAL v2 nutzt Authorization Code Flow mit PKCE. Implicit Grant ist nicht noetig.

## 2. API-Berechtigungen

1. **API permissions** > **Add a permission** > **Microsoft Graph** > **Delegated permissions**
2. Folgende Berechtigungen hinzufuegen:
   - `User.Read` — Benutzerprofil lesen
   - `Sites.ReadWrite.All` — SharePoint-Listen lesen und schreiben
3. **Grant admin consent for wernersobek** klicken (erfordert Admin-Rechte)

### Optional: Eingeschraenkte Berechtigungen mit Sites.Selected

Statt `Sites.ReadWrite.All` kann auch `Sites.Selected` verwendet werden. Dafuer muss per PowerShell/Graph API eine Site Permission fuer die IT-Onboarding Site erteilt werden:

```powershell
# Via Microsoft Graph PowerShell
Connect-MgGraph -Scopes "Sites.FullControl.All"
New-MgSitesPermission -SiteId "<site-id>" -Body @{
    roles = @("write")
    grantedToIdentities = @(@{
        application = @{
            id = "cc86b24c-f47b-43e7-8fb5-12eb6f0f86d6"
            displayName = "Onboarding Cockpit"
        }
    })
}
```

## 3. Token-Konfiguration

Keine zusaetzliche Token-Konfiguration noetig. MSAL v2 handhabt:
- Access Token Erwerb via `acquireTokenSilent()`
- Automatische Token-Erneuerung
- Fallback auf `acquireTokenRedirect()` bei Interaktionsbedarf

## 4. Verifizierung

Nach der Konfiguration testen:

1. App lokal starten: `npm run dev`
2. Browser oeffnet `http://localhost:5173`
3. "Mit Microsoft anmelden" klicken
4. Microsoft Login-Seite erscheint
5. Nach Anmeldung: Dashboard mit Daten aus SharePoint

### Haeufige Fehler

| Fehler | Ursache | Loesung |
|--------|---------|---------|
| `AADSTS50011` | Redirect URI nicht konfiguriert | Redirect URI in App Registration pruefen |
| `AADSTS65001` | Admin Consent fehlt | Admin Consent im Azure Portal erteilen |
| `403 Forbidden` bei Graph API | Fehlende API-Berechtigungen | `Sites.ReadWrite.All` hinzufuegen + Consent |
| `AADSTS700054` | response_type nicht unterstuetzt | SPA-Plattform statt Web-Plattform verwenden |
