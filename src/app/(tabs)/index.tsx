import { router } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { GoalCard } from '@/components/GoalCard';
import { formatMoney } from '@/lib/finance';
import { sampleGoals } from '@/lib/goals';
import { useGoals } from '@/state/GoalsContext';
import { colors, spacing } from '@/theme';

export default function GoalsScreen() {
  const { goals, ready, dispatch } = useGoals();
  const now = new Date();

  if (!ready) {
    return <ActivityIndicator style={styles.loading} color={colors.primary} />;
  }

  const totalSaved = goals.reduce((sum, g) => sum + g.saved, 0);
  const totalMonthly = goals.reduce((sum, g) => sum + g.monthly, 0);

  return (
    <View style={styles.screen}>
      <FlatList
        data={goals}
        keyExtractor={(g) => g.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          goals.length > 0 ? (
            <View style={styles.summary}>
              <Text style={styles.summaryValue}>{formatMoney(totalSaved)}</Text>
              <Text style={styles.summaryLabel}>
                saved across {goals.length} {goals.length === 1 ? 'goal' : 'goals'} · {formatMoney(totalMonthly)}/mo planned
              </Text>
            </View>
          ) : undefined
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Set your first goal</Text>
            <Text style={styles.emptyText}>
              An emergency fund, a trip, a first home. Add a target and a monthly amount to see whether you are on track.
            </Text>
            <Pressable
              onPress={() => dispatch({ type: 'loaded', goals: sampleGoals(now) })}
              accessibilityRole="button"
              testID="sample-goals"
              style={styles.sample}
            >
              <Text style={styles.sampleText}>Try two sample goals</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => <GoalCard goal={item} now={now} onPress={() => router.push(`/goal/${item.id}`)} />}
      />
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && { opacity: 0.85 }]}
        onPress={() => router.push('/goal/new')}
        accessibilityRole="button"
        accessibilityLabel="Add goal"
        testID="add-goal"
      >
        <Text style={styles.fabText}>+ Add goal</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  loading: { marginTop: 48 },
  list: { padding: spacing.lg, gap: spacing.md, paddingBottom: 96 },
  summary: { marginBottom: spacing.sm },
  summaryValue: { fontSize: 28, fontWeight: '700', color: colors.text },
  summaryLabel: { fontSize: 14, color: colors.muted },
  empty: { marginTop: 64, alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.xl },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: colors.text },
  emptyText: { fontSize: 15, color: colors.muted, textAlign: 'center', lineHeight: 21 },
  sample: { marginTop: spacing.sm, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
  sampleText: { color: colors.primary, fontSize: 15, fontWeight: '600' },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingHorizontal: spacing.xl,
    paddingVertical: 14,
    elevation: 3,
  },
  fabText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
