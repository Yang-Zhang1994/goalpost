import { outlook, monthsUntil } from '@/lib/finance';
import { goalsReducer, sampleGoals, validateGoal, type Goal, type GoalForm } from '@/lib/goals';

const now = new Date(2026, 10, 19);
const form: GoalForm = { name: 'Trip', target: '3,000', saved: '$500', monthly: '150', targetMonth: '2027-08', risk: 'conservative' };

describe('validateGoal', () => {
  it('builds a goal from valid input, accepting $ and commas', () => {
    const { errors, goal } = validateGoal(form, now, 'g1');
    expect(errors).toEqual({});
    expect(goal).toMatchObject({ id: 'g1', name: 'Trip', target: 3000, saved: 500, monthly: 150, targetMonth: '2027-08' });
  });

  it('treats blank saved and monthly amounts as 0', () => {
    const { goal } = validateGoal({ ...form, saved: '', monthly: ' ' }, now, 'g2');
    expect(goal?.saved).toBe(0);
    expect(goal?.monthly).toBe(0);
  });

  it('reports every invalid field', () => {
    const { errors, goal } = validateGoal(
      { ...form, name: ' ', target: '0', saved: '-5', monthly: 'abc', targetMonth: '08/2027' },
      now,
      'g3',
    );
    expect(goal).toBeUndefined();
    expect(Object.keys(errors).sort()).toEqual(['monthly', 'name', 'saved', 'target', 'targetMonth']);
  });

  it('rejects a target month that is not in the future', () => {
    expect(validateGoal({ ...form, targetMonth: '2026-11' }, now, 'g4').errors.targetMonth).toBeDefined();
    expect(validateGoal({ ...form, targetMonth: '2027-13' }, now, 'g5').errors.targetMonth).toBeDefined();
  });
});

describe('goalsReducer', () => {
  const goal = validateGoal(form, now, 'g1').goal as Goal;

  it('adds, contributes to, and removes goals', () => {
    let state = goalsReducer([], { type: 'add', goal });
    state = goalsReducer(state, { type: 'contribute', id: 'g1', amount: 250 });
    expect(state[0].saved).toBe(750);
    state = goalsReducer(state, { type: 'remove', id: 'g1' });
    expect(state).toEqual([]);
  });

  it('never lets saved drop below 0', () => {
    const state = goalsReducer([goal], { type: 'contribute', id: 'g1', amount: -10000 });
    expect(state[0].saved).toBe(0);
  });
});

describe('sampleGoals', () => {
  it('creates valid goals dated after today, one on track and one behind', () => {
    const samples = sampleGoals(now);
    expect(samples).toHaveLength(2);
    const onTrack = samples.map((g) => outlook(g.target, g.saved, g.monthly, g.risk, monthsUntil(g.targetMonth, now)).onTrack);
    expect(onTrack).toEqual([true, false]);
  });
});
