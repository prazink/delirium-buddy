import { router, SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';

import { ErrorBoundary } from '../src/lib/ErrorBoundary';
import { ThemeProvider } from '../src/theme/ThemeProvider';
import { loadUser } from '../src/storage/localUserRepository';

SplashScreen.preventAutoHideAsync();

export default function Root() {
  useEffect(() => {
    async function bootstrap() {
      const user = await loadUser();
      if (!user) {
        router.replace('/login');
      }
      await SplashScreen.hideAsync();
    }
    bootstrap();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerTitle: 'Delirium Buddy' }}>
          <Stack.Screen name="index" options={{ title: 'Dashboard' }} />
          <Stack.Screen name="profile" options={{ title: 'Person Profile' }} />
          <Stack.Screen name="summary" options={{ title: '7-day Summary' }} />
          <Stack.Screen name="settings" options={{ title: 'Settings' }} />
          <Stack.Screen name="log" options={{ title: 'New Log' }} />
          <Stack.Screen name="history" options={{ title: 'History' }} />
          <Stack.Screen name="entry" options={{ title: 'Entry' }} />
          <Stack.Screen name="about" options={{ title: 'About' }} />
          <Stack.Screen name="login" options={{ title: 'Login', headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
