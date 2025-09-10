
import { ExpoConfig } from "@expo/config-types";

const config: ExpoConfig = {
  name: "Delirium Buddy",
  slug: "delirium-buddy",
  scheme: "deliriumbuddy",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/splash.png",
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
    resizeMode: "cover",
    backgroundColor: "#ffffff",
  },
  
  plugins: ["expo-router"],
};
export default config;
