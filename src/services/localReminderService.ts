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

export async function scheduleDailyReminder(settings: Pick<ReminderSettings, 'hour' | 'minute'>): Promise<string> {
  const granted = await requestReminderPermission();

  if (!granted) {
    throw new Error('Notification permission was not granted.');
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Delirium Buddy check-in',
      body: 'Add today’s care check-in when you have a moment.',
      sound: false,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: settings.hour,
      minute: settings.minute,
    },
  });
}

export async function cancelReminder(notificationId?: string): Promise<void> {
  if (notificationId) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }
}
