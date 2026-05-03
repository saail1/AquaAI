import { create } from 'zustand';

export const useSleepStore = create((set) => ({
  sleepLogs: [],

  addSleepLog: (log) => set((state) => ({
    sleepLogs: [{ id: Date.now().toString(), ...log }, ...state.sleepLogs]
  })),

  removeSleepLog: (id) => set((state) => ({
    sleepLogs: state.sleepLogs.filter(log => log.id !== id)
  })),
}));