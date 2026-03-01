# Plan: n8n Community Node voor Teamleader Focus — Fase 1: Boilerplate + OAuth2

## Context

Er is geen bestaande Teamleader Focus node in n8n core. We bouwen een community node from scratch op basis van de officiële API spec (v1.107.0, 297 endpoints, 67 resources). Fase 1 richt zich uitsluitend op project setup en OAuth2 authenticatie.

**Belangrijke constraints:**
- Teamleader refresh tokens zijn **single-use** → race condition risico bij concurrent gebruik
- `dealPhases.duplicate` endpoint moet worden uitgesloten (bestaat niet in werkelijkheid)
- Toekomst: API spec diffing voor updates (informeert architectuurkeuzes, maar niet voor nu)

---

## Stap 1: Project boilerplate bestanden aanmaken

### Bestanden:

| Bestand | Doel |
|---------|------|
| `package.json` | n8n community node config (`n8n-nodes-teamleader-focus`) |
| `tsconfig.json` | TypeScript config (exact van n8n-nodes-starter) |
| `eslint.config.mjs` | Delegeert naar `@n8n/node-cli/eslint` |
| `.prettierrc.js` | Formatting regels (tabs, single quotes, trailing commas) |
| `.gitignore` | `dist/`, `node_modules/`, `.tsbuildinfo` |

### package.json kernpunten:
- `name`: `n8n-nodes-teamleader-focus`
- `keywords`: `["n8n-community-node-package"]`
- `n8n.n8nNodesApiVersion`: `1`
- `n8n.strict`: `true`
- `n8n.credentials`: `["dist/credentials/TeamleaderFocusOAuth2Api.credentials.js"]`
- `n8n.nodes`: `["dist/nodes/TeamleaderFocus/TeamleaderFocus.node.js"]`
- `peerDependencies`: `{ "n8n-workflow": "*" }`
- `devDependencies`: `@n8n/node-cli`, `eslint`, `prettier`, `typescript`

---

## Stap 2: Directory structuur + icon

```
credentials/
  TeamleaderFocusOAuth2Api.credentials.ts
nodes/
  TeamleaderFocus/
    TeamleaderFocus.node.ts
icons/
  teamleader-focus.svg
```

- Icon: Teamleader Focus logo als SVG (wordt aangeleverd door gebruiker)
- Credential verwijst via `file:../icons/teamleader-focus.svg`
- Node verwijst via `file:../../icons/teamleader-focus.svg`

---

## Stap 3: OAuth2 Credential (`credentials/TeamleaderFocusOAuth2Api.credentials.ts`)

```typescript
export class TeamleaderFocusOAuth2Api implements ICredentialType {
  name = 'teamleaderFocusOAuth2Api';
  extends = ['oAuth2Api'];
  displayName = 'Teamleader Focus OAuth2 API';
  icon: Icon = 'file:../icons/teamleader-focus.svg';
```

### OAuth2 configuratie (hidden properties):
| Property | Waarde |
|----------|--------|
| `grantType` | `authorizationCode` |
| `authUrl` | `https://focus.teamleader.eu/oauth2/authorize` |
| `accessTokenUrl` | `https://focus.teamleader.eu/oauth2/access_token` |
| `scope` | Alle 13 scopes: `companies contacts deals departments events invoices products projects quotations subscriptions tickets todos users` |
| `authentication` | `body` (client_id/secret als POST body params bij token exchange) |

### Credential test:
```typescript
test: ICredentialTestRequest = {
  request: {
    method: 'POST',
    baseURL: 'https://api.focus.teamleader.eu',
    url: '/users.me',
  },
};
```

---

## Stap 4: Minimale Node Skeleton (`nodes/TeamleaderFocus/TeamleaderFocus.node.ts`)

**Stijl: Declaratief** — geen `execute()` method nodig voor fase 1.

- 1 resource: `User`
- 1 operation: `Get Current User` → `POST /users.me`
- Gebruikt `requestDefaults.baseURL = 'https://api.focus.teamleader.eu'`
- Routing op operation level: `routing.request.method = 'POST'`, `routing.request.url = '/users.me'`

Dit is voldoende om de volledige OAuth2 flow te testen.

---

## Stap 5: Race condition strategie voor single-use refresh tokens

### Probleem
n8n's core `requestOAuth2` heeft geen mutex rond token refresh. Bij concurrent gebruik van dezelfde credential:
1. Request A en B krijgen beide 401
2. A refresht succesvol → oud refresh token ongeldig
3. B probeert te refreshen met het nu ongeldige token → FAIL

### Hoe bestaande n8n nodes hiermee omgaan
**Antwoord: helemaal niet.** Onderzochte nodes (HubSpot, Pipedrive, Salesforce) zijn puur credential-config bestanden zonder custom race condition handling. De n8n core `requestOAuth2` heeft geen mutex/lock. GitHub issue [#13088](https://github.com/n8n-io/n8n/issues/13088) is gesloten als "Stale" zonder fix. Community nodes **kunnen** de core refresh logica niet overriden — `requestWithAuthentication` is de enige weg.

### Onze aanpak: consistent met n8n ecosystem

**Fase 1** — Geen actie nodig (single request, geen race mogelijk)

**Fase 2** (bij programmatische `execute()`):
1. **Sequentiële item processing** — `for` loop met `await`, geen parallelle API calls binnen één executie
2. **Documentatie** — Known limitation in README: adviseer batch size = 1 bij workflows die dezelfde credential concurrent gebruiken
3. **Cross-executie races** — Niet op te lossen op node-level, consistent met alle andere n8n OAuth2 nodes

---

## Stap 6: Verificatie

### Build test
```bash
npm install && npm run build
```

### OAuth2 flow testen
1. Registreer OAuth2 app op Teamleader marketplace
2. Redirect URI: `http://localhost:5678/rest/oauth2-credential/callback`
3. Vul client_id/secret in bij credential in n8n
4. Klik "Sign in" → autorisatie flow → redirect terug
5. Klik "Test" → moet `POST /users.me` succesvol uitvoeren

### Node testen
1. Maak workflow → voeg Teamleader Focus node toe
2. Resource: User, Operation: Get Current User
3. Run → output moet `data.id`, `data.first_name`, `data.last_name`, `data.email` bevatten

### Als token exchange faalt
- Switch `authentication` van `'body'` naar `'header'` (Basic auth) en test opnieuw

---

## Overzicht bestanden aan te maken

| # | Bestand | Nieuw |
|---|---------|-------|
| 1 | `package.json` | Ja |
| 2 | `tsconfig.json` | Ja |
| 3 | `eslint.config.mjs` | Ja |
| 4 | `.prettierrc.js` | Ja |
| 5 | `.gitignore` | Ja |
| 6 | `icons/teamleader-focus.svg` | Ja (aangeleverd door gebruiker) |
| 7 | `credentials/TeamleaderFocusOAuth2Api.credentials.ts` | Ja |
| 8 | `nodes/TeamleaderFocus/TeamleaderFocus.node.ts` | Ja |
