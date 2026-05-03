# Phase 3C - Privacy and Local Data Controls

## Goal

Add clear privacy messaging and local data controls so Delirium Buddy feels safer, more trustworthy, and more professional for a health-support app.

## Problem being solved

The app stores personal health-related observations locally. Users should understand:

- Data is currently stored on this device only.
- The app does not send data to a server.
- The app does not use AI or cloud sync yet.
- They can clear local data when needed.

This is important for trust, product quality, and interview/portfolio explanation.

## Scope included

- Add a Settings screen.
- Add local-only privacy explanation.
- Add clear local data section.
- Add ability to clear logs/profile/local user data.
- Add dashboard navigation to Settings.
- Keep safe wording around medical use.

## Scope intentionally excluded

- No cloud sync.
- No backend.
- No account deletion flow because accounts are local-only.
- No encryption/biometric lock yet.
- No tenant/RBAC.
- No AI.

## Product value

This gives users clearer control over their local data and shows privacy thinking early in the product.

It also helps explain the project in interviews because health-related apps need careful data handling and privacy-aware product decisions.

## Manual QA checklist

- Open Settings from Dashboard.
- Read local-only privacy explanation.
- Clear local data.
- Confirm app returns to local user setup or empty state.
- Confirm dashboard/history/summary no longer show old data.
- Confirm app remains usable after clearing data.

## Interview talking points

Use this story:

> Because Delirium Buddy stores sensitive personal observations, I added a privacy and local data controls screen early. I wanted users to understand that the MVP is local-only, does not send data to a backend, and allows them to clear local data. This shows privacy-by-design thinking before adding cloud sync or tenant-based features.
