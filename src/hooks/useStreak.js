import { useEffect } from 'react';
import { useGoalStore } from '../store/goalStore';
import { useAuthStore } from '../store/authStore';
import { getStreak, updateStreak as updateFirebaseStreak } from '../services/firebase/firestore';

export const useStreak = () => {
  const { streak, longestStreak, updateStreak: setLocalStreak } = useGoalStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchStreak = async () => {
      if (user?.uid) {
        const { data } = await getStreak(user.uid);
        if (data) {
          setLocalStreak({
            streak: data.currentStreak || 0,
            longestStreak: data.longestStreak || 0
          });
        }
      }
    };
    fetchStreak();
  }, [user?.uid]);

  const updateStreak = async (newStreak, newLongest) => {
    if (!user?.uid) return;
    
    const streakData = {
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastActiveDate: new Date().toISOString().split('T')[0]
    };
    
    setLocalStreak({ streak: newStreak, longestStreak: newLongest });
    await updateFirebaseStreak(user.uid, streakData);
  };

  return { streak, longestStreak, updateStreak };
};