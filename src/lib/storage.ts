import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Goal } from './goals';

const KEY = 'goalpost/goals/v1';

/** Reads saved goals; corrupt or missing data falls back to an empty list instead of crashing. */
export async function loadGoals(): Promise<Goal[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Goal[]) : [];
  } catch {
    return [];
  }
}

export async function saveGoals(goals: Goal[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(goals));
}
