# Phase 6I - Reminder and Repeat Check Workflow

## 1. Problem being solved

Delirium Buddy already supports check-ins, structured screening support, baseline comparison, trends, entry detail cards and 7-day handover summaries.

The missing workflow gap was remembering to repeat observations over time. Delirium-related change tracking is most useful when observations are repeated, so this phase adds local reminders that make the app feel more like a care workflow assistant instead of a passive note-taking tool.

## 2. Scope included

- Add editable daily check-in reminder settings.
- Use Expo Notifications for local-only reminders.
- Allow the user to enable or disable the daily reminder.
- Allow the user to choose the reminder time.
- Reschedule the existing local reminder when the time changes.
- Cancel the scheduled reminder when the user disables it or clears local data.
- Suggest a one-off repeat check prompt after a higher-concern entry.
- Keep reminder logic local-only.
- Add safer reminder wording throughout the UI and notification content.

## 3. Scope intentionally excluded

This phase does not add:

- backend sync
- accounts
- cloud reminders
- hospital dashboards
- staff alerting
- urgent escalation
- medical monitoring
- automatic diagnosis
- automatic delirium detection
- remote carer notifications

Those are outside the MVP safety boundary.

## 4. Technical changes

### Local reminder storage

`src/storage/localReminderRepository.ts` continues to store local reminder settings:

```ts
enabled
hour
minute
notificationId
updatedAt
```

The repository validates time values when loading stored settings so invalid values fall back safely.

### Notification service helpers

`src/services/localReminderService.ts` now exposes Phase 6I helper names:

```ts
scheduleDailyCheckInReminder
cancelDailyCheckInReminder
rescheduleDailyCheckInReminder
scheduleRepeatCheckReminder
```

The older names remain as aliases for compatibility with earlier code.

### Settings screen

`app/settings.tsx` now includes:

- daily reminder enable/disable switch
- current reminder time display
- change reminder time action
- iOS modal time picker
- Android native time picker
- local-only safe reminder copy

If the reminder is already enabled and the user changes the time, the app cancels and reschedules the local notification.

### Repeat check prompt

`app/log.tsx` now checks whether a saved entry contains higher-concern observations, including:

- agitation 8+
- confusion 8+
- sudden change
- fever/infection
- hallucination
- fall or near fall
- positive structured screen

When one of those is present, the app offers to set a one-off repeat check prompt for later.

## 5. Product value

This makes Delirium Buddy feel more like a supportive workflow tool.

Instead of only storing entries, the app now helps the user maintain a repeated observation habit and optionally reminds them to check again after a concerning observation.

The product value is not clinical alerting. The value is personal workflow support, care conversation preparation and better continuity of observations over time.

## 6. Safety/privacy notes

- Reminders are local device notifications only.
- Reminder settings stay on the device.
- Reminder content does not include private check-in details.
- The app does not alert staff.
- The app does not contact emergency services.
- The app does not diagnose or detect delirium automatically.
- The repeat prompt is optional and user-controlled.
- The reminder copy describes reminders as personal prompts only.

## 7. Manual QA checklist

- Open Settings.
- Confirm daily check-in reminder card appears.
- Enable reminder.
- Confirm notification permission request appears when required.
- Confirm reminder setting persists.
- Change reminder time.
- Confirm the new time displays.
- Disable reminder.
- Confirm no crash.
- Clear local data.
- Confirm reminder settings are cleared and any scheduled daily reminder is cancelled.
- Add a low-concern check-in.
- Confirm normal saved prompt appears.
- Add a high-concern check-in.
- Confirm repeat check prompt appears.
- Choose “Not now”.
- Confirm app returns to dashboard.
- Add another high-concern check-in.
- Choose “Remind me in 2 hours”.
- Confirm local notification permission is requested if needed.
- Restart the app.
- Confirm daily reminder settings persist.

Run:

```bash
npm run typecheck
npm run lint
npm run test
npx expo start -c
```

## 8. Interview talking points

Use this explanation:

> I added a local reminder workflow using Expo Notifications. The user can enable a daily check-in reminder, choose the reminder time, and optionally set a one-off repeat check prompt after a higher-concern entry. I kept the feature local-only and avoided any clinical alerting claims.

Strong product angle:

> This phase moves the app from passive record keeping toward a supportive care workflow. Repeated observations are important for care conversations, so reminders help carers maintain continuity without turning the app into a diagnostic or emergency system.

Strong technical angle:

> The implementation separates storage, notification scheduling and screen UI. Reminder settings are validated locally, scheduling is handled in a small service, and the check-in screen only decides when to suggest a repeat prompt.
