import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Delirium Buddy',
  slug: 'delirium-buddy',
  scheme: 'deliriumbuddy',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/splash.png',
  userInterfaceStyle: 'light',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.pk.deliriumbuddy',
    infoPlist: {
      NSFaceIDUsageDescription: 'Used to secure your notes if you enable device security.',
      NSPrivacyAccessedAPITypes: [],
    },
  },
  android: {
    package: 'com.pk.deliriumbuddy',
  },
  splash: {
    image: './assets/splash.png',
    resizeMode: 'cover',
    backgroundColor: '#ffffff',
  },
  plugins: ['expo-router'],
  extra: {
    eas: {
      projectId: '7bd43f13-eeee-42e8-b072-26b688fb20fd',
    },
  },
};

export default config;
