# Delirium Buddy

A local-first, private companion app for carers tracking daily delirium symptoms in elderly patients.

## Setup

```bash
npm install
npm start          # Expo Go / Metro
npm run ios        # iOS Simulator
npm run android    # Android Emulator
npm run typecheck  # TypeScript strict check
npm run test       # Vitest unit tests
```

**Node requirement:** Node ≥ 18 recommended. Node 16 can run the app itself but `npx expo install` (requires undici) will fail — use `npm install <pkg@version>` directly instead.

## Architecture

```
app/                    expo-router screens (root — required by Expo)
mocks/                  Seed data for running without a backend
src/
  theme/
    tokens.ts           All design tokens (palette, spacing, radii, typography, shadows)
    ThemeProvider.tsx   Context + light/dark switch via useColorScheme()
    useTheme.ts         Re-export for convenience
  lib/
    logger.ts           PII-safe logger — strips context in non-dev builds
    storage.ts          SecureStore wrapper with per-item array storage
    validators.ts       Re-exports all Zod schemas (single import point)
    ErrorBoundary.tsx   Top-level class boundary — no PII in fallback UI
  stores/
    patientStore.ts     Zustand store — profile state + SecureStore persistence
    checkInStore.ts     Zustand store — logs state + SecureStore persistence
  hooks/
    usePatient.ts       Load-on-mount hook for patient profile
    useCheckIns.ts      Load-on-mount hook for check-in logs
  components/
    ui/                 Primitives: Card, Button, Chip, Avatar, AppText, Icon
    dashboard/          Feature components: AppHeader, CheckInCTA, PatientCard,
                        RiskSummary, InsightsGrid, DashboardTrendChart,
                        QuickActions, PrivacyFooter
    (legacy)            BaselineInsightsCard, OnboardingStepCard, RiskCard,
                        TrendChart — used by non-dashboard screens
  domain/               Pure business logic (risk calc, baseline compare, export)
  storage/              Repositories — now backed by SecureStore via lib/storage
  utils/
```

## Security Notes

| Requirement | Implementation |
|---|---|
| No PII in logs | `logger.ts` strips all context args in production builds |
| No AsyncStorage for patient data | `localLogRepository` and `localProfileRepository` migrated to SecureStore via `lib/storage.ts` |
| SecureStore 2 KB limit | Logs stored per-entry (`logs_v2:${id}`) with an index key; each value stays well under cap |
| No network calls for patient data | Zero HTTP calls touch logs or profile — on-device only |
| No PII in crash UI | `ErrorBoundary` renders a static string; stack traces only in dev |
| Input sanitisation | Zod validates all data at read-from-storage and write-to-storage boundaries |

## Decisions to Revisit

| Decision | Default chosen | Alternative |
|---|---|---|
| **Font** | System font (`-apple-system` / `Roboto`) | Add `@expo-google-fonts/inter` for exact Inter match |
| **Gradient button** | Solid `#5d7cee` (midpoint of CSS gradient) | Add `expo-linear-gradient` for exact gradient parity |
| **Dark mode** | Logical inverse palette (no dark mockup provided) | Design a proper dark mockup |
| **Card shadow** | Single-layer RN shadow approximating the 2-layer CSS card shadow | Use `react-native-shadow-2` for exact 2-layer parity |
| **Insight tiles** | Falls back to static mock tiles when no baseline data | Derive dynamically from `compareToBaseline` output |
| **`victory-native`** | Still in `package.json`; new dashboard uses raw SVG | Remove once all screens migrate to `DashboardTrendChart` |
| **Reanimated usage** | Installed and babel-configured; not yet used in animations | Wire `Animated` to `CheckInCTA` press spring, chart mount |

## Tech Stack

- **Expo SDK 54** + TypeScript strict + `exactOptionalPropertyTypes`
- **expo-router** — file-based navigation
- **react-native-reanimated 4** — installed, babel plugin wired (`babel.config.js`)
- **react-native-svg** — all SVG icons and the 7-day trend chart
- **Zustand 5** — patient + check-in stores with SecureStore persistence
- **expo-secure-store** — all PII stored encrypted (iOS Keychain / Android EncryptedSharedPreferences)
- **@tanstack/react-query** — installed, ready for future API calls
- **Zod** — runtime validation at all storage boundaries
