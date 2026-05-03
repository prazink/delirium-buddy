import AsyncStorage from '@react-native-async-storage/async-storage';

export type ReminderSettings = {
  enabled: boolean;
  hour: number;
  minute: number;
  notificationId?: string | undefined;
  updatedAt: string;
};

const REMINDER_KEY = 'delirium_buddy_reminder_settings_v1';

export const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  enabled: false,
  hour: 18,
  minute: 0,
  updatedAt: new Date(0).toISOString(),
};

export async function loadReminderSettings(): Promise<ReminderSettings> {
  const raw = await AsyncStorage.getItem(REMINDER_KEY);

  if (!raw) {
    return DEFAULT_REMINDER_SETTINGS;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ReminderSettings>;

    return {
      enabled: Boolean(parsed.enabled),
      hour: clampTimePart(parsed.hour, 18, 0, 23),
      minute: clampTimePart(parsed.minute, 0, 0, 59),
      notificationId: parsed.notificationId,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return DEFAULT_REMINDER_SETTINGS;
  }
}

export async function saveReminderSettings(settings: ReminderSettings): Promise<void> {
  await AsyncStorage.setItem(REMINDER_KEY, JSON.stringify(settings));
}

export async function clearReminderSettings(): Promise<void> {
  await AsyncStorage.removeItem(REMINDER_KEY);
}

function clampTimePart(value: unknown, fallback: number, min: number, max: number): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.max(min, Math.min(max, Math.trunc(value)))
    : fallback;
}
