import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const storageKey = 'loopdev.active-organization-id';

export async function loadActiveOrganizationId(): Promise<string | null> {
  if (Platform.OS === 'web') return globalThis.localStorage?.getItem(storageKey) ?? null;
  return SecureStore.getItemAsync(storageKey);
}

export async function saveActiveOrganizationId(organizationId: string): Promise<void> {
  if (Platform.OS === 'web') {
    globalThis.localStorage?.setItem(storageKey, organizationId);
    return;
  }
  await SecureStore.setItemAsync(storageKey, organizationId);
}

export async function clearActiveOrganizationId(): Promise<void> {
  if (Platform.OS === 'web') {
    globalThis.localStorage?.removeItem(storageKey);
    return;
  }
  await SecureStore.deleteItemAsync(storageKey);
}