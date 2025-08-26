
# Delirium Buddy (Expo / iOS)

A simple, private companion app to track daily delirium signals and show an explainable risk indicator.

## Run locally
```bash
npm install
npm run ios
```

## Build & submit
```bash
eas login
eas init
eas build -p ios
eas submit -p ios --latest
```

## Notes
- On-device storage only (AsyncStorage).
- No medical advice is provided.
- Update `bundleIdentifier` in `app.config.ts`.
