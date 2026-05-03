# Delirium Buddy MVP Explainer

## 1. What is Delirium Buddy?

Delirium Buddy is a local-first mobile app that helps carers, family members, and patients record daily changes that may be useful in care conversations.

The app focuses on structured observation, not diagnosis.

It helps users track things like:

- confusion
- agitation
- sleep
- sudden change from usual behaviour
- fever or infection
- medication changes
- hallucination
- falls or near falls
- hydration, eating, pain, and mobility concerns
- notes that may be useful for a GP, nurse, hospital, or aged-care conversation

The current MVP stores data on the device only. It does not sync to a backend, does not use AI, and does not send information to a clinic or hospital.

## 2. Who is this app for?

The current MVP is mainly for:

### Family carers

People caring for a parent, grandparent, partner, or loved one who may have changing behaviour, confusion, poor sleep, infection, medication changes, or other concerning symptoms.

### Patients or older adults with support

A patient or older adult may use it directly, or with help from a family member, to keep a simple record of daily changes.

### Informal care supporters

Friends, family, or support people who are trying to communicate clearly with medical or care staff.

### Future professional users

In later phases, the app could support clinic staff, aged-care teams, hospital discharge teams, or community care providers. That is not part of the current MVP yet.

## 3. What problem does it solve?

Carers often notice changes before or between medical appointments, but it can be hard to remember details clearly when speaking to care staff.

Common problems include:

- not remembering when a change started
- forgetting sleep patterns or behaviour changes
- not knowing what to mention to care staff
- trying to explain concerns without structured notes
- having scattered notes across paper, texts, or memory

Delirium Buddy helps by turning daily observations into a structured record and a simple 7-day summary.

## 4. What does the MVP do today?

### 4.1 Local user setup

The app lets the user create a local user profile so they can start using the app on the device.

### 4.2 Person Profile / baseline

The user can create a profile for the person being tracked.

The profile captures:

- name or nickname
- relationship
- age range
- normal sleep range
- normal confusion baseline
- normal mobility
- existing memory issues
- recent surgery
- recent infection

This gives the app baseline context.

### 4.3 Add Check-in

The user can add a daily check-in with:

- date
- agitation score
- confusion score
- sleep hours
- medication change
- fever or infection
- sudden change from usual
- hallucination
- fall or near fall
- hydration concern
- eating concern
- pain concern
- mobility concern
- urine infection concern
- glasses or hearing aids missing
- notes

### 4.4 Dashboard

The dashboard shows:

- a clear Add Check-in action
- the person profile summary
- a risk-style support card
- baseline insights
- 7-day trend chart
- quick actions for profile, history, summary, settings, and about

### 4.5 Baseline insights

The app compares the latest check-in against the saved baseline.

Examples:

- sleep below usual range
- confusion higher than baseline
- sudden change noted
- fever or infection noted
- fall or near fall noted
- hallucination noted

These insights are framed as personal tracking support only.

### 4.6 History

The user can review previous check-ins.

History cards show:

- date
- agitation
- confusion
- sleep
- observation chips
- notes preview

### 4.7 Entry Detail

The user can open a saved check-in and review:

- risk-style support card
- baseline insights for that entry
- core measures
- observation chips
- notes

### 4.8 7-day Summary

The app creates a shareable 7-day summary with:

- total check-ins
- highest concern day
- medication change days
- fever or infection days
- red flags noted
- shareable text

This can help the user communicate clearly with care staff.

### 4.9 Settings and local data controls

The Settings screen explains:

- the app is currently local-only
- the app does not sync to a server
- the app does not use AI
- the app does not send entries to a clinic or hospital
- the app does not diagnose, predict, prevent, or treat delirium

The user can clear all local data from the device.

## 5. What does the MVP not do?

The current MVP does not:

- diagnose delirium
- predict delirium
- prevent delirium
- treat delirium
- replace medical assessment
- sync data to a backend
- support clinic or hospital accounts
- support tenant-based organisations
- support role-based access control
- use AI
- send alerts to care staff
- provide emergency advice

This is deliberate. The product is currently positioned as local personal tracking and care conversation support only.

## 6. Why local-first?

The MVP is local-first to reduce privacy, security, and regulatory complexity while proving the core product workflow.

Local-first means:

- faster MVP validation
- no backend cost yet
- no cloud storage risk yet
- easier testing
- simpler privacy explanation
- better control over scope

Before moving to cloud sync, the app should prove that carers find the tracking and summary workflow useful.

## 7. Safety positioning

Safe wording:

- personal tracking
- care conversation support
- baseline insights
- red flags noted
- shareable summary
- support card
- observations

Avoided wording:

- diagnosis
- prediction
- medical detection
- treatment plan
- prevention
- clinical decision support
- automated medical assessment

## 8. Why this app can be useful

Delirium Buddy is useful because it helps carers move from vague concerns to structured information.

Instead of saying:

> Something has been off lately.

The user can say:

> Over the last 7 days, sleep dropped below the usual range, confusion was higher than baseline, and sudden change was noted. There were also fever/infection concerns and medication changes.

That kind of structured summary can make care conversations clearer.

## 9. Current MVP user journey

```txt
Open app
  → Create local user
  → Add person profile / baseline
  → Add daily check-in
  → Review dashboard insights
  → Open history
  → Review entry detail
  → Open 7-day summary
  → Share summary if useful
  → Manage local data in settings
```

## 10. Technical summary

Current stack:

- Expo SDK 54
- React Native
- Expo Router
- TypeScript strict mode
- AsyncStorage
- Zod validation
- Victory Native charts
- Vitest tests
- ESLint
- Prettier

Current architecture:

```txt
app/              route screens
src/components/   reusable UI components
src/domain/       business/domain logic
src/storage/      local repositories
src/utils/        shared helpers
docs/             product and phase documentation
```

## 11. Interview explanation

Short version:

> Delirium Buddy is a local-first React Native app that helps carers record daily behaviour and health-related changes, compare them with a baseline, and generate a shareable 7-day summary for care conversations. I built it with Expo, TypeScript, Zod validation, local repositories, domain-based logic, and tested risk scoring. I intentionally kept the MVP local-only and avoided diagnosis claims to keep the product safe and privacy-conscious.

## 12. Resume-ready achievement bullets

- Built a local-first React Native / Expo health-support MVP for structured carer check-ins and shareable 7-day summaries.
- Designed person baseline, daily check-in, history, entry detail, dashboard insight, and local data control workflows.
- Refactored the app into route, component, domain, storage, and utility layers using strict TypeScript.
- Added Zod validation for persisted local data and Vitest coverage for explainable risk scoring logic.
- Implemented privacy-conscious local-only storage and clear medical safety wording to avoid diagnostic overclaims.

## 13. Recommended next step

The next product step should be Phase 3D: onboarding polish.

The goal is to make the first-run experience smoother:

```txt
Create local user
  → Add person profile
  → Add first check-in
  → View dashboard insights
```

This will make the app easier to demo and easier for a first-time user to understand.
