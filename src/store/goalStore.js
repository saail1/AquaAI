import { create } from 'zustand';

export const useGoalStore = create((set) => ({
  dailyGoal: 2500, // Default 2.5L
  reminderEnabled: false,
  reminderInterval: '60',
  streak: 0,
  longestStreak: 0,

  setGoal: (goal) => set({ dailyGoal: goal }),
  
  toggleReminder: (enabled) => set({ reminderEnabled: enabled }),
  
  setInterval: (interval) => set({ reminderInterval: interval }),
  
  updateStreak: (streakData) => set((state) => ({ 
    ...state, 
    ...streakData 
  }))
}));