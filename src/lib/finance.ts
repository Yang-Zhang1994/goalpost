// Savings-goal projections with monthly compounding.
// Return assumptions are illustrative ranges for teaching, not forecasts.

export type RiskProfile = 'conservative' | 'balanced' | 'growth';

export type ReturnRange = { low: number; expected: number; high: number };

export const RETURN_ASSUMPTIONS: Record<RiskProfile, ReturnRange> = {
  conservative: { low: 0.01, expected: 0.03, high: 0.05 },
  balanced: { low: 0.0, expected: 0.05, high: 0.09 },
  growth: { low: -0.02, expected: 0.065, high: 0.13 },
};

export const RISK_LABELS: Record<RiskProfile, string> = {
  conservative: 'Conservative',
  balanced: 'Balanced',
  growth: 'Growth',
};

/** Whole months from `from` until the first day of the target month (never negative). */
export function monthsUntil(targetMonth: string, from: Date): number {
  const [year, month] = targetMonth.split('-').map(Number);
  const months = (year - from.getFullYear()) * 12 + (month - 1 - from.getMonth());
  return Math.max(0, months);
}

function monthlyRate(annualRate: number): number {
  return Math.pow(1 + annualRate, 1 / 12) - 1;
}

/** Balance after `months` of compounding, adding `monthly` at the end of each month. */
export function futureValue(current: number, monthly: number, annualRate: number, months: number): number {
  const r = monthlyRate(annualRate);
  if (r === 0) return current + monthly * months;
  const growth = Math.pow(1 + r, months);
  return current * growth + monthly * ((growth - 1) / r);
}

/** Monthly contribution needed to reach `target` in `months`; 0 if already on course. */
export function requiredMonthly(target: number, current: number, annualRate: number, months: number): number {
  if (months <= 0) return Math.max(0, target - current);
  const r = monthlyRate(annualRate);
  const growth = Math.pow(1 + r, months);
  const gap = target - current * growth;
  if (gap <= 0) return 0;
  return r === 0 ? gap / months : (gap * r) / (growth - 1);
}

export type ProjectionPoint = { month: number; low: number; expected: number; high: number };

/** One point per month from today to the target date, for the low / expected / high return cases. */
export function projectionSeries(current: number, monthly: number, risk: RiskProfile, months: number): ProjectionPoint[] {
  const range = RETURN_ASSUMPTIONS[risk];
  return Array.from({ length: months + 1 }, (_, m) => ({
    month: m,
    low: futureValue(current, monthly, range.low, m),
    expected: futureValue(current, monthly, range.expected, m),
    high: futureValue(current, monthly, range.high, m),
  }));
}

export type GoalOutlook = {
  months: number;
  projected: ReturnRange;
  onTrack: boolean;
  /** Extra per month needed on top of the current plan to hit the target in the expected case. */
  extraMonthly: number;
  contributed: number;
  growth: number;
};

export function outlook(target: number, current: number, monthly: number, risk: RiskProfile, months: number): GoalOutlook {
  const range = RETURN_ASSUMPTIONS[risk];
  const projected = {
    low: futureValue(current, monthly, range.low, months),
    expected: futureValue(current, monthly, range.expected, months),
    high: futureValue(current, monthly, range.high, months),
  };
  const needed = requiredMonthly(target, current, range.expected, months);
  const contributed = current + monthly * months;
  return {
    months,
    projected,
    onTrack: projected.expected >= target,
    extraMonthly: Math.max(0, needed - monthly),
    contributed,
    growth: projected.expected - contributed,
  };
}

export function formatMoney(value: number): string {
  return '$' + Math.round(value).toLocaleString('en-CA');
}
