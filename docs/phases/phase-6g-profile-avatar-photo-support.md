# Phase 6G - Profile Avatar Photo Support

## 1. Problem being solved

The dashboard person card had a fallback initials avatar, but there was no way to choose a real photo or a more human default avatar for the person being tracked.

This made the app feel less personal and less realistic for carer use.

This phase adds optional local photo support and gender-based default avatars while keeping the privacy promise clear:

```txt
photo chosen locally
  -> local URI saved in profile
  -> dashboard shows photo
  -> if no photo, gender-based default avatar is shown
```

## 2. Scope included

- Add `expo-image-picker` dependency.
- Add optional `avatarUri` to `PersonProfile`.
- Add optional `gender` to `PersonProfile`.
- Add validation for optional `avatarUri` and `gender`.
- Add Profile screen photo controls:
  - Choose photo
  - Change photo
  - Remove photo
- Add Profile screen default avatar selector:
  - Male
  - Female
  - Not specified
- Show a local-only privacy note near the photo controls.
- Render selected photo on the dashboard person card.
- Show a gender-based default avatar if no photo is selected.
- Keep safe fallback behaviour if image loading fails.

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
- clinical gender/sex logic

The gender field is only used to choose a friendly default avatar illustration.

## 4. Technical changes

### Dependency

```bash
npx expo install expo-image-picker
```

### Profile model

`PersonProfile` now supports:

```ts
avatarUri?: string | undefined;
gender?: PersonGender | undefined;
```

### Profile form

`app/profile.tsx` now uses `expo-image-picker` to request photo library permission and select a square photo.

The selected local URI is saved with the rest of the local profile.

The form also includes a default avatar selector. If no uploaded photo is saved, the shared `Avatar` component shows a male, female or neutral default avatar based on the selected option.

### Dashboard person card

`PatientCard` now passes `profile.avatarUri` and `profile.gender` into the shared `Avatar` component:

```tsx
<Avatar
  source={profile.avatarUri ?? null}
  size={64}
  fallback={initials}
  gender={profile.gender ?? 'not_specified'}
/>
```

## 5. Product value

This makes the app feel more human and easier to scan:

- carers can visually recognise who they are tracking
- the dashboard feels more personal
- users can still choose a friendly default avatar without uploading a photo
- the profile setup feels more complete
- the app better matches a polished mobile product experience

## 6. Safety/privacy notes

- The photo is optional.
- The photo URI is stored locally in the profile object.
- The app does not upload the photo anywhere.
- The UI states that the photo stays on this device.
- Removing the photo clears the saved URI and returns to the selected default avatar.
- The gender selector is only used for avatar fallback display.

## 7. Manual QA checklist

- Install dependencies:

```bash
npx expo install expo-image-picker
npm install
```

- Open Person Profile.
- Confirm Profile photo section appears.
- Confirm Default avatar selector appears.
- Select Male, Female and Not specified and confirm the preview changes.
- Tap Choose photo.
- Grant photo permission.
- Pick a photo.
- Confirm avatar preview updates to selected photo.
- Save profile.
- Return to dashboard.
- Confirm person card shows selected photo.
- Open Person Profile again.
- Tap Remove.
- Save profile.
- Confirm dashboard returns to selected default avatar.
- Run:

```bash
npm run typecheck
npm run lint
npm run test
```

## 8. Interview talking points

Use this explanation:

> I added optional local avatar photo support to make the carer profile feel more personal without compromising privacy. The app requests photo library access only when the user chooses a photo, stores only the local URI in the profile, and uses a gender-based default avatar when no photo is selected.

Strong technical angle:

> The avatar rendering was already isolated in a reusable Avatar component, so the change was mainly data-model and profile-form wiring. The dashboard card simply passes through `profile.avatarUri` and `profile.gender`, which keeps the UI components clean and reusable.
