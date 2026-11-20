import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Field } from '@/components/Field';
import { ProgressBar } from '@/components/ProgressBar';
import { ProjectionChart } from '@/components/ProjectionChart';
import { formatMoney, monthsUntil, outlook, projectionSeries, RISK_LABELS } from '@/lib/finance';
import { useGoals } from '@/state/GoalsContext';
import { colors, spacing } from '@/theme';

export default function GoalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { goals, dispatch } = useGoals();
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState<string>();

  const goal = goals.find((g) => g.id === id);
  if (!goal) {
    return <Text style={styles.missing}>This goal no longer exists.</Text>;
  }

  const months = monthsUntil(goal.targetMonth, new Date());
  const view = outlook(goal.target, goal.saved, goal.monthly, goal.risk, months);
  const points = projectionSeries(goal.saved, goal.monthly, goal.risk, months);

  const contribute = () => {
    const value = Number(amount.replace(/[$,\s]/g, ''));
    if (!Number.isFinite(value) || value <= 0) {
      setAmountError('Enter an amount above $0.');
      return;
    }
    dispatch({ type: 'contribute', id: goal.id, amount: value });
    setAmount('');
    setAmountError(undefined);
  };

  const remove = () => {
    const doRemove = () => {
      dispatch({ type: 'remove', id: goal.id });
      router.back();
    };
    // Alert buttons are not supported on web, so fall back to the browser's confirm dialog there.
    if (Platform.OS === 'web') {
      if (globalThis.confirm?.(`Delete “${goal.name}”?`)) doRemove();
      return;
    }
    Alert.alert('Delete goal?', `“${goal.name}” and its progress will be removed.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: doRemove },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: goal.name }} />

      <View style={styles.card}>
        <Text style={styles.big} testID="saved-amount">{formatMoney(goal.saved)}</Text>
        <Text style={styles.muted}>
          of {formatMoney(goal.target)} by {goal.targetMonth} · {months} months left
        </Text>
        <ProgressBar fraction={goal.saved / goal.target} />
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Projection · {RISK_LABELS[goal.risk]} mix</Text>
        <ProjectionChart points={points} target={goal.target} />
        <View style={[styles.callout, view.onTrack ? styles.calloutGood : styles.calloutWarn]}>
          <Text style={styles.calloutText}>
            {view.onTrack
              ? `At ${formatMoney(goal.monthly)}/mo you are on track: expected ${formatMoney(view.projected.expected)}.`
              : `At ${formatMoney(goal.monthly)}/mo you would reach about ${formatMoney(view.projected.expected)}. Adding ${formatMoney(view.extraMonthly)}/mo closes the gap in the expected case.`}
          </Text>
        </View>
        <Stat label="Weak market" value={view.projected.low} />
        <Stat label="Expected" value={view.projected.expected} />
        <Stat label="Strong market" value={view.projected.high} />
        <Stat label="Your contributions" value={view.contributed} />
        <Stat label="Expected growth" value={view.growth} />
      </View>

      <View style={styles.card}>
        <Field
          label="Record a contribution ($)"
          testID="contribution-amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="e.g. 100"
          error={amountError}
        />
        <Pressable style={({ pressed }) => [styles.primary, pressed && { opacity: 0.85 }]} onPress={contribute} accessibilityRole="button" testID="add-contribution">
          <Text style={styles.primaryText}>Add to saved</Text>
        </Pressable>
      </View>

      <Pressable onPress={remove} style={styles.delete} accessibilityRole="button" testID="delete-goal">
        <Text style={styles.deleteText}>Delete goal</Text>
      </Pressable>
      <Text style={styles.disclaimer}>Illustrative return ranges, not forecasts or advice.</Text>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.muted}>{label}</Text>
      <Text style={styles.statValue}>{formatMoney(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { padding: spacing.lg, gap: spacing.md },
  missing: { padding: spacing.xl, color: colors.muted, textAlign: 'center' },
  card: { backgroundColor: colors.card, borderRadius: 12, padding: spacing.lg, gap: spacing.sm, borderWidth: 1, borderColor: colors.border },
  big: { fontSize: 30, fontWeight: '700', color: colors.text },
  heading: { fontSize: 16, fontWeight: '600', color: colors.text },
  muted: { fontSize: 14, color: colors.muted },
  callout: { borderRadius: 8, padding: spacing.md },
  calloutGood: { backgroundColor: colors.primarySoft },
  calloutWarn: { backgroundColor: colors.warningSoft },
  calloutText: { fontSize: 14, color: colors.text, lineHeight: 20 },
  stat: { flexDirection: 'row', justifyContent: 'space-between' },
  statValue: { fontSize: 14, fontWeight: '600', color: colors.text },
  primary: { backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  primaryText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  delete: { alignItems: 'center', paddingVertical: spacing.md },
  deleteText: { color: colors.danger, fontSize: 15 },
  disclaimer: { fontSize: 12, color: colors.muted, textAlign: 'center' },
});
