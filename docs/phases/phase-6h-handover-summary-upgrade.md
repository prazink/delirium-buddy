# Phase 6H - Handover Summary Upgrade

## 1. Problem being solved

The previous 7-day summary was useful, but it was still mostly a basic report:

```txt
Total check-ins
Medication change days
Fever or infection days
Highest concern day
Red flags
Shareable text
```

After adding structured screening, profile role/relationship and avatar support, the app needs a stronger handover-style output that helps a carer explain changes clearly to care staff.

This phase upgrades the summary from a simple report into a care conversation and handover aid.

## 2. Scope included

- Add handover priority:
  - Routine
  - Watch
  - Review
- Add person and carer context to the summary.
- Add date range.
- Add average agitation, confusion and sleep.
- Add sudden change count.
- Add structured screening count.
- Add positive structured screen count.
- Add key talking points.
- Add suggested questions to ask care staff.
- Add care context flags separately from red flags.
- Upgrade the 7-day Summary screen UI to show a clearer handover layout.
- Upgrade shareable text to include handover-focused sections.

## 3. Scope intentionally excluded

This phase does not add:

- PDF export
- CSV export
- backend sync
- hospital accounts
- ward/team reporting
- clinician messaging
- emergency escalation
- diagnosis or treatment advice

Those are future product phases.

## 4. Technical changes

### Domain summary upgrade

`src/domain/summary/buildSevenDaySummary.ts` now returns a richer `SevenDaySummary` object with:

```ts
handoverPriority
handoverHeadline
keyTalkingPoints
suggestedQuestions
careContextFlags
structuredScreeningCount
positiveStructuredScreens
averageAgitation
averageConfusion
averageSleepHours
```

### Summary screen upgrade

`app/summary.tsx` now renders:

- hero handover card
- priority badge
- overview metrics
- key talking points
- risk and care context section
- questions to ask care staff
- shareable handover text

## 5. Product value

This makes Delirium Buddy much stronger as a workflow prototype.

Instead of only saying:

```txt
Here are the logs
```

it now helps a user say:

```txt
Here is what changed, what was concerning, what context was present, and what I should ask care staff.
```

That is much closer to the real-world purpose of delirium monitoring and carer observation support.

## 6. Safety/privacy notes

- No new sensitive data fields were added.
- No storage changes were made.
- No clinical diagnosis is generated.
- The priority label is a handover aid, not a clinical triage decision.
- The summary repeats that it does not replace clinical assessment.
- All data remains local unless the user chooses to share via the system share sheet.

## 7. Manual QA checklist

- Open 7-day Summary with no logs.
- Confirm empty state/share text still works.
- Add several low-risk logs.
- Confirm priority shows Routine.
- Add fever/infection or red flags.
- Confirm priority changes to Watch or Review depending on severity.
- Add structured screening with a positive screen.
- Confirm positive structured screen count appears.
- Confirm key talking points include structured screening or red flags.
- Tap Share Handover Summary.
- Confirm shared text includes:
  - person name
  - care context
  - period
  - headline
  - overview
  - key talking points
  - questions to ask care staff
  - safety disclaimer
- Run:

```bash
npm run typecheck
npm run lint
npm run test
```

## 8. Interview talking points

Use this explanation:

> I upgraded the summary from a basic report into a handover-style care conversation aid. It now derives a priority label, key talking points, risk/care context and suggested questions from the existing local check-in data. I kept the logic in a domain function and the screen simply renders the derived structure.

Strong product angle:

> This makes the app much more useful because carers often need help explaining what changed, not just storing logs. The summary helps them communicate clearly with nurses, GPs or aged-care staff.

Strong technical angle:

> The design keeps data capture, domain derivation and UI rendering separate. The app stores raw observations, then builds a structured summary at render/share time so the share output can evolve without changing saved data.
