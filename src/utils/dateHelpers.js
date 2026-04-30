import { format, isToday as isTodayDate, subDays, startOfDay, endOfDay } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'EEEE, MMMM d');
};

export const formatTime = (timestamp) => {
  if (!timestamp) return '';
  // Handle Firestore Timestamp or standard JS Date
  const dateObj = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return format(dateObj, 'hh:mm a');
};

export const getTodayString = () => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const getWeekDates = () => {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i);
    dates.push(format(date, 'yyyy-MM-dd'));
  }
  return dates;
};

export const isToday = (dateString) => {
  return dateString === getTodayString();
};