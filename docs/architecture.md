# Architecture Overview

## Current architecture

Delirium Buddy is currently a local-first Expo / React Native app using Expo Router.

```txt
app/
  _layout.tsx
  index.tsx
  login.tsx
  profile.tsx
  log.tsx
  history.tsx
  entry.tsx
  summary.tsx
  about.tsx

src/
  components/
  domain/
  storage/
  utils/
```

## Key architectural decisions

### 1. Local-first MVP

The app currently stores data on device using AsyncStorage.

This keeps the first MVP simpler and avoids prematurely introducing backend, tenant, RBAC, and clinical data governance complexity.

Current local storage repositories:

- `src/storage/localUserRepository.ts`
- `src/storage/localLogRepository.ts`
- `src/storage/localProfileRepository.ts`

### 2. Domain logic separated from screens

Business/domain logic is kept outside the Expo Router `app/` directory.

This avoids Expo Router treating helper files as routes and keeps screens thinner.

Current domain areas:

- `src/domain/logs/`
- `src/domain/risk/`
- `src/domain/summary/`

### 3. Runtime validation

Zod schemas validate local data before use.

This protects the app from broken/corrupted local JSON and supports future data migrations.

Current schemas:

- `LogEntrySchema`
- `LogEntriesSchema`
- `UserSchema`
- `PersonProfileSchema`

### 4. Explainable risk-style score

The risk-style score is intentionally simple and explainable.

It considers:

- Agitation
- Confusion
- Sleep
- Medication changes
- Fever/infection
- Recent upward trend

Important: this score is for personal support and pattern visibility only. It is not a diagnosis or clinical prediction model.

### 5. Summary builder

The 7-day summary is built from recent logs and profile data. It provides shareable text for care conversations.

The summary clearly states that it is personal tracking only and does not replace medical assessment.

## Current validation scripts

```bash
npm run typecheck
npm run lint
npm run test
npm start
```

## Current stack

- Expo SDK 54
- React Native
- Expo Router
- TypeScript strict mode
- Zod
- AsyncStorage
- Victory Native
- Vitest
- ESLint
- Prettier

## Future architecture direction

Future SaaS/clinic/hospital phases should add:

```txt
Mobile App
  - Carer/patient check-ins
  - Offline-first drafts
  - Push reminders

Backend API
  - Auth
  - User profile sync
  - Patient records
  - Audit logs
  - Notification jobs

Web Dashboard
  - Clinic/aged-care admin
  - Patient list
  - Reports
  - Team assignment

Database
  - PostgreSQL
  - Tenant isolation
  - Role-based access
  - Audit trails
```

## Future security requirements

Before storing real patient/clinic data in the cloud, the app will need:

- Real authentication
- Secure token storage
- Tenant isolation
- Role-based access control
- Audit logs
- Privacy policy
- Data export/delete flow
- Consent model
- Error monitoring without sensitive data leakage
- Clinical/regulatory review before any diagnostic or monitoring claims
