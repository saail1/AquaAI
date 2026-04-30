import { useEffect } from 'react';
import { useWaterStore } from '../store/waterStore';
import { useAuthStore } from '../store/authStore';
import { getTodayString } from '../utils/dateHelpers';

export const useWater = () => {
  const { logs, todayTotal, isLoading, fetchTodayLogs, addLog, removeLog } = useWaterStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.uid) {
      fetchTodayLogs(user.uid, getTodayString());
    }
  }, [user?.uid]);

  const handleAddLog = async (drinkType, label, ml) => {
    if (!user?.uid) return { success: false, error: 'Not authenticated' };
    
    const logData = {
      drinkType,
      label,
      ml,
      date: getTodayString()
    };
    
    return await addLog(user.uid, logData);
  };

  const handleRemoveLog = async (logId, ml) => {
    if (!user?.uid) return { success: false, error: 'Not authenticated' };
    return await removeLog(user.uid, logId, ml);
  };

  return { logs, todayTotal, isLoading, addLog: handleAddLog, removeLog: handleRemoveLog };
};