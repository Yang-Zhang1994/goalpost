import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Field } from '@/components/Field';
import { RISK_LABELS, type RiskProfile } from '@/lib/finance';
import { validateGoal, type FormErrors, type GoalForm } from '@/lib/goals';
import { useGoals } from '@/state/GoalsContext';
import { colors, spacing } from '@/theme';

const RISKS: RiskProfile[] = ['conservative', 'balanced', 'growth'];

export default function NewGoalScreen() {
  const { dispatch } = useGoals();
  const [form, setForm] = useState<GoalForm>({ name: '', target: '', saved: '', monthly: '', targetMonth: '', risk: 'balanced' });
  const [errors, setErrors] = useState<FormErrors>({});

  const set = (key: keyof GoalForm) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  const save = () => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const result = validateGoal(form, new Date(), id);
    setErrors(result.errors);
    if (result.goal) {
      dispatch({ type: 'add', goal: result.goal });
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        <Field label="Goal name" value={form.name} onChangeText={set('name')} placeholder="e.g. Emergency fund" error={errors.name} />
        <Field label="Target amount ($)" value={form.target} onChangeText={set('target')} keyboardType="numeric" placeholder="e.g. 5000" error={errors.target} />
        <Field label="Saved so far ($)" value={form.saved} onChangeText={set('saved')} keyboardType="numeric" placeholder="0" error={errors.saved} />
        <Field label="Monthly contribution ($)" value={form.monthly} onChangeText={set('monthly')} keyboardType="numeric" placeholder="e.g. 200" error={errors.monthly} />
        <Field
          label="Target month"
          value={form.targetMonth}
          onChangeText={set('targetMonth')}
          placeholder="e.g. 2028-06"
          autoCapitalize="none"
          error={errors.targetMonth}
          hint="YYYY-MM"
        />

        <View style={styles.riskGroup}>
          <Text style={styles.label}>Investment mix</Text>
          <View style={styles.segment} accessibilityRole="radiogroup">
            {RISKS.map((risk) => {
              const selected = form.risk === risk;
              return (
                <Pressable
                  key={risk}
                  onPress={() => setForm((f) => ({ ...f, risk }))}
                  style={[styles.option, selected && styles.optionSelected]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                >
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{RISK_LABELS[risk]}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.hint}>Short goals usually suit a conservative mix. See the Learn tab.</Text>
        </View>

        <Pressable style={({ pressed }) => [styles.save, pressed && { opacity: 0.85 }]} onPress={save} accessibilityRole="button">
          <Text style={styles.saveText}>Save goal</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  form: { padding: spacing.lg, gap: spacing.lg },
  riskGroup: { gap: spacing.xs },
  label: { fontSize: 14, fontWeight: '600', color: colors.text },
  hint: { fontSize: 13, color: colors.muted },
  segment: { flexDirection: 'row', gap: spacing.sm },
  option: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, alignItems: 'center' },
  optionSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  optionText: { fontSize: 14, color: colors.text },
  optionTextSelected: { color: colors.primary, fontWeight: '600' },
  save: { backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
