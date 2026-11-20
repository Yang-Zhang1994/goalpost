import { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { LESSONS } from '@/content/lessons';
import { colors, spacing } from '@/theme';

export default function LearnScreen() {
  const [open, setOpen] = useState<string | null>(LESSONS[0].id);

  return (
    <ScrollView contentContainerStyle={styles.list}>
      {LESSONS.map((lesson) => {
        const expanded = open === lesson.id;
        return (
          <Pressable
            key={lesson.id}
            style={styles.card}
            onPress={() => setOpen(expanded ? null : lesson.id)}
            accessibilityRole="button"
            accessibilityState={{ expanded }}
          >
            <View style={styles.row}>
              <Text style={styles.title}>{lesson.title}</Text>
              <Text style={styles.chevron}>{expanded ? '−' : '+'}</Text>
            </View>
            <Text style={styles.summary}>{lesson.summary}</Text>
            {expanded ? <Text style={styles.body}>{lesson.body}</Text> : null}
          </Pressable>
        );
      })}
      <Text style={styles.disclaimer}>
        Goalpost is an educational tool, not financial advice. Projections use illustrative return ranges, not forecasts.
        For current account limits, see{' '}
        <Text style={styles.link} onPress={() => Linking.openURL('https://www.canada.ca/en/revenue-agency.html')}>
          the Canada Revenue Agency
        </Text>
        .
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg, gap: spacing.md },
  card: { backgroundColor: colors.card, borderRadius: 12, padding: spacing.lg, gap: spacing.xs, borderWidth: 1, borderColor: colors.border },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  title: { fontSize: 16, fontWeight: '600', color: colors.text, flexShrink: 1 },
  chevron: { fontSize: 18, color: colors.muted, marginLeft: spacing.sm },
  summary: { fontSize: 14, color: colors.muted },
  body: { fontSize: 15, color: colors.text, lineHeight: 22, marginTop: spacing.xs },
  disclaimer: { fontSize: 12, color: colors.muted, lineHeight: 18, marginTop: spacing.sm },
  link: { color: colors.primary, textDecorationLine: 'underline' },
});
