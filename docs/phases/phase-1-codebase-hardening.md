# Phase 1 - Codebase Hardening and Expo SDK 54 Upgrade

## Goal

Make the early Delirium Buddy MVP more professional, maintainable, testable, and compatible with the current Expo Go app.

This phase focused on engineering foundation, not product feature expansion.

## Problem being solved

Before this phase, the app was a useful Expo prototype, but the structure had several issues:

- Expo SDK was outdated for current Expo Go testing.
- TypeScript strictness was not enabled.
- Helper files lived under `app/`, causing Expo Router to treat non-screen files as routes.
- Risk logic was embedded in app-level files rather than a testable domain layer.
- Local storage loaded raw JSON without runtime validation.
- There were no automated tests for the risk-style score.

## Scope included

- Upgrade dependency targets to Expo SDK 54.
- Add `typecheck`, `lint`, `format`, and `test` scripts.
- Enable strict TypeScript rules.
- Add ESLint and Prettier config.
- Move domain logic into `src/`.
- Move storage into repository-style modules.
- Add Zod validation for local data.
- Add risk calculation tests with Vitest.
- Remove helper files from `app/` so Expo Router does not treat them as routes.

## Scope intentionally excluded

- No backend.
- No cloud sync.
- No tenant model.
- No RBAC.
- No AI.
- No clinical diagnosis features.
- No new product workflow beyond making the existing app stronger.

## Technical changes

New/updated structure:

```txt
src/components/
src/domain/logs/
src/domain/risk/
src/storage/
src/utils/
```

Key files:

- `src/domain/risk/calculateRisk.ts`
- `src/domain/risk/calculateRisk.test.ts`
- `src/domain/logs/log.types.ts`
- `src/domain/logs/log.schema.ts`
- `src/storage/localLogRepository.ts`
- `src/storage/localUserRepository.ts`
- `src/utils/dates.ts`
- `src/utils/numbers.ts`

## Product value

This phase makes the app easier to extend safely.

It also creates strong interview evidence because it shows:

- Refactoring discipline
- Clean architecture thinking
- Strict TypeScript usage
- Runtime validation
- Test coverage for business logic
- Expo SDK upgrade handling
- Careful scope control

## Safety and privacy notes

The app remains local-first.

The risk-style score remains explainable and non-clinical. It is positioned as personal tracking support only, not diagnosis or medical advice.

## Manual QA checklist

- App starts with `npm start`.
- App opens in iOS Simulator.
- App opens through Expo Go.
- Dashboard loads.
- New Log saves.
- History displays saved entries.
- Entry detail displays saved entry.
- About screen opens.
- No Expo Router warnings for `app/lib` or `app/types`.

## Validation checklist

```bash
npm run typecheck
npm run lint
npm run test
npm start
```

## Interview talking points

Use this story:

> I inherited/started with a working Expo prototype, then hardened it before adding more features. I upgraded the Expo stack, separated route files from domain logic, enabled strict TypeScript, added Zod validation for local data, and wrote tests around the risk scoring function. I deliberately avoided expanding scope until the foundation was maintainable.

Key points to mention:

- I did not rush into features before stabilising the codebase.
- I moved business logic into testable domain modules.
- I added runtime validation because local storage data can become malformed.
- I kept medical claims safe and avoided positioning the app as diagnostic software.
