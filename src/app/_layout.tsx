import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { GoalsProvider } from '@/state/GoalsContext';
import { colors } from '@/theme';

export default function RootLayout() {
  return (
    <GoalsProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="goal/new" options={{ title: 'New goal', presentation: 'modal' }} />
        <Stack.Screen name="goal/[id]" options={{ title: 'Goal' }} />
      </Stack>
    </GoalsProvider>
  );
}
