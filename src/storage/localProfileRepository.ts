import { logger } from '../lib/logger';
import { storage } from '../lib/storage';
import { PersonProfileSchema } from '../lib/validators';
import type { PersonProfile } from '../domain/logs/log.types';

const KEY = 'delirium_buddy_person_profile_v1';

export async function loadPersonProfile(): Promise<PersonProfile | null> {
  const raw = await storage.getJson<unknown>(KEY);
  if (!raw) return null;
  const result = PersonProfileSchema.safeParse(raw);
  if (!result.success) {
    logger.error('Profile schema validation failed');
    return null;
  }
  return result.data;
}

export async function savePersonProfile(profile: PersonProfile): Promise<void> {
  const validated = PersonProfileSchema.parse(profile);
  await storage.setJson(KEY, validated);
}

export async function clearPersonProfile(): Promise<void> {
  await storage.removeItem(KEY);
}
