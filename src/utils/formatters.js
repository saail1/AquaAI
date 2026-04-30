export const formatMl = (ml) => {
  if (ml == null) return '0ml';
  return `${ml.toLocaleString()}ml`;
};

export const formatGoal = (ml) => {
  if (!ml) return '0L';
  const liters = ml / 1000;
  return Number.isInteger(liters) ? `${liters}L` : `${liters.toFixed(1)}L`;
};

export const formatPercent = (n) => {
  if (n == null) return '0%';
  return `${Math.round(n)}%`;
};

export const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};