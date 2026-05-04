import * as Notifications from 'expo-notifications';

import type { ReminderSettings } from '../storage/localReminderRepository';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestReminderPermission(): Promise<boolean> {
  const existing = await Notifications.getPermissionsAsync();

  if (existing.granted) {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync();

  return requested.granted;
}

export async function scheduleDailyCheckInReminder(
  settings: Pick<ReminderSettings, 'hour' | 'minute'>,
): Promise<string> {
  const granted = await requestReminderPermission();

  if (!granted) {
    throw new Error('Notification permission was not granted.');
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Delirium Buddy check-in',
      body: 'Personal reminder: add today’s care check-in when you have a moment.',
      sound: false,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: settings.hour,
      minute: settings.minute,
    },
  });
}

export async function cancelDailyCheckInReminder(notificationId?: string): Promise<void> {
  if (notificationId) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }
}

export async function rescheduleDailyCheckInReminder(
  settings: Pick<ReminderSettings, 'hour' | 'minute' | 'notificationId'>,
): Promise<string> {
  await cancelDailyCheckInReminder(settings.notificationId);
  return scheduleDailyCheckInReminder(settings);
}

export async function scheduleRepeatCheckReminder(delayMinutes = 120): Promise<string> {
  const granted = await requestReminderPermission();

  if (!granted) {
    throw new Error('Notification permission was not granted.');
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Delirium Buddy repeat check',
      body: 'Personal prompt: consider another observation and care conversation note. This is not a medical alert.',
      sound: false,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: Math.max(60, delayMinutes * 60),
      repeats: false,
    },
  });
}

// Backwards-compatible names used by earlier phases.
export const scheduleDailyReminder = scheduleDailyCheckInReminder;
export const cancelReminder = cancelDailyCheckInReminder;
