import { useGoalStore } from '../store/goalStore';
import { useWaterStore } from '../store/waterStore';
import { calculatePercent, calculateRemaining } from '../utils/waterHelpers';

export const useGoal = () => {
  const { dailyGoal, setGoal, reminderEnabled, reminderInterval, toggleReminder, setInterval } = useGoalStore();
  const { todayTotal } = useWaterStore();

  const percentComplete = calculatePercent(todayTotal, dailyGoal);
  const remaining = calculateRemaining(todayTotal, dailyGoal);

  return {
    goal: dailyGoal,
    updateGoal: setGoal,
    remaining,
    percentComplete,
    reminderEnabled,
    reminderInterval,
    toggleReminder,
    setInterval
  };
};