import AsyncStorage from '@react-native-async-storage/async-storage';

import { LogEntriesSchema } from '../domain/logs/log.schema';
import type { LogEntry } from '../domain/logs/log.types';

const LOGS_KEY = 'delirium_buddy_logs_v1';

export async function loadLogs(): Promise<LogEntry[]> {
  const raw = await AsyncStorage.getItem(LOGS_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    const result = LogEntriesSchema.safeParse(parsed);

    if (!result.success) {
      return [];
    }

    return [...result.data].sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return [];
  }
}

export async function saveLogs(items: LogEntry[]): Promise<void> {
  const validatedItems = LogEntriesSchema.parse(items);
  const sortedItems = [...validatedItems].sort((a, b) => a.date.localeCompare(b.date));

  await AsyncStorage.setItem(LOGS_KEY, JSON.stringify(sortedItems));
}
