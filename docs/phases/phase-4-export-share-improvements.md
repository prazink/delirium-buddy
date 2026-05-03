# Phase 4 - Export and Share Improvements

## Goal

Improve Delirium Buddy's ability to turn check-ins into clear shareable information for care conversations.

The core product promise is:

```txt
Track daily changes
  → understand patterns
  → share useful summaries with care staff
```

## Problem being solved

The app already has a 7-day summary and entry detail screens, but sharing should be easier and more useful.

Users should be able to share:

- the 7-day summary
- a latest/individual check-in
- a full local log export

This helps carers bring structured notes to GP, nurse, hospital, or aged-care conversations.

## Scope included

- Add reusable export text builders.
- Improve 7-day summary share text formatting.
- Add share latest/individual check-in from Entry Detail.
- Add export all local logs from Settings.
- Keep safe medical wording.

## Scope intentionally excluded

- No PDF generation yet.
- No CSV file generation yet.
- No backend export.
- No cloud sync.
- No email integration.
- No clinic/hospital transfer workflow.
- No AI-generated clinical summary.

## Product value

This makes the MVP more practical. The user can record changes and then share them clearly without manually rewriting notes.

## Safety and privacy notes

Exports are user-triggered only.

The app should continue to say summaries are for personal tracking and care conversations only. They do not diagnose, predict, prevent, treat, or replace medical assessment.

## Manual QA checklist

- Add person profile.
- Add multiple check-ins.
- Open 7-day Summary and share.
- Open Entry Detail and share that entry.
- Open Settings and export all local logs.
- Confirm share sheets open.
- Confirm shared text includes safety wording.

## Interview talking points

Use this story:

> I improved the app's core communication value by adding structured export and share flows. Instead of keeping notes trapped in the app, carers can share a 7-day summary, an individual check-in, or all local logs. I kept exports user-triggered and included safety wording to avoid medical overclaims.
