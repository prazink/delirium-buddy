# Roadmap

This roadmap keeps Delirium Buddy moving in safe, professional phases.

## Completed

### Phase 1 - Codebase hardening

- Expo SDK 54 upgrade
- Strict TypeScript
- ESLint and Prettier
- Domain/storage/utils structure
- Zod validation
- Risk scoring tests
- Removed helper files from Expo routes

### Phase 2 - Carer MVP foundation

- Person Profile / baseline
- Expanded check-in model
- Red flag fields
- 7-day Summary
- Shareable summary text
- Local profile storage

## Next recommended phase

### Phase 3 - UX polish and baseline comparison

Goal: make the app feel more polished and product-ready.

Recommended scope:

- Improve dashboard hierarchy and visual polish
- Add baseline comparison to RiskCard
- Add empty states that guide the user
- Add safer red flag guidance text
- Improve History filters
- Improve Entry detail layout
- Add clear local-only privacy copy
- Add app-level design tokens

Why this matters:

The app now has useful features, but it needs to feel trustworthy and easy for non-technical carers.

## Future phases

### Phase 4 - Reminders and privacy settings

- Daily check-in reminder settings
- Data export
- Clear all local data
- Optional local PIN/biometric lock
- Better onboarding

### Phase 5 - Evidence and education layer

- Delirium education content
- What changes to watch for
- When to contact care staff
- When to seek urgent help
- Plain-English glossary

### Phase 6 - Backend-ready architecture

- API client shell
- Offline sync queue structure
- Feature flags
- Environment config
- Prepare for auth/sync without enabling it yet

### Phase 7 - Secure backend MVP

- Auth
- User account sync
- Profile sync
- Encrypted storage strategy
- Audit logging foundation
- Cloud database

### Phase 8 - Clinic / aged-care pilot mode

- Organisation model
- Staff roles
- Patient/person list
- Staff dashboard
- Export reports
- Review queue

### Phase 9 - Tenant and RBAC platform

- Tenant isolation
- Role-based access control
- Site/ward/team model
- User invitations
- Audit trail
- Admin dashboard

### Phase 10 - Safe AI support

Only after the app has strong safety and review workflows.

Possible AI support:

- Draft 7-day summary
- Plain-English explanation
- Handover note draft
- Missing-data hints

AI must not diagnose, predict, treat, prevent, or replace clinical assessment.

## Guiding principles

1. Keep claims medically safe.
2. Build trust before adding complexity.
3. Keep domain logic testable.
4. Keep personal data private.
5. Add backend only when product value is proven.
6. Add tenant/RBAC only when moving toward clinic/aged-care pilots.
7. Document every phase for portfolio and interview use.
