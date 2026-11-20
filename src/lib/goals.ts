import type { RiskProfile } from './finance';

export type Goal = {
  id: string;
  name: string;
  target: number;
  saved: number;
  monthly: number;
  /** Target month as YYYY-MM. */
  targetMonth: string;
  risk: RiskProfile;
  createdAt: string;
};

export type GoalForm = {
  name: string;
  target: string;
  saved: string;
  monthly: string;
  targetMonth: string;
  risk: RiskProfile;
};

export type FormErrors = Partial<Record<keyof GoalForm, string>>;

export type GoalsAction =
  | { type: 'loaded'; goals: Goal[] }
  | { type: 'add'; goal: Goal }
  | { type: 'contribute'; id: string; amount: number }
  | { type: 'remove'; id: string };

export function goalsReducer(state: Goal[], action: GoalsAction): Goal[] {
  switch (action.type) {
    case 'loaded':
      return action.goals;
    case 'add':
      return [...state, action.goal];
    case 'contribute':
      return state.map((g) => (g.id === action.id ? { ...g, saved: Math.max(0, g.saved + action.amount) } : g));
    case 'remove':
      return state.filter((g) => g.id !== action.id);
  }
}

function parseAmount(text: string): number {
  return Number(text.replace(/[$,\s]/g, ''));
}

/** Validates form input; returns field errors, or a goal when the input is valid. */
export function validateGoal(form: GoalForm, now: Date, id: string): { errors: FormErrors; goal?: Goal } {
  const errors: FormErrors = {};
  const target = parseAmount(form.target);
  const saved = form.saved.trim() === '' ? 0 : parseAmount(form.saved);
  const monthly = form.monthly.trim() === '' ? 0 : parseAmount(form.monthly);

  if (form.name.trim() === '') errors.name = 'Give the goal a name.';
  if (!Number.isFinite(target) || target <= 0) errors.target = 'Enter a target above $0.';
  if (!Number.isFinite(saved) || saved < 0) errors.saved = 'Enter $0 or more.';
  if (!Number.isFinite(monthly) || monthly < 0) errors.monthly = 'Enter $0 or more.';

  const match = /^(\d{4})-(\d{2})$/.exec(form.targetMonth.trim());
  if (!match || Number(match[2]) < 1 || Number(match[2]) > 12) {
    errors.targetMonth = 'Use YYYY-MM, e.g. 2028-06.';
  } else {
    const months = (Number(match[1]) - now.getFullYear()) * 12 + (Number(match[2]) - 1 - now.getMonth());
    if (months < 1) errors.targetMonth = 'Pick a month after this one.';
  }

  if (Object.keys(errors).length > 0) return { errors };
  return {
    errors,
    goal: {
      id,
      name: form.name.trim(),
      target,
      saved,
      monthly,
      targetMonth: form.targetMonth.trim(),
      risk: form.risk,
      createdAt: now.toISOString(),
    },
  };
}

function monthFromNow(now: Date, months: number): string {
  const d = new Date(now.getFullYear(), now.getMonth() + months, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** Two example goals for a first look at the app: one on track, one behind. */
export function sampleGoals(now: Date): Goal[] {
  const createdAt = now.toISOString();
  return [
    { id: 'sample-emergency', name: 'Emergency fund', target: 5000, saved: 1200, monthly: 250, targetMonth: monthFromNow(now, 18), risk: 'conservative', createdAt },
    { id: 'sample-home', name: 'First home (FHSA)', target: 40000, saved: 3000, monthly: 400, targetMonth: monthFromNow(now, 60), risk: 'balanced', createdAt },
  ];
}
