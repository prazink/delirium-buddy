
import { Stack, SplashScreen, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { loadUser } from "./lib/storage";

// Keep the splash screen visible while we set up the root layout
SplashScreen.preventAutoHideAsync();
export default function Root() {
  useEffect(() => {
    (async () => {
      const user = await loadUser();
      if (!user) {
        router.replace("/login");
      }
      SplashScreen.hideAsync();
    })();
  }, []);
  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerTitle: "Delirium Buddy" }}>
        <Stack.Screen name="index" options={{ title: "Dashboard" }} />
        <Stack.Screen name="log" options={{ title: "New Log" }} />
        <Stack.Screen name="history" options={{ title: "History" }} />
        <Stack.Screen name="entry" options={{ title: "Entry" }} />
        <Stack.Screen name="about" options={{ title: "About" }} />
        <Stack.Screen name="login" options={{ title: "Login", headerShown: false }} />
      </Stack>
    </>
  );
}
