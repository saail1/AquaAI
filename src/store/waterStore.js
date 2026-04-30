import { create } from 'zustand';
import { getTodayLogs, addWaterLog, deleteWaterLog } from '../services/firebase/firestore';

export const useWaterStore = create((set, get) => ({
  logs: [],
  todayTotal: 0,
  isLoading: false,

  setLoading: (isLoading) => set({ isLoading }),

  fetchTodayLogs: async (userId, dateStr) => {
    set({ isLoading: true });
    const { logs, error } = await getTodayLogs(userId, dateStr);
    
    if (!error) {
      // Calculate total ml from the fetched logs
      const total = logs.reduce((sum, log) => sum + log.ml, 0);
      set({ logs, todayTotal: total, isLoading: false });
    } else {
      console.error("Error fetching logs:", error);
      set({ isLoading: false });
    }
  },

  addLog: async (userId, logData) => {
    // Optimistic UI updates could go here, but for strict data integrity 
    // we wait for the database confirmation first.
    const { id, error } = await addWaterLog(userId, logData);
    
    if (!error) {
      const newLog = { id, ...logData };
      set((state) => ({
        logs: [...state.logs, newLog],
        todayTotal: state.todayTotal + logData.ml,
      }));
      return { success: true };
    }
    return { success: false, error };
  },

  removeLog: async (userId, logId, mlToRemove) => {
    const { success, error } = await deleteWaterLog(userId, logId);
    
    if (success) {
      set((state) => ({
        logs: state.logs.filter((log) => log.id !== logId),
        todayTotal: state.todayTotal - mlToRemove,
      }));
      return { success: true };
    }
    return { success: false, error };
  }
}));