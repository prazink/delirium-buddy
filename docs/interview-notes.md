# Interview Notes

This document helps explain Delirium Buddy in interviews and portfolio conversations.

## Short project pitch

Delirium Buddy is a local-first Expo / React Native app that helps carers record daily changes, compare them against a baseline, and create a shareable 7-day summary for care conversations.

It is not a diagnostic app. It is positioned as personal tracking and communication support.

## Technical pitch

I built Delirium Buddy with Expo, React Native, TypeScript, Expo Router, Zod, AsyncStorage, and Vitest.

I started with a simple prototype, then improved the architecture by moving business logic into a `src/domain` layer, adding storage repositories, enabling strict TypeScript, adding runtime validation, and writing tests for the risk scoring function.

## Product pitch

The product solves a real communication problem for carers. In stressful health situations, carers may notice changes like sudden confusion, poor sleep, agitation, hallucination, falls, fever, or medication changes, but struggle to summarise them clearly to care staff.

Delirium Buddy provides structured check-ins and a 7-day summary that can be shared during care conversations.

## Architecture talking points

- Expo Router is used for mobile app routing.
- Screens live in `app/`.
- Domain logic lives in `src/domain/`.
- Local data access lives in `src/storage/`.
- Shared utilities live in `src/utils/`.
- Zod validates local persisted data.
- Vitest covers risk scoring logic.
- Strict TypeScript improves maintainability.

## Safety talking points

I intentionally avoided medical overclaims.

The app does not diagnose, predict, treat, or prevent delirium. It helps record observable changes and create summaries for care conversations.

This is important because healthcare software can become regulated depending on its intended purpose. For the MVP, I kept the scope to local-first personal tracking and communication support.

## Example interview answer: why local-first?

I chose local-first for the MVP because it reduced privacy and platform complexity while validating the core user workflow. Before adding cloud sync, authentication, or tenant/RBAC, I wanted to prove that structured daily observations and shareable summaries were useful.

## Example interview answer: how did you improve code quality?

I hardened the codebase before adding more features. I upgraded Expo, enabled strict TypeScript, added ESLint/Prettier, moved business logic out of route files, added Zod validation for local storage data, and wrote unit tests around the risk scoring logic.

## Example interview answer: what would you build next?

The next step is UX polish and baseline comparison. I would improve the dashboard, compare new logs against the person profile, add better empty states, and add privacy settings. After that, I would add reminders, export/delete data, and then prepare a backend-ready architecture.

## Example interview answer: how would this scale?

For a clinic or aged-care version, I would add a backend with authentication, tenant isolation, role-based access control, audit logging, and a staff dashboard. I would keep the mobile app for carer/patient check-ins and create a web dashboard for staff review and reporting.

## Key achievements to mention on resume

- Built a local-first React Native health-support app using Expo and TypeScript.
- Refactored prototype into maintainable domain/storage/component layers.
- Added runtime validation with Zod for persisted local data.
- Added unit tests for explainable risk scoring logic.
- Designed carer-focused profile, expanded check-ins, red flag capture, and shareable 7-day summaries.
- Maintained safe healthcare positioning by avoiding diagnostic or treatment claims.

## One-minute interview story

I built Delirium Buddy as a local-first React Native app for carers to track daily changes and create shareable summaries for care conversations. I first hardened the codebase with strict TypeScript, Zod validation, tests, and a cleaner architecture. Then I added product features like a person profile, expanded check-in fields, red flag capture, and a 7-day summary. I was careful with healthcare wording and kept the MVP local-only, avoiding diagnostic claims until there is proper clinical and regulatory review.
