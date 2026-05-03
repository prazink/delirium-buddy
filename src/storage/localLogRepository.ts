import { logger } from '../lib/logger';
import { storage } from '../lib/storage';
import { LogEntrySchema } from '../lib/validators';
import type { LogEntry } from '../domain/logs/log.types';

const ARRAY_KEY = 'delirium_buddy_logs_v2';

export async function loadLogs(): Promise<LogEntry[]> {
  const items = await storage.getArray<LogEntry>(ARRAY_KEY);
  const validated: LogEntry[] = [];
  for (const item of items) {
    const result = LogEntrySchema.safeParse(item);
    if (result.success) {
      validated.push(result.data);
    } else {
      logger.error('Log entry schema validation failed', { id: item.id });
    }
  }
  return validated.sort((a, b) => a.date.localeCompare(b.date));
}

export async function saveLogs(items: LogEntry[]): Promise<void> {
  const validated = items.map((item) => LogEntrySchema.parse(item));
  await storage.setArray(ARRAY_KEY, validated);
}

export async function clearLogs(): Promise<void> {
  await storage.clearArray(ARRAY_KEY);
}
