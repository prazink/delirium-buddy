# Phase 3D - Onboarding Polish

## Goal

Make the first-time user journey clearer, safer, and easier to understand.

The onboarding flow should guide users through the minimum useful setup:

```txt
Create local user
  → Add person profile / baseline
  → Add first check-in
  → View dashboard insights
```

## Problem being solved

The app already has strong MVP features, but a first-time user may not immediately know what to do first.

Without guidance, users can land on the dashboard before creating a person profile or adding a check-in. This can make the app feel empty or confusing.

## Scope included

- Improve local user/login copy.
- Add first-run dashboard guidance.
- Show a start-here card when no person profile exists.
- Show a next-step card when profile exists but no check-ins exist.
- Keep the main Add Check-in action visible.
- Keep wording medically safe and local-first.

## Scope intentionally excluded

- No backend onboarding.
- No cloud account creation.
- No tenant/RBAC.
- No AI.
- No push reminders yet.
- No multi-step onboarding wizard yet.

## Product value

This makes the app easier to demo and easier for a new user to understand.

It also helps explain the product flow in interviews because the MVP now has a clear user journey.

## Manual QA checklist

- Clear local data.
- Open app.
- Create local user.
- Confirm dashboard explains first step.
- Add person profile.
- Return to dashboard.
- Confirm app prompts for first check-in.
- Add first check-in.
- Confirm dashboard insights appear.

## Interview talking points

Use this story:

> After building the main MVP features, I improved the first-run experience so users understand the setup journey. I added guidance for creating a baseline profile and first check-in, while keeping the app local-first and medically safe.
