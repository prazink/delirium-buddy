
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LogEntry } from "../types";
const KEY = "delirium_buddy_logs_v1";
export async function loadLogs(): Promise<LogEntry[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}
export async function saveLogs(items: LogEntry[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(items));
}
