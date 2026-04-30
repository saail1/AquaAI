import { useState } from 'react';
import { useWaterStore } from '../store/waterStore';
import { useGoalStore } from '../store/goalStore';
import { useAuthStore } from '../store/authStore';
import { getHydrationInsight } from '../services/api/claudeApi';
import { calculateHydrationScore as calcScore } from '../utils/waterHelpers';

export const useAiCoach = () => {
  const { logs, todayTotal } = useWaterStore();
  const { dailyGoal } = useGoalStore();
  const { user } = useAuthStore();
  
  const [insight, setInsight] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsight = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getHydrationInsight({
        logs,
        totalMl: todayTotal,
        goalMl: dailyGoal,
        userName: user?.displayName || 'User'
      });
      setInsight(result);
    } catch (err) {
      setError(err.message || 'Failed to get insight');
    } finally {
      setIsLoading(false);
    }
  };

  const score = calcScore(logs, dailyGoal);

  return { insight, score, isLoading, error, fetchInsight };
};