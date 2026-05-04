# Phase 6F - Carer Role, Relationship and Typography Polish

## 1. Problem being solved

The dashboard person card showed the person being tracked, but the carer badge mixed two different concepts:

```txt
You're the Primary carer
```

This was understandable for a simple MVP, but not clear enough for broader carer, aged-care or hospital-style workflows.

The app needs to separate:

- the user's care role
- the user's relationship to the person being tracked

Example:

```txt
Arthur
87 years old · Today, 11:38 am

Role: Primary carer
Relationship: Godson
```

## 2. Scope included

- Add optional `careRole` to `PersonProfile`.
- Add Zod validation for optional `careRole`.
- Add `Your care role` field to the profile screen.
- Keep existing `Your relationship` field.
- Show role and relationship separately on the dashboard person card.
- Provide a fallback role of `Primary carer` for existing profiles.
- Soften the patient card name and meta typography.

## 3. Scope intentionally excluded

This phase does not add:

- multiple carers
- staff accounts
- organisation roles
- permission levels
- role-based access control
- backend sync
- avatar/photo support

Avatar/photo support should be Phase 6G.

## 4. Technical changes

`PersonProfile` now supports:

```ts
careRole?: string | undefined;
```

`PersonProfileSchema` validates `careRole` as an optional trimmed string up to 120 characters.

`app/profile.tsx` now includes:

```txt
Your care role
Your relationship
```

`PatientCard` now renders:

```txt
Role: Primary carer
Relationship: Godson
```

## 5. Product value

This makes the app easier to understand because real care situations are not always simple.

Examples:

```txt
Role: Primary carer
Relationship: Godson
```

```txt
Role: Nurse
Relationship: Care staff
```

```txt
Role: Support worker
Relationship: Non-family support
```

## 6. Safety/privacy notes

No clinical logic changed.

No risk scoring changed.

No additional sensitive health data was added beyond a plain-text role field.

The app remains local-first.

## 7. Manual QA checklist

- Open Person Profile.
- Confirm `Your care role` appears.
- Enter `Primary carer`.
- Enter relationship such as `Godson`.
- Save profile.
- Return to dashboard.
- Confirm the person card shows:

```txt
Role: Primary carer
Relationship: Godson
```

- Open an existing profile without `careRole` and confirm it falls back to `Primary carer`.
- Run:

```bash
npm run typecheck
npm run lint
npm run test
```

## 8. Interview talking points

Use this explanation:

> I improved the person profile model by separating the user's care role from their relationship to the person being tracked. That avoids confusing labels like "You're the Primary carer" when the relationship might actually be godson, daughter, spouse, nurse or support worker. I kept the change backwards-compatible by making the new field optional and adding a sensible fallback.
