import { futureValue, monthsUntil, outlook, projectionSeries, requiredMonthly } from '@/lib/finance';

describe('monthsUntil', () => {
  it('counts whole months to the target month', () => {
    expect(monthsUntil('2027-12', new Date(2026, 10, 19))).toBe(13);
  });

  it('never goes negative for past months', () => {
    expect(monthsUntil('2025-01', new Date(2026, 10, 19))).toBe(0);
  });
});

describe('futureValue', () => {
  it('is just deposits when the return is 0%', () => {
    expect(futureValue(1000, 100, 0, 12)).toBe(2200);
  });

  it('compounds a lump sum to the annual rate after 12 months', () => {
    expect(futureValue(1000, 0, 0.05, 12)).toBeCloseTo(1050, 6);
  });

  it('adds growth on top of monthly deposits', () => {
    const fv = futureValue(0, 100, 0.05, 12);
    expect(fv).toBeGreaterThan(1200);
    expect(fv).toBeLessThan(1230);
  });
});

describe('requiredMonthly', () => {
  it('inverts futureValue', () => {
    const monthly = requiredMonthly(10000, 2000, 0.05, 36);
    expect(futureValue(2000, monthly, 0.05, 36)).toBeCloseTo(10000, 6);
  });

  it('is 0 when savings already grow past the target', () => {
    expect(requiredMonthly(1000, 1000, 0.05, 12)).toBe(0);
  });

  it('handles a 0% return without dividing by zero', () => {
    expect(requiredMonthly(1200, 0, 0, 12)).toBe(100);
  });
});

describe('outlook', () => {
  it('flags a goal that falls short and says how much more is needed per month', () => {
    const view = outlook(10000, 0, 100, 'conservative', 24);
    expect(view.onTrack).toBe(false);
    expect(futureValue(0, 100 + view.extraMonthly, 0.03, 24)).toBeCloseTo(10000, 6);
  });

  it('marks a well-funded goal as on track with no extra needed', () => {
    const view = outlook(5000, 4000, 200, 'balanced', 12);
    expect(view.onTrack).toBe(true);
    expect(view.extraMonthly).toBe(0);
  });

  it('splits the expected balance into contributions and growth', () => {
    const view = outlook(5000, 1000, 100, 'growth', 24);
    expect(view.contributed).toBe(3400);
    expect(view.contributed + view.growth).toBeCloseTo(view.projected.expected, 6);
  });
});

describe('projectionSeries', () => {
  it('has one point per month and keeps low ≤ expected ≤ high', () => {
    const points = projectionSeries(500, 50, 'growth', 36);
    expect(points).toHaveLength(37);
    for (const p of points.slice(1)) {
      expect(p.low).toBeLessThanOrEqual(p.expected);
      expect(p.expected).toBeLessThanOrEqual(p.high);
    }
  });
});
