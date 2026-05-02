import AsyncStorage from '@react-native-async-storage/async-storage';

import { UserSchema } from '../domain/logs/log.schema';
import type { User } from '../domain/logs/log.types';

const USER_KEY = 'delirium_buddy_user_v1';

export async function loadUser(): Promise<User | null> {
  const raw = await AsyncStorage.getItem(USER_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    const result = UserSchema.safeParse(parsed);

    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export async function saveUser(user: User): Promise<void> {
  const validatedUser = UserSchema.parse(user);

  await AsyncStorage.setItem(USER_KEY, JSON.stringify(validatedUser));
}

export async function clearUser(): Promise<void> {
  await AsyncStorage.removeItem(USER_KEY);
}
