import { fireEvent, render, screen } from '@testing-library/react-native';

import { GoalCard } from '@/components/GoalCard';
import type { Goal } from '@/lib/goals';

const now = new Date(2026, 10, 19);
const base: Goal = {
  id: 'g1',
  name: 'Emergency fund',
  target: 5000,
  saved: 1000,
  monthly: 100,
  targetMonth: '2027-11',
  risk: 'conservative',
  createdAt: now.toISOString(),
};

describe('GoalCard', () => {
  it('shows a behind goal with the extra monthly amount needed', async () => {
    await render(<GoalCard goal={base} now={now} onPress={() => {}} />);
    expect(screen.getByText('Behind')).toBeTruthy();
    expect(screen.getByText(/Add \$\d[\d,]*\/mo to reach it by 2027-11/)).toBeTruthy();
  });

  it('shows an on-track goal with its projected balance', async () => {
    await render(<GoalCard goal={{ ...base, monthly: 400 }} now={now} onPress={() => {}} />);
    expect(screen.getByText('On track')).toBeTruthy();
    expect(screen.getByText(/Projected \$/)).toBeTruthy();
  });

  it('opens the goal when pressed', async () => {
    const onPress = jest.fn();
    await render(<GoalCard goal={base} now={now} onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
