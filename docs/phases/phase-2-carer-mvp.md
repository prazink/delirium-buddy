# Phase 2 - Carer MVP Profile and Summary Features

## Goal

Move Delirium Buddy from a basic diary-style prototype into a more useful carer-focused MVP.

This phase added a person baseline/profile, expanded check-in fields, and a 7-day shareable summary.

## Problem being solved

A simple check-in with agitation, confusion, sleep, medication change, and fever/infection is useful, but carers often need to record broader context.

Important real-world observations include:

- Sudden change from usual behaviour
- Hallucination
- Fall or near fall
- Hydration/eating concerns
- Pain
- Mobility changes
- Urine infection concern
- Glasses/hearing aids missing

The app also needed a way to summarise these observations for a GP, nurse, hospital, or care worker.

## Scope included

- Added Person Profile / baseline screen.
- Added local profile repository.
- Added profile validation schema.
- Expanded `LogEntry` with carer-focused observation fields.
- Added red flag aggregation.
- Added 7-day Summary screen.
- Added shareable summary text.
- Added dashboard links for Profile and 7-day Summary.
- Fixed remaining old helper imports in route files.

## Scope intentionally excluded

- No backend.
- No login/auth beyond local user.
- No tenant/RBAC.
- No clinician dashboard.
- No AI summaries.
- No diagnosis or clinical prediction claims.
- No push reminders yet.

## Technical changes

Key files added/updated:

- `app/profile.tsx`
- `app/summary.tsx`
- `app/log.tsx`
- `app/index.tsx`
- `app/_layout.tsx`
- `src/storage/localProfileRepository.ts`
- `src/domain/summary/buildSevenDaySummary.ts`
- `src/domain/logs/log.types.ts`
- `src/domain/logs/log.schema.ts`

## Person Profile data captured

- Person name or nickname
- Relationship
- Age range
- Normal sleep min/max
- Normal confusion baseline
- Normal mobility
- Existing memory issues
- Recent surgery
- Recent infection

## Expanded check-in fields

- Sudden change from usual
- Fever/infection
- Hallucination
- Fall or near fall
- Medication changed
- Hydration concern
- Eating concern
- Pain concern
- Mobility concern
- Urine infection concern
- Glasses/hearing aids missing

## Summary logic

The 7-day Summary uses recent entries to show:

- Total check-ins
- Highest concern day
- Medication change days
- Fever/infection days
- Red flags noted
- Shareable text summary

The summary includes safe wording that it is personal tracking only and does not replace medical assessment.

## Product value

This phase makes the app much more useful for carers because it changes the app from a simple symptom logger into a communication support tool.

The most important value is the shareable summary. This helps a carer communicate clearly instead of relying on memory during stressful care conversations.

## Safety and privacy notes

The app remains local-only.

No cloud storage, clinical dashboard, or diagnosis claim was added.

The language intentionally avoids saying the app detects, predicts, diagnoses, prevents, or treats delirium.

## Manual QA checklist

- Create/load local user.
- Open Dashboard.
- Open Profile.
- Save a person baseline.
- Add a New Log.
- Toggle red flags and care context fields.
- Save the log.
- Open History.
- Open entry detail.
- Open 7-day Summary.
- Confirm red flags appear in summary.
- Use Share Summary.
- Confirm no route warnings for deleted helper files.

## Validation checklist

```bash
npm run typecheck
npm run lint
npm run test
npm start
```

## Interview talking points

Use this story:

> After hardening the codebase, I added the first meaningful product layer: a carer-focused profile and 7-day summary. The goal was not to make a diagnostic tool, but to help carers record observable changes and communicate them clearly with care staff. I expanded the data model carefully, validated the data locally, kept everything local-first, and added safe wording to avoid medical overclaims.

Key points to mention:

- I translated real user needs into structured check-in fields.
- I added baseline/profile context so future logs are more meaningful.
- I built a shareable summary to support care conversations.
- I kept the architecture local-first and privacy-conscious.
- I intentionally avoided regulated diagnostic claims.
