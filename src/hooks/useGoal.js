import { useGoalStore } from '../store/goalStore';
import { useWaterStore } from '../store/waterStore';
import { calculatePercent, calculateRemaining } from '../utils/waterHelpers';
import { scheduleWaterReminder, cancelAllReminders } from '../services/notifications';

export const useGoal = () => {
  const { dailyGoal, setGoal, reminderEnabled, reminderInterval, toggleReminder, setInterval } = useGoalStore();
  const { todayTotal } = useWaterStore();

  const percentComplete = calculatePercent(todayTotal, dailyGoal);
  const remaining = calculateRemaining(todayTotal, dailyGoal);

  const handleToggleReminder = async (enabled) => {
    toggleReminder(enabled);
    if (enabled) {
      const success = await scheduleWaterReminder(parseInt(reminderInterval) || 60);
      if (!success) {
        toggleReminder(false);
        alert('Permission denied! Please allow notifications in settings.');
      }
    } else {
      await cancelAllReminders();
    }
  };

  const handleSetInterval = async (interval) => {
    setInterval(interval);
    if (reminderEnabled) {
      await scheduleWaterReminder(parseInt(interval) || 60);
    }
  };

  return {
    goal: dailyGoal,
    updateGoal: setGoal,
    remaining,
    percentComplete,
    reminderEnabled,
    reminderInterval,
    toggleReminder: handleToggleReminder,
    setInterval: handleSetInterval,
  };
};