# Phase 3B - History and Entry Detail Polish

## Goal

Make the History and Entry Detail screens feel as polished and useful as the Dashboard.

This phase improves how saved check-ins are reviewed, understood, and explained during demos or care conversations.

## Problem being solved

After Phase 3, the Dashboard became more useful with baseline insights and a clear Add Check-in action. However, History and Entry Detail still need stronger hierarchy and clearer interpretation.

A carer should be able to open an older check-in and quickly understand:

- What happened that day
- Whether there were red flags
- Whether the entry differed from baseline
- What details might be useful to share with care staff

## Scope included

- Improve History list cards.
- Add summary chips for agitation, confusion, sleep, and red flags.
- Improve Entry Detail layout.
- Reuse RiskCard and BaselineInsightsCard on Entry Detail.
- Add a simple observations section on Entry Detail.
- Keep all language medically safe.

## Scope intentionally excluded

- No backend.
- No tenant/RBAC.
- No AI.
- No diagnosis or clinical prediction claims.
- No delete/edit log workflow yet.
- No advanced filters yet.

## Technical changes planned

Potential files:

- `app/history.tsx`
- `app/entry.tsx`
- `src/domain/logs/getLogObservationLabels.ts`
- `docs/roadmap.md`

## Product value

This improves demo quality and practical usability.

Instead of showing raw rows only, the app will present check-ins in a way that feels more like a polished care-support tool.

## Safety and privacy notes

The app continues to be local-only.

Entry Detail should not give clinical advice beyond safe care-conversation language.

## Manual QA checklist

- Open History with no logs.
- Open History with multiple logs.
- Confirm cards are readable.
- Tap a history item.
- Confirm Entry Detail opens.
- Confirm risk card appears.
- Confirm baseline insights appear when profile exists.
- Confirm observation labels are shown.
- Confirm no diagnostic wording is used.

## Interview talking points

Use this story:

> After improving the dashboard, I polished the review workflow. I made History and Entry Detail easier to scan, added observation labels, reused domain-driven baseline insights, and kept the UI focused on care conversation support rather than diagnosis.
