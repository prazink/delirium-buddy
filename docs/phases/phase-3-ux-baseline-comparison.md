# Phase 3 - UX Polish and Baseline Comparison

## Goal

Make Delirium Buddy feel more polished, easier to demo, and more useful by comparing check-ins against the person profile baseline.

This phase focuses on product trust, usability, and clearer interpretation of local tracking data.

## Problem being solved

Phase 2 added a person profile and expanded check-ins, but the dashboard and entry screens still need to explain what the information means in a clearer, more product-ready way.

The app should help users understand:

- Whether today's sleep is below the person's normal range
- Whether today's confusion is higher than their baseline
- Whether there are red flags that should be discussed with care staff
- What to do next without making medical claims

## Scope included

- Add baseline comparison logic.
- Show baseline insights on dashboard.
- Improve empty states for first-time users.
- Improve risk card / support card language.
- Add red flag guidance that stays medically safe.
- Improve entry detail readability.
- Keep app local-only.

## Scope intentionally excluded

- No backend.
- No tenant/RBAC.
- No AI.
- No diagnosis or clinical prediction claims.
- No push reminders yet.
- No native biometric lock yet.

## Technical changes planned

Potential files:

- `src/domain/baseline/compareToBaseline.ts`
- `src/components/BaselineInsightsCard.tsx`
- `src/components/EmptyState.tsx`
- `app/index.tsx`
- `app/entry.tsx`
- `docs/roadmap.md`

## Product value

This phase turns raw tracking data into a more understandable experience.

Instead of only showing numbers, the app will explain simple patterns such as:

- Sleep was below the normal range.
- Confusion was higher than baseline.
- Red flags were noted.
- A shareable summary may be useful for care conversations.

## Safety and privacy notes

The app must continue to say that it supports personal tracking and care conversations only.

It must not say it diagnoses, predicts, treats, or prevents delirium.

## Manual QA checklist

- Start with no profile and no logs.
- Confirm helpful empty state appears.
- Add profile baseline.
- Add a log below normal sleep range.
- Add a log above confusion baseline.
- Confirm dashboard shows baseline insights.
- Confirm entry detail remains readable.
- Confirm summary still works.

## Interview talking points

Use this story:

> After adding profile and check-in features, I improved the product experience by adding baseline comparison and clearer empty states. The goal was to make the app useful to carers without overclaiming clinically. I focused on simple, explainable insights based on the person's own baseline, not black-box AI or diagnosis.
