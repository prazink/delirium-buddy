import AsyncStorage from '@react-native-async-storage/async-storage';

import { PersonProfileSchema } from '../domain/logs/log.schema';
import type { PersonProfile } from '../domain/logs/log.types';

const PROFILE_KEY = 'delirium_buddy_person_profile_v1';

export async function loadPersonProfile(): Promise<PersonProfile | null> {
  const raw = await AsyncStorage.getItem(PROFILE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    const result = PersonProfileSchema.safeParse(parsed);

    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export async function savePersonProfile(profile: PersonProfile): Promise<void> {
  const validatedProfile = PersonProfileSchema.parse(profile);

  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(validatedProfile));
}

export async function clearPersonProfile(): Promise<void> {
  await AsyncStorage.removeItem(PROFILE_KEY);
}
