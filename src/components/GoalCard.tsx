import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatMoney, monthsUntil, outlook } from '@/lib/finance';
import type { Goal } from '@/lib/goals';
import { colors, spacing } from '@/theme';
import { ProgressBar } from './ProgressBar';

type Props = { goal: Goal; now: Date; onPress: () => void };

export function GoalCard({ goal, now, onPress }: Props) {
  const months = monthsUntil(goal.targetMonth, now);
  const view = outlook(goal.target, goal.saved, goal.monthly, goal.risk, months);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${goal.name}, ${formatMoney(goal.saved)} of ${formatMoney(goal.target)}`}
    >
      <View style={styles.row}>
        <Text style={styles.name}>{goal.name}</Text>
        <Text style={[styles.badge, view.onTrack ? styles.onTrack : styles.behind]}>
          {view.onTrack ? 'On track' : 'Behind'}
        </Text>
      </View>
      <Text style={styles.amounts}>
        {formatMoney(goal.saved)} <Text style={styles.muted}>of {formatMoney(goal.target)}</Text>
      </Text>
      <ProgressBar fraction={goal.saved / goal.target} />
      <Text style={styles.muted}>
        {view.onTrack
          ? `Projected ${formatMoney(view.projected.expected)} by ${goal.targetMonth}`
          : `Add ${formatMoney(view.extraMonthly)}/mo to reach it by ${goal.targetMonth}`}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.7 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 17, fontWeight: '600', color: colors.text, flexShrink: 1 },
  amounts: { fontSize: 15, color: colors.text },
  muted: { color: colors.muted, fontSize: 13 },
  badge: { fontSize: 12, fontWeight: '600', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, overflow: 'hidden' },
  onTrack: { color: colors.primary, backgroundColor: colors.primarySoft },
  behind: { color: colors.warning, backgroundColor: colors.warningSoft },
});
