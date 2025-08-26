
import { ExpoConfig } from "expo-config";

const config: ExpoConfig = {
  name: "Delirium Buddy",
  slug: "delirium-buddy",
  scheme: "deliriumbuddy",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.pk.deliriumbuddy",
    infoPlist: {
      NSFaceIDUsageDescription: "Used to secure your notes if you enable device security.",
      NSPrivacyAccessedAPITypes: []
    }
  },
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  plugins: ["expo-router"],
  extra: {
    eas: { projectId: "REPLACE_WITH_EAS_PROJECT_ID" }
  }
};
export default config;
