# Phase 6G - Profile Avatar Photo Support

## 1. Problem being solved

The dashboard person card had a fallback initials avatar, but there was no way to choose a real photo for the person being tracked.

This made the app feel less personal and less realistic for carer use.

This phase adds optional local photo support while keeping the privacy promise clear:

```txt
photo chosen locally
  -> local URI saved in profile
  -> dashboard shows photo
  -> fallback initials remain if no photo is selected
```

## 2. Scope included

- Add `expo-image-picker` dependency.
- Add optional `avatarUri` to `PersonProfile`.
- Add validation for optional `avatarUri`.
- Add Profile screen photo controls:
  - Choose photo
  - Change photo
  - Remove photo
- Show a local-only privacy note near the photo controls.
- Render selected photo on the dashboard person card.
- Keep initials fallback if no photo is selected or image loading fails.

## 3. Scope intentionally excluded

This phase does not add:

- camera capture
- image upload to a server
- cloud sync
- image compression pipeline beyond picker quality setting
- photo storage migration/copying into app documents directory
- multiple avatars
- carer avatar
- staff avatar

Those are later product decisions.

## 4. Technical changes

### Dependency

```bash
npx expo install expo-image-picker
```

### Profile model

`PersonProfile` now supports:

```ts
avatarUri?: string | undefined;
```

### Profile form

`app/profile.tsx` now uses `expo-image-picker` to request photo library permission and select a square photo.

The selected local URI is saved with the rest of the local profile.

### Dashboard person card

`PatientCard` now passes `profile.avatarUri` into the shared `Avatar` component:

```tsx
<Avatar source={profile.avatarUri ?? null} size={64} fallback={initials} />
```

The existing `Avatar` component already supports image rendering and fallback initials.

## 5. Product value

This makes the app feel more human and easier to scan:

- carers can visually recognise who they are tracking
- the dashboard feels more personal
- the profile setup feels more complete
- the app better matches a polished mobile product experience

## 6. Safety/privacy notes

- The photo is optional.
- The photo URI is stored locally in the profile object.
- The app does not upload the photo anywhere.
- The UI states that the photo stays on this device.
- Removing the photo clears the saved URI and returns to initials fallback.

## 7. Manual QA checklist

- Install dependencies:

```bash
npx expo install expo-image-picker
npm install
```

- Open Person Profile.
- Confirm Profile photo section appears.
- Tap Choose photo.
- Grant photo permission.
- Pick a photo.
- Confirm avatar preview updates.
- Save profile.
- Return to dashboard.
- Confirm person card shows selected photo.
- Open Person Profile again.
- Tap Remove.
- Save profile.
- Confirm dashboard returns to initials fallback.
- Run:

```bash
npm run typecheck
npm run lint
npm run test
```

## 8. Interview talking points

Use this explanation:

> I added optional local avatar photo support to make the carer profile feel more personal without compromising privacy. The app requests photo library access only when the user chooses a photo, stores only the local URI in the profile, and keeps a clean initials fallback when no image exists or the image fails to load.

Strong technical angle:

> The avatar rendering was already isolated in a reusable Avatar component, so the change was mainly data-model and profile-form wiring. The dashboard card simply passes through `profile.avatarUri`, which keeps the UI components clean and reusable.
