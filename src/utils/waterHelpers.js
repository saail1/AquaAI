export const calculatePercent = (total, goal) => {
  if (!goal || goal === 0) return 0;
  const percent = (total / goal) * 100;
  return Math.min(Math.round(percent), 100); // Cap at 100% for UI progress bars
};

export const calculateRemaining = (total, goal) => {
  const remaining = goal - total;
  return remaining > 0 ? remaining : 0;
};

export const calculateWaterHeight = (percent, maxHeight) => {
  return (percent / 100) * maxHeight;
};

export const getHydrationStatus = (percent) => {
  if (percent < 25) return 'low';
  if (percent < 70) return 'moderate';
  if (percent < 100) return 'good';
  return 'excellent';
};

export const calculateHydrationScore = (logs, goal) => {
  if (!logs || logs.length === 0) return 0;
  
  const total = logs.reduce((sum, log) => sum + log.ml, 0);
  const percentComplete = Math.min((total / goal) * 100, 100);
  
  // Base score is mostly driven by volume met (60% weight)
  let score = percentComplete * 0.6;
  
  // Add points for consistency (multiple drinks vs one giant chug) (40% weight)
  const uniqueHours = new Set(
    logs.map(log => {
      const d = log.timestamp?.toDate ? log.timestamp.toDate() : new Date(log.timestamp);
      return d.getHours();
    })
  ).size;
  
  // Assuming ideal is drinking across 8+ different hours
  const consistencyScore = Math.min((uniqueHours / 8) * 100, 100);
  score += consistencyScore * 0.4;
  
  return Math.round(score);
};