# Delirium Buddy Release QA Checklist

Use this checklist before submitting a TestFlight, internal testing, or app store build.

## 1. Setup and onboarding

- Open the app after clearing local data.
- Confirm the welcome screen appears.
- Confirm the Delirium Buddy logo is visible and not clipped.
- Confirm no user-facing copy says “MVP”.
- Confirm no user-facing copy says “local user”.
- Confirm the privacy note reads clearly.
- Enter a name and create an account.
- Confirm the app opens the dashboard.
- Tap “I already have an account” with no account and confirm a helpful message appears.

## 2. Person profile

- Open the person profile flow.
- Add the person being supported.
- Add relationship / carer role details.
- Add baseline information.
- Confirm avatar/photo/default avatar handling still works.
- Restart the app and confirm profile details persist.

## 3. Dashboard

- Confirm the dashboard header shows the Delirium Buddy logo and greeting.
- Confirm the person card appears after profile setup.
- Confirm the primary “Add check-in” action opens the new entry screen.
- Confirm risk/support summary card still renders safely.
- Confirm trend cards render even with no logs and with multiple logs.
- Confirm Daily reminder card displays “Off” when reminders are off.
- Enable a reminder in Settings, return to dashboard, and confirm the card updates.
- Confirm Quick Actions navigation works.
- Confirm bottom navigation buttons work.

## 4. Check-ins and structured screening

- Add a normal low-concern check-in.
- Confirm it saves and appears in history.
- Add a higher-concern check-in.
- Confirm the optional repeat check prompt appears.
- Tap “Not now” and confirm the app returns safely.
- Add another higher-concern check-in.
- Tap “Remind me in 2 hours” and confirm the permission/scheduling flow works.
- Add optional structured screening fields.
- Confirm result wording does not claim diagnosis.

## 5. History and entry detail

- Open History.
- Confirm entries are listed in the expected order.
- Open an entry detail screen.
- Confirm structured screening result card appears only when relevant.
- Confirm share/export wording remains user-controlled.

## 6. Handover summary

- Open the 7-day handover summary.
- Confirm summary content is generated from local entries.
- Confirm wording supports care conversations without claiming diagnosis or clinical monitoring.
- Share/export the summary if available.
- Confirm the user chooses where to share or save it.

## 7. Settings, reminders and data controls

- Open Settings.
- Confirm “On-device privacy” copy appears instead of “Local-only MVP”.
- Enable daily check-in reminder.
- Confirm permission prompt appears when required.
- Change reminder time.
- Confirm the new time is saved.
- Disable reminder.
- Export local logs.
- Clear local data.
- Confirm the app returns to the welcome screen.

## 8. Accessibility smoke test

- Turn on VoiceOver / TalkBack.
- Confirm the app logo has a meaningful label.
- Confirm login buttons have readable labels.
- Confirm the privacy note is read clearly.
- Confirm the dashboard greeting is announced as a heading.
- Confirm the daily reminder card and edit button are readable.
- Confirm bottom navigation items announce labels and selection state.
- Confirm tappable targets are comfortable on device.

## 9. Release commands

Run before creating a release build:

```bash
npm run typecheck
npm run lint
npm run test
npx expo start -c
```

Then run EAS build when ready:

```bash
eas build --platform ios --profile production
eas build --platform android --profile production
```

## 10. Stop-ship issues

Do not submit if any of these are present:

- App crashes during onboarding, check-in, Settings, or summary.
- User-facing copy says the app diagnoses, detects, prevents, treats or monitors delirium clinically.
- User-facing copy implies staff/emergency alerting.
- User-facing copy still says “MVP”.
- Reminder permissions cause a crash.
- Clearing local data leaves old profile/check-in data visible.
- Store screenshots show temporary wording or broken layout.
