import { create } from 'zustand';

const calculateGoalFromWeight = (weight, activityLevel) => {
  if (!weight) return 2500;
  const base = weight * 35;
  const bonus = activityLevel === 'high' ? 600 : activityLevel === 'medium' ? 300 : 0;
  return Math.round(base + bonus);
};

export const useGoalStore = create((set) => ({
  dailyGoal: 2500,
  weight: null,
  activityLevel: 'low', // 'low', 'medium', 'high'
  reminderEnabled: false,
  reminderInterval: '60',
  streak: 0,
  longestStreak: 0,

  setGoal: (goal) => set({ dailyGoal: goal }),

  setWeightAndActivity: (weight, activityLevel) => set({
    weight,
    activityLevel,
    dailyGoal: calculateGoalFromWeight(weight, activityLevel),
  }),

  toggleReminder: (enabled) => set({ reminderEnabled: enabled }),
  setInterval: (interval) => set({ reminderInterval: interval }),
  updateStreak: (streakData) => set((state) => ({ ...state, ...streakData })),
}));