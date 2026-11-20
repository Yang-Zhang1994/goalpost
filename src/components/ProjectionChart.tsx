import { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Path, Text as SvgText } from 'react-native-svg';

import { formatMoney, type ProjectionPoint } from '@/lib/finance';
import { colors, spacing } from '@/theme';

type Props = { points: ProjectionPoint[]; target: number; height?: number };

const PAD = { top: 12, right: 8, bottom: 20, left: 8 };
// SVG text does not inherit the app font on web, where it would fall back to a serif face.
const FONT = Platform.OS === 'web' ? 'system-ui, sans-serif' : undefined;

/** Shaded low–high range, the expected path, and a dashed target line. Sizes itself to its container. */
export function ProjectionChart({ points, target, height = 200 }: Props) {
  const [width, setWidth] = useState(0);
  const last = points[points.length - 1];
  const maxY = Math.max(target, last.high) * 1.08;
  const innerW = width - PAD.left - PAD.right;
  const innerH = height - PAD.top - PAD.bottom;
  const x = (month: number) => PAD.left + (month / Math.max(1, last.month)) * innerW;
  const y = (value: number) => PAD.top + innerH - (Math.max(0, value) / maxY) * innerH;

  const line = (key: 'low' | 'expected' | 'high') =>
    points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.month).toFixed(1)},${y(p[key]).toFixed(1)}`).join(' ');
  const band =
    line('high') +
    ' ' +
    [...points]
      .reverse()
      .map((p) => `L${x(p.month).toFixed(1)},${y(p.low).toFixed(1)}`)
      .join(' ') +
    ' Z';

  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} accessible accessibilityLabel={`Projection chart: expected ${formatMoney(last.expected)} against a ${formatMoney(target)} target`}>
      {width > 0 ? (
        <Svg width={width} height={height}>
          <Path d={band} fill={colors.band} opacity={0.45} />
          <Path d={line('expected')} stroke={colors.primary} strokeWidth={2.5} fill="none" />
          <Line x1={PAD.left} x2={width - PAD.right} y1={y(target)} y2={y(target)} stroke={colors.text} strokeDasharray="5,4" strokeWidth={1} />
          <SvgText x={PAD.left + 4} y={y(target) - 4} fontSize={11} fontFamily={FONT} fill={colors.text}>
            {`Target ${formatMoney(target)}`}
          </SvgText>
          <SvgText x={PAD.left} y={height - 4} fontSize={11} fontFamily={FONT} fill={colors.muted}>
            Today
          </SvgText>
          <SvgText x={width - PAD.right} y={height - 4} fontSize={11} fontFamily={FONT} fill={colors.muted} textAnchor="end">
            {`${last.month} months`}
          </SvgText>
        </Svg>
      ) : (
        <View style={{ height }} />
      )}
      <View style={styles.legend}>
        <View style={[styles.swatch, { backgroundColor: colors.primary }]} />
        <Text style={styles.legendText}>Expected</Text>
        <View style={[styles.swatch, { backgroundColor: colors.band }]} />
        <Text style={styles.legendText}>Weak to strong markets</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legend: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs },
  swatch: { width: 12, height: 12, borderRadius: 2, marginLeft: spacing.sm },
  legendText: { fontSize: 12, color: colors.muted },
});
