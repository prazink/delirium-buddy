
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
export default function Root() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerTitle: "Delirium Buddy" }}>
        <Stack.Screen name="index" options={{ title: "Dashboard" }} />
        <Stack.Screen name="log" options={{ title: "New Log" }} />
        <Stack.Screen name="history" options={{ title: "History" }} />
        <Stack.Screen name="about" options={{ title: "About" }} />
      </Stack>
    </>
  );
}
