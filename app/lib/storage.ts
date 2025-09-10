
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LogEntry, User } from "../types";

const LOGS_KEY = "delirium_buddy_logs_v1";
const USER_KEY = "delirium_buddy_user_v1";

export async function loadLogs(): Promise<LogEntry[]> {
  const raw = await AsyncStorage.getItem(LOGS_KEY);
  return raw ? JSON.parse(raw) : [];
}
export async function saveLogs(items: LogEntry[]) {
  await AsyncStorage.setItem(LOGS_KEY, JSON.stringify(items));
}

export async function loadUser(): Promise<User | null> {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}
export async function saveUser(user: User): Promise<void> {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}
export async function clearUser(): Promise<void> {
  await AsyncStorage.removeItem(USER_KEY);
}
