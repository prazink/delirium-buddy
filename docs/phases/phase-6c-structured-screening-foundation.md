# Phase 6C - Structured Screening Foundation

## 1. Problem being solved

The previous MVP was useful for carer observations, but it still looked too much like a general daily tracking form.

For hospital, aged-care, ward-trial, or interview positioning, the app needs to show that it can support a recognised delirium workflow pattern:

```txt
risk/context captured
  -> structured screen recorded
  -> score calculated consistently
  -> result included in review, handover and reporting
```

This phase adds the first safe foundation for that workflow without pretending the app can diagnose delirium.

## 2. Scope included

- Added a typed structured screening domain helper in `src/domain/screening/fourAt.ts`.
- Added score bands for:
  - 0: no screening concern recorded
  - 1-3: possible cognitive impairment screen
  - 4 or above: possible delirium screen requiring clinical review
- Added optional `fourAt` data to `LogEntry`.
- Added Zod validation for optional structured screening data.
- Added optional structured screening capture inside the check-in form.
- Added the structured screening result into the existing support/risk reasons.
- Added unit tests for the scoring helper.
- Added unit test coverage for how optional structured screening affects support reasons.

## 3. Scope intentionally excluded

This phase does not add:

- hospital accounts
- staff login
- ward/team dashboard
- backend sync
- FHIR or HL7 integration
- clinical diagnosis
- automatic escalation to a care team
- replacement for local hospital screening policy
- full official assessment text copied into the app

## 4. Technical changes

### New domain file

```txt
src/domain/screening/fourAt.ts
```

This keeps screening scoring separate from UI and storage.

### Data model extension

`LogEntry` now has an optional `fourAt` object so older logs continue to work.

```ts
fourAt?: FourAtScreening | undefined;
```

### Validation boundary

`src/domain/logs/log.schema.ts` validates the optional screening values before logs are persisted or loaded.

### Check-in form

`app/log.tsx` now has an optional toggle to add structured screening scores during a check-in.

The default daily check-in flow still works without using this section.

### Risk/support layer

`calculateRisk` remains an explainable support score, not a diagnosis model. If optional structured screening data is present, the support reasons include that a structured score was recorded.

## 5. Product value

This makes Delirium Buddy stronger because it starts moving from:

```txt
simple carer notes app
```

into:

```txt
structured delirium screening, monitoring, handover and audit-support workflow
```

That is the direction hospitals and aged-care teams are more likely to understand.

The value is not just the score. The value is the workflow:

- consistent capture
- baseline context
- repeat check-ins
- explainable result
- shareable summary
- future audit/reporting potential

## 6. Safety/privacy notes

- This feature is optional.
- The app still stores data locally only.
- The app does not diagnose delirium.
- The app does not replace assessment by trained clinical staff.
- The app does not send alerts or clinical orders.
- Any real clinical use would require local governance, staff training, approved workflows and privacy/security review.

## 7. Manual QA checklist

- Open Add check-in.
- Save a normal check-in without structured screening enabled.
- Confirm the app saves and returns to dashboard.
- Open Add check-in again.
- Enable structured screening fields.
- Select a score of 0 across all fields.
- Confirm the result reads as no concern recorded.
- Select an acute change score of 4.
- Confirm the result updates to possible delirium screen.
- Save the entry.
- Confirm dashboard support summary still loads.
- Open History and Entry Detail to confirm the saved entry still opens.
- Run:

```bash
npm run typecheck
npm run lint
npm run test
```

## 8. Interview talking points

Use this explanation:

> I started with a local-first carer MVP, but then strengthened it by adding a structured screening foundation. I kept the domain scoring in a separate pure TypeScript module, extended the log model in a backwards-compatible way, validated persisted data with Zod, and added tests around the scoring and support-reason logic. I was careful with safety wording: the app supports structured observation and care conversations, but it does not diagnose or replace clinical assessment.

Strong technical angle:

> The important part is separation of concerns. The screen captures data, the domain module scores it, storage validates it, and the dashboard/risk layer only consumes the result. That makes it easier to later add ward reporting, audit exports, backend sync or FHIR-ready data structures without rewriting the core flow.

Strong product angle:

> This turns the app from a simple form into the start of a clinical workflow prototype: screen, monitor, explain, handover and eventually report on compliance.
