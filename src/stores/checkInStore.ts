import { create } from 'zustand';

import type { LogEntry } from '../domain/logs/log.types';
import { logger } from '../lib/logger';
import {
  clearLogs,
  loadLogs,
  saveLogs,
} from '../storage/localLogRepository';

interface CheckInState {
  logs: LogEntry[];
  isLoaded: boolean;
  loadLogs: () => Promise<void>;
  addLog: (log: LogEntry) => Promise<void>;
  removeLog: (id: string) => Promise<void>;
  clearLogs: () => Promise<void>;
}

/**
 * Zustand store for all check-in log entries.
 * Persists per-entry via SecureStore via localLogRepository.
 * @example const logs = useCheckInStore(s => s.logs);
 */
export const useCheckInStore = create<CheckInState>((set, get) => ({
  logs: [],
  isLoaded: false,

  loadLogs: async () => {
    try {
      const logs = await loadLogs();
      set({ logs, isLoaded: true });
    } catch {
      logger.error('checkInStore: loadLogs failed');
      set({ isLoaded: true });
    }
  },

  addLog: async (log) => {
    try {
      const updated = [...get().logs.filter((l) => l.id !== log.id), log].sort(
        (a, b) => a.date.localeCompare(b.date),
      );
      await saveLogs(updated);
      set({ logs: updated });
    } catch {
      logger.error('checkInStore: addLog failed');
      throw new Error('Could not save check-in');
    }
  },

  removeLog: async (id) => {
    try {
      const updated = get().logs.filter((l) => l.id !== id);
      await saveLogs(updated);
      set({ logs: updated });
    } catch {
      logger.error('checkInStore: removeLog failed');
    }
  },

  clearLogs: async () => {
    try {
      await clearLogs();
      set({ logs: [] });
    } catch {
      logger.error('checkInStore: clearLogs failed');
    }
  },
}));
