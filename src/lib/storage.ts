/**
 * Typed SecureStore wrapper. All patient/user data MUST go through this module.
 * NEVER call expo-secure-store or AsyncStorage directly in the rest of the app.
 *
 * iOS Keychain note: SecureStore keys must not contain ':' — use '__' as separator.
 * Values are capped at ~2 KB per key; arrays are stored per-item to stay under the cap.
 */
import * as SecureStore from 'expo-secure-store';

import { logger } from './logger';

async function getItem(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    // Expected on first run (key doesn't exist yet) or simulator keychain quirks.
    logger.debug('SecureStore read miss', key);
    return null;
  }
}

async function setItem(key: string, value: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch {
    logger.error('SecureStore write failed', { key });
    throw new Error(`Failed to persist data for key: ${key}`);
  }
}

async function removeItem(key: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    logger.debug('SecureStore delete miss', key);
  }
}

/** Store a typed value as JSON. */
async function setJson<T>(key: string, value: T): Promise<void> {
  await setItem(key, JSON.stringify(value));
}

/** Read a typed JSON value, returning null if missing or parse fails. */
async function getJson<T>(key: string): Promise<T | null> {
  const raw = await getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    logger.error('SecureStore JSON parse failed', { key });
    return null;
  }
}

// ─── Array helpers (per-item storage to stay under 2 KB/key) ─────────────────
// Use '__' as separator — iOS Keychain rejects ':' in key strings.

async function getArrayIndex(key: string): Promise<string[]> {
  return (await getJson<string[]>(`${key}__index`)) ?? [];
}

async function setArrayIndex(key: string, ids: string[]): Promise<void> {
  await setJson(`${key}__index`, ids);
}

/** Append or replace an item in a keyed array (matched by item.id). */
async function upsertArrayItem<T extends { id: string }>(
  key: string,
  item: T,
): Promise<void> {
  const ids = await getArrayIndex(key);
  if (!ids.includes(item.id)) {
    await setArrayIndex(key, [...ids, item.id]);
  }
  await setJson(`${key}__${item.id}`, item);
}

/** Overwrite entire keyed array, replacing previous index + items. */
async function setArray<T extends { id: string }>(
  key: string,
  items: T[],
): Promise<void> {
  const existingIds = await getArrayIndex(key);
  const newIds = items.map((i) => i.id);
  const staleIds = existingIds.filter((id) => !newIds.includes(id));
  await Promise.all(staleIds.map((id) => removeItem(`${key}__${id}`)));
  await Promise.all(items.map((item) => setJson(`${key}__${item.id}`, item)));
  await setArrayIndex(key, newIds);
}

/** Read all items in a keyed array. Missing items are silently skipped. */
async function getArray<T extends { id: string }>(key: string): Promise<T[]> {
  const ids = await getArrayIndex(key);
  const results = await Promise.all(ids.map((id) => getJson<T>(`${key}__${id}`)));
  const found: T[] = [];
  for (const item of results) {
    if (item !== null) found.push(item);
  }
  return found;
}

/** Remove all items in a keyed array including the index. */
async function clearArray(key: string): Promise<void> {
  const ids = await getArrayIndex(key);
  await Promise.all(ids.map((id) => removeItem(`${key}__${id}`)));
  await removeItem(`${key}__index`);
}

export const storage = {
  getItem,
  setItem,
  removeItem,
  getJson,
  setJson,
  upsertArrayItem,
  setArray,
  getArray,
  clearArray,
};
