import { create } from 'zustand';

export const useStepStore = create((set) => ({
  steps: 0,
  stepGoal: 10000,
  isTracking: false,
  calorieLogs: [],

  setSteps: (steps) => set({ steps }),
  setStepGoal: (stepGoal) => set({ stepGoal }),
  setTracking: (isTracking) => set({ isTracking }),
  resetSteps: () => set({ steps: 0 }),

  addCalorieLog: (log) => set((state) => ({
    calorieLogs: [{ id: Date.now().toString(), ...log }, ...state.calorieLogs]
  })),

  removeCalorieLog: (id) => set((state) => ({
    calorieLogs: state.calorieLogs.filter(log => log.id !== id)
  })),
}));