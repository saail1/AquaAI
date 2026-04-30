import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useGoalStore } from '../store/goalStore';
import { getWeeklyLogs } from '../services/firebase/firestore';
import { getWeekDates } from '../utils/dateHelpers';

export const useStats = () => {
  const { user } = useAuthStore();
  const { dailyGoal } = useGoalStore();
  const [stats, setStats] = useState({
    weeklyAvg: 0,
    bestDay: 0,
    worstDay: 0,
    goalHitRate: 0,
    topDrink: 'Water',
    hourlyBreakdown: Array(24).fill(0),
    dailyTotals: {},
    isLoading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.uid) return;
      
      setStats(prev => ({ ...prev, isLoading: true }));
      const dates = getWeekDates();
      // Fetch logs from 7 days ago to today
      const { logs, error } = await getWeeklyLogs(user.uid, dates[6], dates[0]);
      
      if (!error && logs.length > 0) {
        let total = 0;
        const dailyTots = {};
        const hourly = Array(24).fill(0);
        const drinkCounts = {};
        
        logs.forEach(log => {
          total += log.ml;
          dailyTots[log.date] = (dailyTots[log.date] || 0) + log.ml;
          
          const d = log.timestamp?.toDate ? log.timestamp.toDate() : new Date(log.timestamp);
          hourly[d.getHours()] += log.ml;
          
          drinkCounts[log.drinkType] = (drinkCounts[log.drinkType] || 0) + 1;
        });

        const totalsArray = Object.values(dailyTots);
        const best = Math.max(...totalsArray, 0);
        const worst = totalsArray.length > 0 ? Math.min(...totalsArray) : 0;
        
        let topDrinkType = 'Water';
        let maxCount = 0;
        for (const [type, count] of Object.entries(drinkCounts)) {
          if (count > maxCount) {
            maxCount = count;
            topDrinkType = type;
          }
        }

        setStats({
          weeklyAvg: Math.round(total / 7),
          bestDay: best,
          worstDay: worst,
          goalHitRate: totalsArray.filter(t => t >= dailyGoal).length,
          topDrink: topDrinkType.charAt(0).toUpperCase() + topDrinkType.slice(1),
          hourlyBreakdown: hourly,
          dailyTotals: dailyTots,
          isLoading: false
        });
      } else {
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchStats();
  }, [user?.uid, dailyGoal]);

  return stats;
};