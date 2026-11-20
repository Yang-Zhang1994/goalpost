import { createContext, useContext, useEffect, useReducer, useRef, useState, type ReactNode } from 'react';

import { goalsReducer, type Goal, type GoalsAction } from '@/lib/goals';
import { loadGoals, saveGoals } from '@/lib/storage';

type GoalsState = { goals: Goal[]; ready: boolean; dispatch: (action: GoalsAction) => void };

const GoalsContext = createContext<GoalsState | null>(null);

export function GoalsProvider({ children }: { children: ReactNode }) {
  const [goals, dispatch] = useReducer(goalsReducer, []);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    loadGoals().then((saved) => {
      dispatch({ type: 'loaded', goals: saved });
      loaded.current = true;
      setReady(true);
    });
  }, []);

  // Persist after every change, but never overwrite storage before the first load finishes.
  useEffect(() => {
    if (loaded.current) saveGoals(goals);
  }, [goals]);

  return <GoalsContext.Provider value={{ goals, ready, dispatch }}>{children}</GoalsContext.Provider>;
}

export function useGoals(): GoalsState {
  const ctx = useContext(GoalsContext);
  if (!ctx) throw new Error('useGoals must be used inside GoalsProvider');
  return ctx;
}
