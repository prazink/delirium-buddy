# Brand UI Direction

## Purpose

This document records the approved visual direction for Delirium Buddy.

The product should feel:

- calm
- supportive
- premium
- trustworthy
- easy to understand
- clearly different from a basic form app

## Approved concept direction

The approved visual direction uses:

- a brain / thought bubble mark
- a heart inside the mark
- orbit/check-in circle cues
- navy, blue and teal gradients
- a small warm coral accent
- soft rounded cards
- gentle care and privacy cues

The logo should communicate:

- cognition and daily change tracking
- care and empathy
- clearer conversations
- supportive private record keeping

## Current repo implementation

Phase 6 adds SVG source assets:

```txt
assets/branding/delirium-buddy-logo-mark.svg
assets/branding/splash-concept.svg
```

It also adds React Native UI equivalents:

```txt
src/theme/tokens.ts
src/components/BrandMark.tsx
src/components/BrandedCard.tsx
```

The app now uses the brand direction directly in:

```txt
app/login.tsx
app/index.tsx
```

## Why SVG source assets first?

The GitHub automation used for this phase can safely create text-based source assets and code changes.

Final native app icon and splash PNG files should be exported from the approved SVG/concept direction before app store release.

Recommended PNG outputs later:

```txt
assets/icon.png              1024 x 1024
assets/adaptive-icon.png     1024 x 1024 foreground-safe
assets/splash.png            1080 x 1920 or Expo-compatible splash size
assets/favicon.png           48 x 48 or 64 x 64
```

## UI principles

### Dashboard

The dashboard should feel like a supportive daily care hub.

Required sections:

- branded header
- clear Add check-in card
- person profile summary
- risk/support summary
- baseline insights
- 7-day trend
- quick actions
- privacy footer

### Accessibility

The UI should use:

- high contrast text
- large tap targets
- readable font sizes
- clear button labels
- accessibility roles and labels
- copy that does not rely only on color

## Interview explanation

Use this story:

> After building the functional MVP, I added a brand/UI polish phase. I translated the product purpose into a calm care-focused visual identity, added shared design tokens, created reusable branded components, refreshed the login and dashboard screens, and improved accessibility labels on key actions.
